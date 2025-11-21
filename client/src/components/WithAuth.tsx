import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function WithAuth<P extends object>(Component: React.ComponentType<P>) {
  return function Protected(props: P) {
    const { user, loading } = useAuth();
    const [, setLocation] = useLocation();

    // enquanto carrega, você pode mostrar loading ou skeleton
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }

    if (!user) {
      // redireciona para login
      setLocation("/login");
      return null;
    }

    return <Component {...props} />;
  };
}
