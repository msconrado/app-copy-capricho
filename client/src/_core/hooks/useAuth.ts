import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Carrega sessão no início
    useEffect(() => {
        const loadSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        loadSession();

        // Listener de login/logout automático
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // LOGIN COM GOOGLE
    const loginWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/auth/callback',
            },
        });

        if (error) console.error('Erro ao logar:', error);
    }, []);

    // LOGOUT
    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
    }, []);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
    };
}
