import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";
import { initializeAnalytics } from "./lib/analytics";

// Initialize tracking services
initializeAnalytics();

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;
  // Prevent redirect loop when already on the login page
  try {
    const current = window.location.pathname;
    const loginPath = new URL(getLoginUrl(), window.location.origin).pathname;
    if (current === loginPath) {
      console.warn("Detected UNAUTHORIZED error while already on login page; skipping redirect.", error);
      return;
    }
  } catch (e) {
    // Fallback: if parsing fails, still avoid infinite loop by checking simple equality
    if (window.location.href === getLoginUrl()) return;
  }

  console.warn("Redirecting to login due to UNAUTHORIZED trpc error:", error);
  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
          // Debugging: log outgoing trpc requests and responses to diagnose auth loops
          const url = typeof input === "string" ? input : input.toString();
          console.debug("[trpc] request ->", url, init?.method ?? "GET");
          return globalThis.fetch(input, {
            ...(init ?? {}),
            credentials: "include",
          }).then(async (res) => {
            console.debug("[trpc] response <-", url, res.status);
            if (!res.ok) {
              try {
                const txt = await res.clone().text();
                console.warn("[trpc] response body:", txt);
              } catch (e) {
                /* ignore */
              }
            }
            return res;
          });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
