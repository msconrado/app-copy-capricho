import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuiz } from "@/contexts/QuizContext";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { RESULT_LEVELS } from "@shared/quiz-data";
import { paymentEvents } from "@/lib/analytics";
import { Heart, Lock } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function PaymentResult() {
  const [, navigate] = useLocation();
  const { score, resultLevel } = useQuiz();
  const { createCheckoutSession } = useStripeCheckout();

  useEffect(() => {
    if (score === null || resultLevel === null) {
      navigate("/quiz");
    } else {
      paymentEvents.resultPaymentViewed();
    }
  }, [score, resultLevel, navigate]);

  if (score === null || resultLevel === null) {
    return null;
  }

  const result = RESULT_LEVELS[resultLevel as keyof typeof RESULT_LEVELS];

  const handlePayment = async () => {
    paymentEvents.resultPaymentClicked();
    await createCheckoutSession("result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Seu Resultado</h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-600"
          >
            ✕
          </Button>
        </div>

        {/* Teaser Card */}
        <Card
          className="p-8 mb-8 border-2 text-center relative overflow-hidden"
          style={{ borderColor: result.color }}
        >
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-6xl mb-4">{result.emoji}</div>

            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {result.title}
            </h2>

            <p className="text-lg text-gray-700 mb-6">{result.description}</p>

            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg mb-6">
              <div className="text-sm text-gray-600 mb-2">Seu Score</div>
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                {score}/100
              </div>
            </div>

            {/* Locked content indicator */}
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
              <Lock className="w-5 h-5" />
              <span>Conteúdo bloqueado - Desbloqueie por R$ 4,90</span>
            </div>
          </div>
        </Card>

        {/* Payment CTA */}
        <Card className="p-8 mb-8 border-2 border-pink-200 bg-white">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Desbloqueie Seu Resultado Completo
              </h3>
              <p className="text-gray-600">
                Acesse o diagnóstico detalhado, plano de ação personalizado e comece sua jornada emocional.
              </p>
            </div>

            <div className="bg-pink-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Valor único</p>
              <p className="text-4xl font-bold text-pink-600">R$ 4,90</p>
              <p className="text-xs text-gray-500 mt-2">Pagamento seguro com Stripe</p>
            </div>

            <div className="space-y-2 text-left">
              <p className="text-sm font-bold text-gray-900">Você receberá:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span> Resultado completo do quiz
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span> Plano de ação personalizado
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span> Análise comportamental detalhada
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span> Acesso por 30 dias
                </li>
              </ul>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Desbloqueie por R$ 4,90
            </Button>

            <Button
              onClick={() => navigate("/quiz")}
              variant="outline"
              className="w-full"
            >
              Voltar ao Quiz
            </Button>
          </div>
        </Card>

        {/* Trust indicators */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>🔒 Pagamento 100% seguro e criptografado</p>
          <p>💳 Processado por Stripe - Líder em segurança de pagamentos</p>
          <p>✓ Acesso instantâneo após confirmação</p>
        </div>
      </div>
    </div>
  );
}
