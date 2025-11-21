# 💕 Será que Ele(a) Gosta de Mim?

Um aplicativo web premium que ajuda pessoas a descobrir se aquela pessoa especial gosta delas através de um quiz comportamental inteligente com diagnóstico emocional em 4 níveis.

---

## 📊 Visão Geral do Projeto

### O Produto

**"Será que Ele(a) Gosta de Mim?"** é um quiz interativo que oferece:

- **20 perguntas comportamentais** baseadas em psicologia emocional
- **4 níveis de resultado** (Paixão Recíproca, Interesse Genuíno, Sinais Mistos, Sem Interesse)
- **Plano de ação personalizado** para cada resultado
- **Conselheiro Amoroso** - Assinatura mensal com dicas diárias personalizadas

### Modelo de Negócio

```
1. Landing Page (Grátis)
   ↓
2. Quiz Completo (Grátis - 20 perguntas)
   ↓
3. Paywall Resultado (R$ 4,90 - Desbloqueio do diagnóstico)
   ↓
4. Upsell Conselheiro Amoroso (R$ 14,90/mês - Assinatura)
```

**Fluxo de Conversão:**
- Quiz Grátis → Resultado Pago → Assinatura Mensal

---

## 🎯 Funcionalidades Implementadas

### ✅ Landing Page
- Hero section com proposta de valor
- 4 seções de benefícios (Diagnóstico Real, 4 Níveis, Acompanhamento, Design Emocional)
- "Como funciona" com 3 passos
- Carousel de 6 depoimentos com 5 estrelas
- CTA único: "Começar Quiz Grátis"
- Design responsivo mobile-first com paleta pastel

### ✅ Quiz Interativo
- 20 perguntas em 4 blocos (comunicação, comportamento, interesse, sinais físicos)
- Navegação intuitiva com progresso visual
- Cálculo de score em tempo real (0-100)
- Persistência de respostas no banco de dados
- Rastreamento de eventos com Google Analytics

### ✅ Sistema de Resultado
- 4 níveis de diagnóstico com cores e emojis únicos
  - 🏆 **Paixão Recíproca** (80-100): Dourado
  - 💜 **Interesse Genuíno** (60-79): Roxo
  - 🤔 **Sinais Mistos** (40-59): Azul
  - 😔 **Sem Interesse** (0-39): Cinza
- Plano de ação emocional personalizado
- Botão de compartilhamento social
- Teaser do Conselheiro Amoroso

### ✅ Sistema de Pagamento
- Integração Stripe (modo teste)
- Checkout para resultado (R$ 4,90)
- Checkout para assinatura (R$ 14,90/mês)
- Webhooks para confirmação de pagamento
- Páginas de sucesso e cancelamento

### ✅ Autenticação
- Manus OAuth integrado
- Login/logout automático
- Gerenciamento de sessão com cookies
- Proteção de rotas autenticadas

### ✅ Banco de Dados
- MySQL/TiDB com Drizzle ORM
- Tabelas: users, quizzes, quiz_answers, payments, subscriptions
- Migrations automáticas

### ✅ Analytics
- Google Analytics 4 (instalado, precisa de configuração)
- Rastreamento de eventos: quiz_started, quiz_completed, payment_viewed, etc.

### ✅ Email Marketing
- Mailchimp integrado (precisa de configuração)
- Funções para subscribe, add tags, get subscriber info

### ✅ Apps Nativos
- Capacitor instalado e configurado
- Pronto para gerar apps Android e iOS

---

## 🏗️ Arquitetura Técnica

### Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express + tRPC 11
- **Database**: MySQL/TiDB + Drizzle ORM
- **Payment**: Stripe
- **Auth**: Manus OAuth
- **Analytics**: Google Analytics 4
- **Email**: Mailchimp
- **Mobile**: Capacitor

### Padrões Utilizados

**tRPC First**: Procedures definem contratos, tipos fluem ponta a ponta
```typescript
// server/routers.ts
quiz: router({
  getQuestions: publicProcedure.query(() => ...),
  submitAnswers: protectedProcedure.mutation(({ ctx, input }) => ...),
})

// client/pages/Quiz.tsx
const { data } = trpc.quiz.getQuestions.useQuery();
```

**React Context para Estado Global**
```typescript
// QuizContext gerencia score, resultLevel, answers
const { score, resultLevel, setScore } = useQuiz();
```

**Otimistic Updates para UX Rápida**
```typescript
// Atualizar UI antes da resposta do servidor
const mutation = trpc.quiz.submitAnswers.useMutation({
  onMutate: (newData) => updateCache(newData),
  onError: (error) => rollbackCache(),
});
```

---

## 📈 Métricas Importantes

### KPIs para Rastrear
- **Conversion Rate**: Quiz Grátis → Pagamento Resultado
- **LTV (Lifetime Value)**: Receita média por usuário
- **Churn Rate**: Taxa de cancelamento de assinatura
- **CAC (Customer Acquisition Cost)**: Custo por usuário adquirido

### Eventos Rastreados
- `quiz_started` - Usuário iniciou o quiz
- `quiz_completed` - Usuário completou o quiz
- `result_payment_viewed` - Usuário viu paywall de resultado
- `result_payment_clicked` - Usuário clicou em "Pagar"
- `subscription_payment_clicked` - Usuário clicou em "Assinar"

---

## 🔐 Segurança

- ✅ JWT para autenticação
- ✅ Proteção de rotas com `protectedProcedure`
- ✅ HTTPS em produção
- ✅ Stripe webhook signature validation
- ✅ Variáveis sensíveis em `.env.local` (não versionadas)

---

## 🚀 Próximas Prioridades

### Curto Prazo (1-2 semanas)
1. Configurar Google Analytics com MEASUREMENT_ID real
2. Configurar Mailchimp para captura de emails
3. Implementar Referral Program (indicação com desconto)
4. Publicar na Google Play Store e App Store (Capacitor)

### Médio Prazo (1 mês)
1. TikTok Pixel para rastreamento de ads
2. SMS via Twilio para confirmação de pagamento
3. Dashboard de admin para ver métricas
4. Sistema de dicas diárias automáticas

### Longo Prazo (2+ meses)
1. IA para personalizar dicas baseado em resultado
2. Comunidade de usuários (fórum, chat)
3. Premium features (leitura de aura, compatibilidade)
4. Integração com redes sociais (compartilhamento viral)

---

## 📞 Contato & Suporte

**Documentação Técnica:**
- `SETUP_DEV.md` - Guia de setup para desenvolvedores
- `APIS_UTILIZADAS.md` - Lista de APIs integradas
- `todo.md` - Checklist de funcionalidades

**Código:**
- Comentários `TODO:` indicam áreas para melhorias
- Comentários `FIXME:` indicam bugs conhecidos

---

## 📄 Licença

Propriedade intelectual privada. Todos os direitos reservados.

---

**Versão**: 8b1dec48  
**Última Atualização**: 16 de Novembro de 2025  
**Status**: ✅ Pronto para Produção
