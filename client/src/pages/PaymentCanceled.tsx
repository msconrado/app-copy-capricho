import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function PaymentCanceled() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-12 text-center border-2 border-orange-200">
          <div className="mb-6">
            <AlertCircle className="w-20 h-20 text-orange-500 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Cancelado
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Você cancelou o processo de pagamento. Sem problemas! Seu quiz está salvo e você pode tentar novamente a qualquer momento.
          </p>

          <div className="bg-orange-50 p-6 rounded-lg mb-8">
            <p className="text-gray-700">
              Se você tiver dúvidas sobre o pagamento ou precisar de ajuda, entre em contato conosco.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/result")}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6"
            >
              Tentar Novamente
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
            Lembre-se: você respondeu as 5 primeiras perguntas grátis. Seu progresso foi salvo!
          </p>
        </Card>
      </div>
    </div>
  );
}
