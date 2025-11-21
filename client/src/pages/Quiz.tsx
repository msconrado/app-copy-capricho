import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/contexts/QuizContext";
import { trpc } from "@/lib/trpc";
import { calculateScore, calculateResultLevel } from "@shared/quiz-data";
import { quizEvents } from "@/lib/analytics";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Quiz() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const {
    answers,
    setAnswers,
    currentQuestion,
    setCurrentQuestion,
    setScore,
    setResultLevel,
  } = useQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: questions, isLoading } = trpc.quiz.getQuestions.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      quizEvents.start();
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="animate-spin">
          <Heart className="w-12 h-12 text-pink-400" />
        </div>
      </div>
    );
  }

  if (!questions) return null;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const score = calculateScore(answers);
      const resultLevel = calculateResultLevel(score);

      setScore(score);
      setResultLevel(resultLevel);

      // Track completion
      quizEvents.completed(score, resultLevel);

      // Ir para página de pagamento do resultado
      navigate("/payment-result");
    } catch (error) {
      console.error("Erro ao enviar quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Será que ele(a) gosta de mim?
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-600"
          >
            ✕
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {question.question}
          </h2>

          {/* Rating Scale */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>Discordo totalmente</span>
              <span>Concordo totalmente</span>
            </div>

            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                    answers[currentQuestion] === value
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            ← Anterior
          </Button>

          {currentQuestion === questions.length - 1 &&
          answers[currentQuestion] !== undefined ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isSubmitting ? "Processando..." : "Ver Meu Resultado ✨"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Próxima →
            </Button>
          )}
        </div>

        {/* Question Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">
            Perguntas respondidas
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  if (index <= currentQuestion) {
                    setCurrentQuestion(index);
                  }
                }}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  answers[index] !== undefined
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : index < currentQuestion
                      ? "bg-gray-300 text-gray-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
