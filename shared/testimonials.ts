export interface Testimonial {
  id: string;
  name: string;
  age: number;
  result: string;
  resultEmoji: string;
  text: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marina",
    age: 24,
    result: "Paixão Recíproca",
    resultEmoji: "💛",
    text: "Fiz o teste achando que era só diversão, mas os resultados foram tão precisos! Descobri que ele realmente gosta de mim. Agora estamos namorando há 3 meses!",
    rating: 5,
    avatar: "/img/dep-1.JPG",
  },
  {
    id: "2",
    name: "Ana",
    age: 22,
    result: "Sinais Positivos",
    resultEmoji: "💜",
    text: "O teste me ajudou a entender melhor os sinais que ele estava dando. Com as dicas do Conselheiro Amoroso, consegui dar o próximo passo. Muito bom mesmo!",
    rating: 5,
    avatar: "/img/dep2.JPG",
  },
  {
    id: "3",
    name: "Juliana",
    age: 26,
    result: "Paixão Recíproca",
    resultEmoji: "💛",
    text: "Estava em dúvida há meses. Depois do quiz e das análises, ficou claro que ele sente o mesmo. Recomendo para todas as amigas!",
    rating: 5,
    avatar: "/img/dep3.JPG",
  },
  {
    id: "4",
    name: "Sofia",
    age: 23,
    result: "Incerteza",
    resultEmoji: "💙",
    text: "O teste foi honesto comigo. Mostrou que havia dúvidas, mas as dicas do Conselheiro me ajudaram a lidar melhor com a situação. Muito valioso!",
    rating: 5,
    avatar: "/img/dep4.JPG",
  },
  {
    id: "5",
    name: "Beatriz",
    age: 25,
    result: "Sinais Positivos",
    resultEmoji: "💜",
    text: "Adorei a experiência! O quiz é bem pensado e o resultado veio com um plano de ação real. Já estou usando as estratégias!",
    rating: 5,
    avatar: "/img/dep5.JPG",
  },
  {
    id: "6",
    name: "Camila",
    age: 21,
    result: "Paixão Recíproca",
    resultEmoji: "💛",
    text: "Meu crush confirmou que sente o mesmo! O teste foi o empurrão que eu precisava para tomar coragem. Muito obrigada!",
    rating: 5,
    avatar: "👩‍🦰",
  },
];
