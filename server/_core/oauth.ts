import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export function registerOAuthRoutes(app: express.Express) {
  const router = express.Router();

  // Todas as rotas ficam sob /api/oauth
  app.use("/api/oauth", router);

  // 1) Redirect para Google
  router.get("/google", (req, res) => {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const scope = ["openid", "email", "profile"].join(" ");

    const url =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      "&response_type=code" +
      `&scope=${encodeURIComponent(scope)}`;

    return res.redirect(url);
  });

  // 2) Callback do Google
  router.get("/google/callback", async (req, res) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("Missing code");

    try {
      // Troca code por tokens (Google espera form-urlencoded)
      const params = new URLSearchParams();
      params.append("code", code);
      params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
      params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
      params.append("redirect_uri", process.env.GOOGLE_REDIRECT_URI!);
      params.append("grant_type", "authorization_code");

      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("[OAuth] Google token response:", tokenRes.data);

      const { id_token } = tokenRes.data ?? {};

      if (!id_token) {
        console.error(
          "Google token response did not include id_token:",
          tokenRes.data
        );
        return res.status(500).send("OAuth Error: missing id_token");
      }

      // Decodificar ID Token do Google (base64url -> base64)
      const parts = id_token.split(".");
      const b64 = parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(parts[1].length + ((4 - (parts[1].length % 4)) % 4), "=");
      const googleUser = JSON.parse(
        Buffer.from(b64, "base64").toString("utf8")
      );

      // Criar JWT próprio do seu sistema
      const internalJwt = jwt.sign(
        {
          sub: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // Opcional: sincronizar/crear usuário no Supabase usando a Service Role Key
      try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && serviceRole && googleUser.email) {
          // Tentar criar usuário via Admin API; se já existir, ignorar o erro
          try {
            await axios.post(
              `${supabaseUrl}/auth/v1/admin/users`,
              {
                email: googleUser.email,
                user_metadata: {
                  full_name: googleUser.name,
                  picture: googleUser.picture,
                },
                email_confirm: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${serviceRole}`,
                  apikey: serviceRole,
                  "Content-Type": "application/json",
                },
              }
            );
          } catch (err: any) {
            // Supabase retorna 409 ou similar se o usuário já existir; apenas logar e seguir
            console.warn(
              "Supabase admin user creation skipped or failed:",
              err?.response?.data ?? err.message ?? err
            );
          }
        }
      } catch (err) {
        console.warn("Supabase sync error (non-fatal):", err);
      }

      // Setar cookie de sessão e redirecionar para o frontend (sem expor token)
      try {
        const cookieOptions = getSessionCookieOptions(req);
        console.log("[OAuth] Setting cookie with options:", cookieOptions);
        res.cookie(COOKIE_NAME, internalJwt, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });
        console.log("[OAuth] Cookie set; headers will include Set-Cookie");
      } catch (err) {
        console.warn("Failed to set session cookie:", err);
      }

      const redirectUrl = `${process.env.FRONTEND_URL ?? "/"}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("Google OAuth Error:", err);
      return res.status(500).send("OAuth Error");
    }
  });

  // 3) Exchange Supabase access token for internal session
  router.post("/supabase/exchange", async (req, res) => {
    const accessToken =
      req.body?.access_token || req.headers?.authorization?.split(" ")[1];
    if (!accessToken) return res.status(400).send("Missing access_token");

    try {
      // Get user info from Supabase using the access token
      const supabaseUrl = process.env.SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY;
      if (!supabaseUrl)
        return res.status(500).send("SUPABASE_URL not configured");

      const userRes = await axios.get(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: anonKey,
        },
      });

      const user = userRes.data;
      if (!user || !user.id) {
        console.error("Supabase user lookup failed", userRes.data);
        return res.status(500).send("Failed to fetch user from Supabase");
      }

      // Create internal session token (reuse sdk signing)
      const internalJwt = await sdk.createSessionToken(user.id, {
        name:
          (user.user_metadata && user.user_metadata.full_name) ||
          user.email ||
          "",
      });

      // Sync user into local DB (if available)
      try {
        const db = await import("../db");
        await db.upsertUser({
          openId: user.id,
          name: (user.user_metadata && user.user_metadata.full_name) || null,
          email: user.email ?? null,
          loginMethod: "supabase",
          lastSignedIn: new Date(),
        });
      } catch (err) {
        console.warn("Failed to upsert Supabase user into DB:", err);
      }

      // Set cookie
      try {
        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, internalJwt, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });
      } catch (err) {
        console.warn(
          "Failed to set session cookie for Supabase exchange:",
          err
        );
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error(
        "Supabase exchange error:",
        err?.response?.data ?? err?.message ?? err
      );
      return res.status(500).send("Supabase exchange failed");
    }
  });
}
