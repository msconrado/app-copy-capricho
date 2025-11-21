import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

type UseAuthState = {
    user: any | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
};

export function useAuth() {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Inicial: pega sessão atual
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (!mounted) return;
                setUser(data.session?.user ?? null);
            } catch (e: any) {
                setError(String(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // Listener de mudanças de sessão (login/logout)
    useEffect(() => {
        const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
            // session pode ser null (logout)
            setUser(session?.user ?? null);
            // Se quiser: atualizar dados do usuário no seu storage local
        });

        return () => {
            sub.subscription.unsubscribe();
        };
    }, []);

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            setUser(null);
        } catch (e: any) {
            setError(e?.message ?? String(e));
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const state: UseAuthState = useMemo(
        () => ({
            user,
            loading,
            error,
            isAuthenticated: Boolean(user),
        }),
        [user, loading, error]
    );

    return {
        ...state,
        logout,
        refresh: async () => {
            setLoading(true);
            try {
                const { data } = await supabase.auth.getSession();
                setUser(data.session?.user ?? null);
            } finally {
                setLoading(false);
            }
        },
    };
}
