/**
 * Quiz Data - 20 Perguntas Comportamentais
 * Divididas em 4 blocos: Comunicação, Comportamento, Interesse, Sinais Físicos
 */

export const QUIZ_QUESTIONS = [
  // Bloco 1: Comunicação (5 perguntas)
  {
    id: 1,
    question: "Ele(a) responde suas mensagens rapidamente?",
    category: "communication",
  },
  {
    id: 2,
    question: "Ele(a) inicia conversas com você?",
    category: "communication",
  },
  {
    id: 3,
    question: "Ele(a) faz perguntas sobre sua vida?",
    category: "communication",
  },
  {
    id: 4,
    question: "Ele(a) compartilha detalhes pessoais com você?",
    category: "communication",
  },
  {
    id: 5,
    question: "Ele(a) usa emojis ou tom carinhoso ao conversar?",
    category: "communication",
  },

  // Bloco 2: Comportamento (5 perguntas)
  {
    id: 6,
    question: "Ele(a) faz planos para se ver com você?",
    category: "behavior",
  },
  {
    id: 7,
    question: "Ele(a) se lembra de coisas que você mencionou?",
    category: "behavior",
  },
  {
    id: 8,
    question: "Ele(a) tenta passar tempo de qualidade com você?",
    category: "behavior",
  },
  {
    id: 9,
    question: "Ele(a) apresentou você para amigos/família?",
    category: "behavior",
  },
  {
    id: 10,
    question: "Ele(a) faz pequenos gestos atenciosos?",
    category: "behavior",
  },

  // Bloco 3: Interesse (5 perguntas)
  {
    id: 11,
    question: "Ele(a) parece estar interessado(a) em seus hobbies?",
    category: "interest",
  },
  {
    id: 12,
    question: "Ele(a) quer conhecer seus sonhos e objetivos?",
    category: "interest",
  },
  {
    id: 13,
    question: "Ele(a) faz elogios genuínos sobre você?",
    category: "interest",
  },
  {
    id: 14,
    question: "Ele(a) investe tempo em conversar com você?",
    category: "interest",
  },
  {
    id: 15,
    question: "Ele(a) quer saber sobre seus sentimentos?",
    category: "interest",
  },

  // Bloco 4: Sinais Físicos (5 perguntas)
  {
    id: 16,
    question: "Ele(a) mantém contato visual quando fala com você?",
    category: "physical",
  },
  {
    id: 17,
    question: "Ele(a) busca proximidade física (perto, toques)?",
    category: "physical",
  },
  {
    id: 18,
    question: "Ele(a) sorri ou ri com frequência ao seu lado?",
    category: "physical",
  },
  {
    id: 19,
    question: "Ele(a) se inclina em sua direção quando conversa?",
    category: "physical",
  },
  {
    id: 20,
    question: "Ele(a) toca seu braço ou ombro de forma natural?",
    category: "physical",
  },
];

export const RESULT_LEVELS = {
  nao_gosta: {
    title: "Não Parece Gostar",
    description: "Os sinais indicam que ele(a) pode não ter interesse romântico no momento.",
    color: "#A5D8FF", // Azul
    emoji: "💙",
    actionPlan: [
      "Dê espaço e tempo para que os sentimentos evoluam naturalmente",
      "Foque em se conhecer melhor como amigos primeiro",
      "Não force situações - deixe a conexão fluir",
      "Considere se há compatibilidade real entre vocês",
    ],
  },
  talvez: {
    title: "Sinais Mistos",
    description: "Há momentos de conexão, mas ainda é incerto. Pode estar em processo de decisão.",
    color: "#C8A2FF", // Roxo
    emoji: "💜",
    actionPlan: [
      "Observe padrões consistentes de comportamento",
      "Crie oportunidades naturais para se aproximar",
      "Seja autêntico(a) e deixe seus sentimentos claros",
      "Não tenha medo de uma conversa honesta",
    ],
  },
  provavelmente: {
    title: "Provavelmente Gosta",
    description: "Há muitos sinais positivos! Ele(a) demonstra interesse genuíno em você.",
    color: "#FF6B9F", // Rosa
    emoji: "💗",
    actionPlan: [
      "Retribua o interesse de forma autêntica",
      "Crie momentos especiais juntos",
      "Comunique seus sentimentos com confiança",
      "Deixe a relação evoluir naturalmente",
    ],
  },
  paixao_reciproca: {
    title: "Paixão Recíproca! 💕",
    description: "Todos os sinais apontam para um interesse profundo e genuíno. Vocês têm química!",
    color: "#FFD700", // Dourado suave
    emoji: "✨",
    actionPlan: [
      "Celebre essa conexão especial!",
      "Seja vulnerável e compartilhe seus sentimentos",
      "Crie memórias incríveis juntos",
      "Deixe o amor florescer naturalmente",
    ],
  },
};

export type ResultLevel = keyof typeof RESULT_LEVELS;

/**
 * Calcula o nível de resultado baseado no score total
 * Score máximo: 100 (20 perguntas × 5 pontos)
 */
export function calculateResultLevel(score: number): ResultLevel {
  if (score >= 80) return "paixao_reciproca";
  if (score >= 60) return "provavelmente";
  if (score >= 40) return "talvez";
  return "nao_gosta";
}

/**
 * Calcula o score total a partir das respostas
 */
export function calculateScore(answers: number[]): number {
  return answers.reduce((sum, answer) => sum + answer, 0);
}
