import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, LogOut, User, History, Heart, Settings } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
    const { user, logout, loading } = useAuth();
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'subscription'>('profile');

    // Fetch user data
    const { data: subscription } = trpc.advisor.getSubscription.useQuery();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-lg">Você precisa estar autenticado</p>
                <Button onClick={() => setLocation('/')} variant="default">
                    Voltar para Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white p-6">
                <div className="max-w-4xl mx-auto flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">👤 Meu Perfil</h1>
                        <p className="text-pink-100">Gerencie sua conta e histórico</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={async () => {
                            await logout();
                            setLocation('/');
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b-2 border-purple-200">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeTab === 'profile' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                        }`}
                    >
                        <User className="w-4 h-4 inline mr-2" />
                        Perfil
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeTab === 'history' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                        }`}
                    >
                        <History className="w-4 h-4 inline mr-2" />
                        Histórico
                    </button>
                    <button
                        onClick={() => setActiveTab('subscription')}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeTab === 'subscription' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                        }`}
                    >
                        <Heart className="w-4 h-4 inline mr-2" />
                        Assinatura
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <Card className="p-6 bg-white border-2 border-purple-200">
                            <h2 className="text-2xl font-bold text-purple-900 mb-6">Informações Pessoais</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
                                    <p className="text-lg text-gray-900">{user.name || 'Não informado'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                    <p className="text-lg text-gray-900">{user.email || 'Não informado'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ID Manus</label>
                                    <p className="text-sm text-gray-600 font-mono">{user.openId}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Membro desde</label>
                                    <p className="text-lg text-gray-900">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Último acesso</label>
                                    <p className="text-lg text-gray-900">{new Date(user.lastSignedIn).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>

                            <Button variant="outline" className="mt-6 w-full" onClick={() => toast.info('Edição de perfil em breve!')}>
                                <Settings className="w-4 h-4 mr-2" />
                                Editar Perfil
                            </Button>
                        </Card>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <Card className="p-6 bg-white border-2 border-blue-200">
                            <h2 className="text-2xl font-bold text-purple-900 mb-6">Histórico de Quizzes</h2>

                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">Histórico de quizzes em breve!</p>
                                <p className="text-sm text-gray-500">Aqui você verá todos os quizzes que já realizou com seus resultados</p>
                            </div>

                            <Button
                                onClick={() => setLocation('/quiz')}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 mt-4"
                            >
                                Fazer um Novo Quiz
                            </Button>
                        </Card>
                    </div>
                )}

                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                    <div className="space-y-6">
                        {subscription ? (
                            <>
                                <Card className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300">
                                    <h2 className="text-2xl font-bold text-green-900 mb-6">✅ Assinatura Ativa</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-green-900 mb-1">Plano</label>
                                            <p className="text-lg text-green-900 font-semibold">
                                                Conselheiro Amoroso - R$ {(subscription.pricePerMonth / 100).toFixed(2)}/mês
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-green-900 mb-1">Resultado</label>
                                            <p className="text-lg text-green-900 capitalize">{subscription.resultLevel.replace(/_/g, ' ')}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-green-900 mb-1">Próxima Renovação</label>
                                            <p className="text-lg text-green-900">{subscription.currentPeriodEnd?.toLocaleDateString('pt-BR')}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-green-900 mb-1">Ativada em</label>
                                            <p className="text-lg text-green-900">{subscription.currentPeriodStart?.toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-6">
                                        <Button
                                            onClick={() => setLocation('/advisor')}
                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        >
                                            Ir para Dashboard
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-white border-2 border-red-200">
                                    <h2 className="text-xl font-bold text-purple-900 mb-4">Gerenciar Assinatura</h2>
                                    <p className="text-gray-700 mb-4">
                                        Você pode cancelar sua assinatura a qualquer momento. Não há multa ou taxa de cancelamento.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => {
                                            if (confirm('Tem certeza que deseja cancelar sua assinatura?')) {
                                                toast.info('Cancelamento em breve!');
                                            }
                                        }}
                                    >
                                        Cancelar Assinatura
                                    </Button>
                                </Card>
                            </>
                        ) : (
                            <Card className="p-6 bg-white border-2 border-purple-200">
                                <h2 className="text-2xl font-bold text-purple-900 mb-6">Sem Assinatura Ativa</h2>

                                <p className="text-gray-700 mb-6">
                                    Você não possui uma assinatura ativa do Conselheiro Amoroso. Faça um quiz e desbloqueie acesso ao acompanhamento
                                    diário personalizado!
                                </p>

                                <Button
                                    onClick={() => setLocation('/quiz')}
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                                >
                                    Começar Quiz Grátis
                                </Button>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
