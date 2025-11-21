import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, LogOut, Heart, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdvisorDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [emotionalState, setEmotionalState] = useState<"melhorando" | "estavel" | "piorando">("estavel");

  // Fetch subscription data
  const { data: subscription, isLoading: subLoading } = trpc.advisor.getSubscription.useQuery();
  const { data: status } = trpc.advisor.getSubscriptionStatus.useQuery();
  const { data: todaysTip } = trpc.advisor.getTodaysTip.useQuery();
  const { data: allTips } = trpc.advisor.getAllTips.useQuery();
  const { data: progress } = trpc.advisor.getProgress.useQuery();

  // Mutations
  const addProgressMutation = trpc.advisor.addProgress.useMutation({
    onSuccess: () => {
      toast.success("Progresso registrado! 💜");
      setProgressText("");
      setShowAddProgress(false);
      // Refetch progress
      trpc.useUtils().advisor.getProgress.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao registrar progresso");
      console.error(error);
    },
  });

  const cancelMutation = trpc.advisor.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Assinatura cancelada");
      setLocation("/");
    },
    onError: () => {
      toast.error("Erro ao cancelar assinatura");
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Você precisa estar autenticado</p>
      </div>
    );
  }

  if (subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Você não tem uma assinatura ativa</p>
        <Button onClick={() => setLocation("/")} variant="default">
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
            <h1 className="text-3xl font-bold mb-2">💜 Conselheiro Amoroso</h1>
            <p className="text-pink-100">Sua jornada de 30 dias para conquistar o amor</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Status Card */}
        {status && (
          <Card className="p-6 bg-white border-2 border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{status.dayNumber}</div>
                <div className="text-sm text-gray-600">Dia do Programa</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600">{status.daysRemaining}</div>
                <div className="text-sm text-gray-600">Dias Restantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 capitalize">{status.resultLevel.replace(/_/g, " ")}</div>
                <div className="text-sm text-gray-600">Seu Resultado</div>
              </div>
            </div>
          </Card>
        )}

        {/* Today's Tip */}
        {todaysTip && (
          <Card className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-300">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">{todaysTip.title}</h2>
                <p className="text-gray-700 mb-4">{todaysTip.content}</p>

                <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-pink-500">
                  <div className="font-semibold text-purple-900 mb-2">✨ Ação do Dia:</div>
                  <p className="text-gray-700">{todaysTip.actionOfDay}</p>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                  <div className="font-semibold text-purple-900 mb-2">💭 Reflexão:</div>
                  <p className="text-gray-700">{todaysTip.reflection}</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="font-semibold text-purple-900 mb-2">🌟 Motivação:</div>
                  <p className="text-gray-700">{todaysTip.motivation}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Add Progress */}
        <Card className="p-6 bg-white border-2 border-blue-200">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Registre Seu Progresso
          </h3>

          {!showAddProgress ? (
            <Button
              onClick={() => setShowAddProgress(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              + Adicionar Entrada de Hoje
            </Button>
          ) : (
            <div className="space-y-4">
              <textarea
                placeholder="Como você se sente? O que aconteceu? Que ações você tomou?"
                value={progressText}
                onChange={(e) => setProgressText(e.target.value)}
                className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                rows={4}
              />

              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Como você está se sentindo?
                </label>
                <select
                  value={emotionalState}
                  onChange={(e) => setEmotionalState(e.target.value as any)}
                  className="w-full p-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="melhorando">Melhorando 📈</option>
                  <option value="estavel">Estável ➡️</option>
                  <option value="piorando">Piorando 📉</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!progressText.trim()) {
                      toast.error("Por favor, escreva algo");
                      return;
                    }
                    addProgressMutation.mutate({
                      situationUpdate: progressText,
                      emotionalState,
                    });
                  }}
                  disabled={addProgressMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {addProgressMutation.isPending ? <Loader2 className="animate-spin" /> : "Salvar"}
                </Button>
                <Button
                  onClick={() => setShowAddProgress(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Progress History */}
        {progress && progress.length > 0 && (
          <Card className="p-6 bg-white border-2 border-green-200">
            <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Histórico de Progresso ({progress.length} entradas)
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {progress.map((entry, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-purple-900">Dia {entry.dayNumber}</span>
                    <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {entry.emotionalState === "melhorando"
                        ? "📈 Melhorando"
                        : entry.emotionalState === "estavel"
                          ? "➡️ Estável"
                          : "📉 Piorando"}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{entry.situationUpdate}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Subscription Management */}
        <Card className="p-6 bg-white border-2 border-red-200">
          <h3 className="text-xl font-bold text-purple-900 mb-4">Gerenciar Assinatura</h3>

          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Status:</strong> <span className="text-green-600 font-semibold">Ativa</span>
            </p>
            <p className="text-gray-700">
              <strong>Preço:</strong> R$ {subscription.pricePerMonth?.toFixed(2)}/mês
            </p>
            <p className="text-gray-700">
              <strong>Próxima Renovação:</strong> {subscription.currentPeriodEnd?.toLocaleDateString("pt-BR")}
            </p>

            <Button
              onClick={() => {
                if (confirm("Tem certeza que deseja cancelar sua assinatura?")) {
                  cancelMutation.mutate();
                }
              }}
              disabled={cancelMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              {cancelMutation.isPending ? <Loader2 className="animate-spin" /> : "Cancelar Assinatura"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
