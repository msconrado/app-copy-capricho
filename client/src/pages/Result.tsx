import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuiz } from "@/contexts/QuizContext";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { RESULT_LEVELS } from "@shared/quiz-data";
import { paymentEvents, engagementEvents } from "@/lib/analytics";
import { Heart, Share2, Sparkles, Zap } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Result() {
  const [, navigate] = useLocation();
  const { score, resultLevel } = useQuiz();
  const { createCheckoutSession } = useStripeCheckout();

  useEffect(() => {
    if (score === null || resultLevel === null) {
      navigate("/quiz");
    }
  }, [score, resultLevel, navigate]);

  if (score === null || resultLevel === null) {
    return null;
  }

  const result = RESULT_LEVELS[resultLevel as keyof typeof RESULT_LEVELS];

  const handleShare = () => {
    engagementEvents.shareResult(resultLevel);
    const text = `Descobri que ${resultLevel === "paixao_reciproca" ? "há paixão recíproca" : "há sinais de que ele(a) gosta de mim"}! 💜 Faça o teste também!`;
    if (navigator.share) {
      navigator.share({
        title: "Será que ele(a) gosta de mim?",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Link copiado para a área de transferência!");
    }
  };

  // Personalize upsell message based on result level
  const getUpsellMessage = () => {
    switch (resultLevel) {
      case "paixao_reciproca":
        return "Parabéns! Há sinais positivos. Agora aprenda como consolidar essa conexão com nosso Conselheiro Amoroso.";
      case "sinais_positivos":
        return "Ótimo! Há sinais promissores. Descubra como aprofundar essa conexão com orientação especializada.";
      case "incerteza":
        return "Há dúvidas, mas há esperança! Receba dicas diárias para navegar essa situação com confiança.";
      case "sinais_negativos":
        return "Entendemos. Receba apoio emocional e estratégias para lidar com essa situação com sabedoria.";
      default:
        return "Receba acompanhamento diário personalizado para sua jornada emocional.";
    }
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

        {/* Result Card */}
        <Card
          className="p-8 mb-8 border-2 text-center"
          style={{ borderColor: result.color }}
        >
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

          <div className="space-y-3 text-left">
            <p className="font-bold text-gray-900 mb-4">Seu Plano de Ação:</p>
            {result.actionPlan.map((action, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-pink-500 font-bold">✓</span>
                <p className="text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Upsell Section - Conselheiro Amoroso */}
        <Card className="p-8 mb-8 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">💜</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Conselheiro Amoroso
              </h3>
              <p className="text-gray-700 mb-4">{getUpsellMessage()}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Dicas diárias personalizadas</strong> baseadas no seu resultado
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Reflexões emocionais profundas</strong> para entender seus sentimentos
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Estratégias práticas</strong> para conquistar ou consolidar a relação
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Acesso ilimitado</strong> ao seu resultado completo
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mb-6 border border-purple-200">
            <p className="text-center text-sm text-gray-600 mb-2">
              Investimento em você mesma(o)
            </p>
            <p className="text-center text-3xl font-bold text-purple-600">
              R$ 14,90<span className="text-sm text-gray-600">/mês</span>
            </p>
            <p className="text-center text-xs text-gray-500 mt-2">
              Cancele a qualquer momento, sem compromisso
            </p>
          </div>

          <Button
            onClick={() => {
              paymentEvents.subscriptionPaymentClicked();
              createCheckoutSession("subscription");
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 mb-3 font-bold text-lg"
          >
            <Heart className="w-5 h-5 mr-2" />
            Começar Agora - R$ 14,90/mês
          </Button>

          <p className="text-center text-xs text-gray-600">
            ✓ Primeiro mês com 7 dias de garantia de satisfação
          </p>
        </Card>

        {/* Share Section */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">Compartilhe seu resultado:</p>
          <Button
            onClick={handleShare}
            variant="outline"
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar Resultado
          </Button>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-gray-600"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
}
