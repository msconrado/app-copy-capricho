import { useEffect } from "react";

export function useHandleGoogleToken() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    // Salva o token
    localStorage.setItem("auth_token", token);

    // Remove o parâmetro da URL
    // Recarrega para garantir que o cliente inicialize com a sessão
    // (o backend agora seta um cookie de sessão no callback OAuth)
    try {
      window.history.replaceState({}, "", window.location.pathname);
      // Replace para não adicionar history entry
      window.location.replace(window.location.pathname);
    } catch (e) {
      // Fallback: reload normal
      window.location.reload();
    }
  }, []);
}
