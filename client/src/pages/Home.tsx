import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_LOGO, APP_TITLE, getLoginUrl } from '@/const';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { engagementEvents } from '@/lib/analytics';
import { testimonials } from '@shared/testimonials';
import { Heart, Sparkles, Users, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

export default function Home() {
    const { user, loading, isAuthenticated } = useAuth();
    const [, navigate] = useLocation();
    const { createCheckoutSession } = useStripeCheckout();
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const avatar = testimonials[currentTestimonial].avatar;

    useEffect(() => {
        engagementEvents.visitedHome();
    }, []);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                <div className="animate-spin">
                    <Heart className="w-12 h-12 text-pink-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={APP_LOGO} alt="Logo" className="w-8 h-8" />
                        <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            {APP_TITLE}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        {isAuthenticated ? (
                            <>
                                <Button onClick={() => navigate('/quiz')} variant="outline" className="border-purple-300 hover:bg-purple-50">
                                    Fazer Quiz
                                </Button>
                                <Button
                                    onClick={() => navigate('/profile')}
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                                >
                                    Meu Perfil
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                            >
                                Entrar
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                                    Será que ele(a) gosta de mim?
                                </h1>
                                <p className="text-lg text-gray-600">Descubra a verdade através de um diagnóstico emocional profundo e autêntico.</p>
                            </div>

                            <p className="text-gray-700 leading-relaxed">
                                Criamos um quiz comportamental com 20 perguntas cuidadosamente desenvolvidas para ajudar você a entender os sinais
                                reais de interesse. Não é apenas diversão — é reflexão emocional genuína.
                            </p>

                            <div className="flex gap-4 pt-4">
                                {isAuthenticated ? (
                                    <Button
                                        onClick={() => navigate('/quiz')}
                                        size="lg"
                                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Começar Quiz Grátis
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => (window.location.href = getLoginUrl())}
                                        size="lg"
                                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Começar Agora
                                    </Button>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 pt-2">
                                ✨ Primeiras 5 perguntas grátis • Resultado completo por R$ 4,90 • Sem compromisso
                            </p>
                        </div>

                        <div className="relative">
                            <img src="/img/casal.jpg" alt="Casal feliz" className="w-100 rounded-2xl shadow-2xl" />
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Diferenciais */}
            <section className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Por que somos diferentes?</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6 border-pink-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-pink-500" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Diagnóstico Real</h3>
                            <p className="text-gray-600 text-sm">
                                20 perguntas comportamentais baseadas em psicologia emocional, não apenas diversão.
                            </p>
                        </Card>

                        <Card className="p-6 border-purple-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">4 Níveis de Resultado</h3>
                            <p className="text-gray-600 text-sm">Desde "Não parece gostar" até "Paixão Recíproca" com plano de ação personalizado.</p>
                        </Card>

                        <Card className="p-6 border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Acompanhamento Diário</h3>
                            <p className="text-gray-600 text-sm">Dicas e conselhos personalizados entregues diariamente na sua assinatura.</p>
                        </Card>

                        <Card className="p-6 border-pink-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-pink-500" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Design Emocional</h3>
                            <p className="text-gray-600 text-sm">Interface bonita e intuitiva pensada especialmente para jovens brasileiros.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Como Funciona */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Como funciona?</h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="font-bold text-lg mb-2">Responda 20 Perguntas</h3>
                            <p className="text-gray-600 text-sm">Perguntas sobre comunicação, comportamento, interesse e sinais físicos.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="font-bold text-lg mb-2">Receba Seu Resultado</h3>
                            <p className="text-gray-600 text-sm">Diagnóstico completo com análise profunda e plano de ação emocional.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="font-bold text-lg mb-2">Acompanhamento Diário</h3>
                            <p className="text-gray-600 text-sm">Dicas e reflexões personalizadas para ajudar sua jornada emocional.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">O que as pessoas estão dizendo</h2>

                    <div className="max-w-2xl mx-auto">
                        <Card className="p-8 border-2 border-pink-200 relative">
                            <div className="flex items-start gap-4 mb-6">
                                {avatar.startsWith('http') || avatar.includes('/') ? (
                                    <img src={avatar} className="w-14 h-14 rounded-full object-cover" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-3xl">{avatar}</div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900">{testimonials[currentTestimonial].name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {testimonials[currentTestimonial].age} anos • Resultado: {testimonials[currentTestimonial].result}{' '}
                                        {testimonials[currentTestimonial].resultEmoji}
                                    </p>
                                    <div className="flex gap-1">
                                        {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 italic mb-6">"{testimonials[currentTestimonial].text}"</p>

                            <div className="flex items-center justify-between">
                                <Button onClick={prevTestimonial} variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                <div className="flex gap-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentTestimonial(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentTestimonial ? 'bg-pink-500 w-6' : 'bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <Button onClick={nextTestimonial} variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para descobrir a verdade?</h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        Comece agora e descubra a verdade sobre os sentimentos da pessoa amada.
                    </p>
                    {isAuthenticated ? (
                        <Button onClick={() => navigate('/quiz')} size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                            Começar Quiz Grátis
                        </Button>
                    ) : (
                        <Button
                            onClick={() => (window.location.href = getLoginUrl())}
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-gray-100 px-8"
                        >
                            Começar Agora
                        </Button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2025 {APP_TITLE}. Todos os direitos reservados. | Feito com ❤️ para você</p>
                </div>
            </footer>
        </div>
    );
}
