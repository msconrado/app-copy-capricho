import React, { createContext, useContext, useState } from "react";

export interface QuizContextType {
  answers: number[];
  setAnswers: (answers: number[]) => void;
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  score: number | null;
  setScore: (score: number | null) => void;
  resultLevel: string | null;
  setResultLevel: (level: string | null) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [resultLevel, setResultLevel] = useState<string | null>(null);

  const resetQuiz = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setScore(null);
    setResultLevel(null);
  };

  return (
    <QuizContext.Provider
      value={{
        answers,
        setAnswers,
        currentQuestion,
        setCurrentQuestion,
        score,
        setScore,
        resultLevel,
        setResultLevel,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
