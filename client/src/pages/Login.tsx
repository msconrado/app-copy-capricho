import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';

export default function Login() {
    const [, setLocation] = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔥 Checar sessão do supabase ao carregar
    useEffect(() => {
        supabase.auth.getSession().then((res) => {
            if (res.data.session) {
                setLocation('/profile');
            }
        });
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

                <Card className="p-8 bg-white border-2 border-purple-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-purple-900 mb-2">Bem-vindo de volta!</h2>
                    <p className="text-gray-600 mb-6">Faça login para acessar seu perfil, histórico de quizzes e assinatura.</p>

                    {/* Email / Password */}
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
                            {/* Criar conta */}
                            <Button
                                onClick={async () => {
                                    setProcessing(true);
                                    setError(null);
                                    try {
                                        const { error } = await supabase.auth.signUp({
                                            email,
                                            password,
                                            options: {
                                                emailRedirectTo: window.location.origin + '/login',
                                            },
                                        });
                                        if (error) throw error;

                                        alert('Verifique seu email para confirmar a conta.');
                                    } catch (e: any) {
                                        setError(e.message);
                                    } finally {
                                        setProcessing(false);
                                    }
                                }}
                                className="flex-1"
                            >
                                Criar conta
                            </Button>

                            {/* Entrar */}
                            <Button
                                onClick={async () => {
                                    setProcessing(true);
                                    setError(null);
                                    try {
                                        const { error } = await supabase.auth.signInWithPassword({
                                            email,
                                            password,
                                        });

                                        if (error) throw error;

                                        setLocation('/profile');
                                    } catch (e: any) {
                                        setError(e.message);
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

                    {/* Google login */}
                    <Button
                        className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-6 text-lg flex items-center justify-center gap-2"
                        onClick={async () => {
                            await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: window.location.origin + '/profile',
                                },
                            });
                        }}
                    >
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
                        Continuar com Google
                    </Button>

                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-gray-500 text-sm">ou</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <Button variant="outline" className="w-full border-2 border-purple-200 hover:bg-purple-50" onClick={() => setLocation('/')}>
                        Voltar para Home
                    </Button>
                </Card>

                <p className="text-center text-gray-600 text-sm mt-6">Precisa de ajuda para entrar? Entre em contato com o suporte.</p>
            </div>
        </div>
    );
}
