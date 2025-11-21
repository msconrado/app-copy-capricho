import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const loginUrl = getLoginUrl();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      setLocation("/profile");
    }
  }, [user, loading, setLocation]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exchangeToken = async (accessToken?: string | null) => {
    if (!accessToken) return;
    try {
      const res = await fetch("/api/oauth/supabase/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });
      if (res.ok) {
        // Redirect to profile where `useAuth` will pick up the session cookie
        window.location.href = "/profile";
        return true;
      } else {
        const body = await res.text();
        console.error("Exchange failed", body);
        setError(body || "Failed to establish session with server");
        return false;
      }
    } catch (err) {
      console.error("Exchange error", err);
      setError(String(err));
      return false;
    }
  };

  // On mount, if Supabase already has a session (after OAuth redirect), exchange token
  useEffect(() => {
    (async () => {
      try {
        const s = await supabase.auth.getSession();
        const accessToken = s?.data?.session?.access_token;
        if (accessToken) {
          await exchangeToken(accessToken);
        }
      } catch (e) {
        console.error("Error checking supabase session", e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Será que Ele(a) Gosta de Mim?
          </h1>
          <p className="text-gray-600">Descubra a verdade sobre os sentimentos da pessoa amada</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-white border-2 border-purple-200 shadow-lg">
          <h2 className="text-2xl font-bold text-purple-900 mb-2">Bem-vindo de volta!</h2>
          <p className="text-gray-600 mb-6">
            Faça login para acessar seu perfil, histórico de quizzes e assinatura.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-pink-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Histórico de Quizzes</p>
                <p className="text-sm text-gray-600">Revise todos os seus testes anteriores</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Conselheiro Amoroso</p>
                <p className="text-sm text-gray-600">Dicas diárias personalizadas para sua situação</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Gerenciar Assinatura</p>
                <p className="text-sm text-gray-600">Controle seu plano e renovações</p>
              </div>
            </div>
          </div>

          {/* Removed top CTA to show email/password form directly */}

          {/* Email / Password form */}
          <div className="mt-6">
            <input
              className="w-full mb-2 p-3 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full mb-2 p-3 border rounded"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  setProcessing(true);
                  setError(null);
                  try {
                    // Criar conta
                    const { data, error } = await supabase.auth.signUp({
                      email,
                      password,
                      options: {
                        data: { full_name: undefined },
                        // Ensure the confirmation link redirects to the front-end on the correct port
                        emailRedirectTo: window.location.origin + "/login",
                      },
                    } as any);
                    if (error) throw error;

                    // Após criar, tentar logar automaticamente
                    const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
                      email,
                      password,
                    } as any);
                    if (signinError) {
                      // Se não conseguiu logar automaticamente, mostrar mensagem
                      setError(signinError.message || String(signinError));
                      return;
                    }

                    const accessToken = signinData?.session?.access_token ?? (await supabase.auth.getSession()).data.session?.access_token;
                    if (!accessToken) {
                      setError("Não foi possível obter sessão após criar conta. Verifique seu email para confirmar.");
                      return;
                    }

                    await exchangeToken(accessToken);
                  } catch (e: any) {
                    setError(e?.message || String(e));
                  } finally {
                    setProcessing(false);
                  }
                }}
                className="flex-1"
              >
                Criar conta
              </Button>

              <Button
                onClick={async () => {
                  setProcessing(true);
                  setError(null);
                  try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                      email,
                      password,
                    } as any);
                    if (error) throw error;
                    const accessToken = data?.session?.access_token ?? (await supabase.auth.getSession()).data.session?.access_token;
                    if (!accessToken) throw new Error("Falha ao obter access token");
                    await exchangeToken(accessToken);
                  } catch (e: any) {
                    setError(e?.message || String(e));
                  } finally {
                    setProcessing(false);
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                Entrar
              </Button>
            </div>
          </div>

          {/* Divider */}
          {/* <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div> */}

{/* Google Login */}
<a href="/api/oauth/google">
  <Button className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-6 text-lg flex items-center justify-center gap-2">
    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
    Continuar com Google
  </Button>
</a>

{/* Supabase social login removed: use server-side /api/oauth/google instead */}

<div className="my-6 flex items-center gap-4">
  <div className="flex-1 h-px bg-gray-300"></div>
  <span className="text-gray-500 text-sm">ou</span>
  <div className="flex-1 h-px bg-gray-300"></div>
</div>


          {/* Back to Home */}
          <Button
            variant="outline"
            className="w-full border-2 border-purple-200 hover:bg-purple-50"
            onClick={() => setLocation("/")}
          >
            Voltar para Home
          </Button>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Precisa de ajuda para entrar? Entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
}

function getLoginUrl() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/api/oauth/google/callback'; // backend callback
  const scope = encodeURIComponent('openid email profile');
  const responseType = 'code';

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;
}