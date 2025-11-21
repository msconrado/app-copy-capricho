import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-12 text-center border-2 border-green-200">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Realizado com Sucesso! 🎉
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Obrigado pela sua compra! Seu acesso foi ativado e você já pode acessar o resultado completo do quiz.
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-8 text-left">
            <h2 className="font-bold text-gray-900 mb-4">O que você recebe:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Resultado completo do quiz
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Plano de ação personalizado
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Acesso por 30 dias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Reflexões emocionais profundas
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/result")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6"
            >
              Ver Meu Resultado ✨
            </Button>

            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Voltar ao Início
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Recebeu um email de confirmação? Verifique sua caixa de entrada ou spam.
          </p>
        </Card>
      </div>
    </div>
  );
}
