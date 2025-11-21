# 💜 Conselheiro Amoroso - Sistema de Aconselhamento Pós-Pagamento

## 📋 Visão Geral

Após o usuário pagar R$ 4,90 para ver o resultado, ele é apresentado a uma **página de resultado completa** com diagnóstico detalhado e um **upsell para o "Conselheiro Amoroso"** (R$ 14,90/mês).

Se o usuário assinar, ele recebe:
1. **Resultado Completo Desbloqueado** - Diagnóstico profundo com plano de ação
2. **Dicas Diárias Personalizadas** - Baseadas no seu resultado
3. **Acompanhamento Contínuo** - Evolução da situação amorosa
4. **Suporte Emocional** - Orientação especializada

---

## 🎯 Fluxo Pós-Pagamento

### Fase 1: Resultado Pago (R$ 4,90)

**O que o usuário vê:**
```
┌─────────────────────────────────────────┐
│   SEU RESULTADO: Paixão Recíproca 🏆    │
│   Score: 87/100                         │
├─────────────────────────────────────────┤
│                                         │
│  ✨ Há sinais MUITO positivos!         │
│                                         │
│  Ele(a) demonstra interesse genuíno    │
│  através de ações concretas.           │
│                                         │
│  📊 Análise Detalhada:                 │
│  • Comunicação: 95/100                 │
│  • Comportamento: 85/100               │
│  • Interesse: 90/100                   │
│  • Sinais Físicos: 75/100              │
│                                         │
│  🎯 Plano de Ação:                     │
│  1. Consolidar a conexão emocional     │
│  2. Criar momentos de intimidade       │
│  3. Expressar seus sentimentos         │
│  4. Planejar futuro juntos             │
│                                         │
├─────────────────────────────────────────┤
│  [Compartilhar]  [Conselheiro Amoroso] │
└─────────────────────────────────────────┘
```

---

### Fase 2: Upsell Conselheiro Amoroso (R$ 14,90/mês)

**Mensagem Personalizada por Resultado:**

| Resultado | Mensagem |
|-----------|----------|
| 🏆 Paixão Recíproca | "Parabéns! Há sinais positivos. Agora aprenda como **consolidar essa conexão** com nosso Conselheiro Amoroso." |
| 💜 Interesse Genuíno | "Ótimo! Há sinais promissores. Descubra como **aprofundar essa conexão** com orientação especializada." |
| 🤔 Sinais Mistos | "Há dúvidas, mas há esperança! Receba **dicas diárias** para navegar essa situação com confiança." |
| 😔 Sem Interesse | "Entendemos que é difícil. Receba **suporte emocional** e aprenda a lidar com essa situação." |

**CTA Personalizado:**
- Paixão Recíproca → "Consolidar Agora"
- Interesse Genuíno → "Aprofundar Conexão"
- Sinais Mistos → "Receber Orientação"
- Sem Interesse → "Receber Suporte"

---

## 📱 Página de Resultado Completo

### Estrutura da Página (Após Pagamento)

```
1. HEADER
   └─ Resultado do Quiz
   └─ Score Visual (0-100)
   └─ Emoji & Cor Temática

2. DIAGNÓSTICO PRINCIPAL
   └─ Descrição do resultado
   └─ Análise por categoria
   └─ Gráfico de scores

3. PLANO DE AÇÃO
   └─ 4-5 passos específicos
   └─ Dicas acionáveis
   └─ Timeline sugerida

4. DEPOIMENTOS
   └─ Histórias de sucesso
   └─ Transformações reais

5. UPSELL CONSELHEIRO
   └─ Benefícios da assinatura
   └─ Preço (R$ 14,90/mês)
   └─ Botão CTA personalizado

6. FOOTER
   └─ Compartilhar resultado
   └─ Voltar para home
```

---

## 🎁 Benefícios do Conselheiro Amoroso

### O que está incluído na assinatura (R$ 14,90/mês)

#### 1. **Dicas Diárias Personalizadas** 📧
Cada dia, o usuário recebe um email com:
- Dica específica para sua situação
- Ação concreta para o dia
- Reflexão emocional
- Motivação

**Exemplo de Email:**
```
Assunto: Sua Dica Diária - Dia 5 do Conselheiro Amoroso

Olá Maria! 💜

Hoje sua dica é sobre COMUNICAÇÃO AUTÊNTICA.

🎯 Ação do Dia:
Envie uma mensagem genuína (não planejada) para ele(a).
Algo que reflita realmente o que você sente.

💭 Reflexão:
A autenticidade é o que mais atrai as pessoas.
Quando você se mostra real, cria espaço para conexão verdadeira.

✨ Motivação:
Você está no caminho certo. Continue assim!

---
Seu Conselheiro Amoroso 💜
```

#### 2. **Plano de Ação Estruturado** 📋
- **Semana 1**: Consolidação emocional
- **Semana 2**: Aprofundamento de conexão
- **Semana 3**: Expressão de sentimentos
- **Semana 4**: Planejamento do futuro

#### 3. **Acompanhamento Contínuo** 📊
- Dashboard com evolução da situação
- Histórico de dicas recebidas
- Progresso do plano de ação
- Reflexões do usuário

#### 4. **Suporte Emocional** 💬
- Chat com especialista (futuro)
- Comunidade de usuários
- Fórum de discussão
- Recursos de autoajuda

#### 5. **Recursos Premium** 🎁
- Guias em PDF
- Vídeos de orientação
- Meditações guiadas
- Templates de mensagens

---

## 🗄️ Banco de Dados - Estrutura

### Tabela: `subscriptions`
```sql
CREATE TABLE subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  status ENUM('active', 'canceled', 'expired') DEFAULT 'active',
  stripeSubscriptionId VARCHAR(255) UNIQUE,
  resultLevel VARCHAR(50),  -- paixao_reciproca, sinais_positivos, etc
  startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  endDate TIMESTAMP,
  canceledAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Tabela: `daily_tips`
```sql
CREATE TABLE daily_tips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subscriptionId INT NOT NULL,
  dayNumber INT,  -- 1-30 (ciclo mensal)
  category VARCHAR(50),  -- comunicacao, comportamento, emocoes, etc
  title VARCHAR(255),
  content TEXT,
  actionOfDay TEXT,
  reflection TEXT,
  motivation TEXT,
  sentAt TIMESTAMP,
  readAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriptionId) REFERENCES subscriptions(id)
);
```

### Tabela: `user_progress`
```sql
CREATE TABLE user_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subscriptionId INT NOT NULL,
  dayNumber INT,
  situationUpdate TEXT,  -- O que mudou na situação
  emotionalState VARCHAR(50),  -- melhorando, estável, piorando
  actionsTaken TEXT,  -- Ações que o usuário tomou
  notes TEXT,  -- Notas do usuário
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriptionId) REFERENCES subscriptions(id)
);
```

---

## 🔧 Implementação Técnica

### Backend - tRPC Procedures

```typescript
// server/routers.ts

subscription: router({
  // Criar assinatura após pagamento
  createSubscription: protectedProcedure
    .input(z.object({
      stripeSubscriptionId: z.string(),
      resultLevel: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const subscription = await db.createSubscription({
        userId: ctx.user.id,
        stripeSubscriptionId: input.stripeSubscriptionId,
        resultLevel: input.resultLevel,
      });
      
      // Gerar dicas para os próximos 30 dias
      await generateDailyTips(subscription.id, input.resultLevel);
      
      return subscription;
    }),

  // Obter dica do dia
  getTodaysTip: protectedProcedure
    .query(async ({ ctx }) => {
      const subscription = await db.getActiveSubscription(ctx.user.id);
      if (!subscription) return null;
      
      const dayNumber = calculateDayNumber(subscription.startDate);
      return db.getDailyTip(subscription.id, dayNumber);
    }),

  // Obter progresso do usuário
  getProgress: protectedProcedure
    .query(async ({ ctx }) => {
      const subscription = await db.getActiveSubscription(ctx.user.id);
      if (!subscription) return null;
      
      return db.getUserProgress(subscription.id);
    }),

  // Atualizar progresso
  updateProgress: protectedProcedure
    .input(z.object({
      situationUpdate: z.string(),
      emotionalState: z.enum(['melhorando', 'estável', 'piorando']),
      actionsTaken: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const subscription = await db.getActiveSubscription(ctx.user.id);
      if (!subscription) throw new Error('No active subscription');
      
      return db.createProgress({
        subscriptionId: subscription.id,
        ...input,
      });
    }),

  // Cancelar assinatura
  cancelSubscription: protectedProcedure
    .mutation(async ({ ctx }) => {
      const subscription = await db.getActiveSubscription(ctx.user.id);
      if (!subscription) throw new Error('No active subscription');
      
      // Cancelar no Stripe
      await stripe.subscriptions.del(subscription.stripeSubscriptionId);
      
      // Atualizar no banco
      return db.updateSubscription(subscription.id, {
        status: 'canceled',
        canceledAt: new Date(),
      });
    }),
}),
```

### Frontend - Dashboard do Conselheiro

```typescript
// client/src/pages/AdvisorDashboard.tsx

export default function AdvisorDashboard() {
  const { data: subscription } = trpc.subscription.getSubscription.useQuery();
  const { data: todaysTip } = trpc.subscription.getTodaysTip.useQuery();
  const { data: progress } = trpc.subscription.getProgress.useQuery();
  
  if (!subscription) {
    return <div>Nenhuma assinatura ativa</div>;
  }

  const dayNumber = calculateDayNumber(subscription.startDate);
  const progressPercentage = (dayNumber / 30) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Seu Conselheiro Amoroso 💜
          </h1>
          <p className="text-gray-600">
            Dia {dayNumber} de 30 - Sua jornada de transformação
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">
            {Math.round(progressPercentage)}% completo
          </p>
        </div>

        {/* Today's Tip */}
        {todaysTip && (
          <Card className="mb-8 p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              ✨ Sua Dica de Hoje
            </h2>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">
              {todaysTip.title}
            </h3>
            <p className="text-gray-700 mb-4">{todaysTip.content}</p>
            
            <div className="bg-pink-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-pink-900 mb-2">🎯 Ação do Dia:</p>
              <p className="text-pink-800">{todaysTip.actionOfDay}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-blue-900 mb-2">💭 Reflexão:</p>
              <p className="text-blue-800">{todaysTip.reflection}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-semibold text-yellow-900 mb-2">✨ Motivação:</p>
              <p className="text-yellow-800">{todaysTip.motivation}</p>
            </div>
          </Card>
        )}

        {/* Progress Updates */}
        <Card className="p-6 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            📊 Seu Progresso
          </h2>
          
          {progress && progress.length > 0 ? (
            <div className="space-y-4">
              {progress.map((p, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-gray-700">{p.situationUpdate}</p>
                  <p className="text-sm mt-2">
                    Estado emocional: <span className="font-semibold">{p.emotionalState}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              Comece a registrar seu progresso para acompanhar sua jornada!
            </p>
          )}

          <Button className="mt-6 w-full">
            Registrar Progresso de Hoje
          </Button>
        </Card>
      </div>
    </div>
  );
}
```

---

## 📧 Sistema de Dicas Automáticas

### Geração de Dicas (Baseado em IA - Futuro)

```typescript
// server/jobs/generateDailyTips.ts

async function generateDailyTips(
  subscriptionId: number,
  resultLevel: string
) {
  const tips = [];
  
  for (let day = 1; day <= 30; day++) {
    const category = getTipCategoryForDay(day);
    
    // Usar LLM para gerar dica personalizada
    const tip = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um conselheiro amoroso especializado. Gere uma dica diária para alguém com resultado "${resultLevel}" no dia ${day} do programa.`,
        },
        {
          role: "user",
          content: `Categoria: ${category}. Gere um JSON com: title, content, actionOfDay, reflection, motivation`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "daily_tip",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              actionOfDay: { type: "string" },
              reflection: { type: "string" },
              motivation: { type: "string" },
            },
            required: ["title", "content", "actionOfDay", "reflection", "motivation"],
          },
        },
      },
    });

    tips.push({
      subscriptionId,
      dayNumber: day,
      category,
      ...JSON.parse(tip.choices[0].message.content),
    });
  }

  // Salvar todas as dicas no banco
  await db.createManyDailyTips(tips);
}
```

### Envio de Emails Automáticos

```typescript
// server/jobs/sendDailyTips.ts

async function sendDailyTips() {
  // Encontrar todas as assinaturas ativas
  const subscriptions = await db.getActiveSubscriptions();

  for (const subscription of subscriptions) {
    const dayNumber = calculateDayNumber(subscription.startDate);
    const tip = await db.getDailyTip(subscription.id, dayNumber);
    
    if (!tip) continue;

    // Enviar email via Mailchimp
    await subscribeToMailchimp(subscription.user.email, {
      firstName: subscription.user.name,
      tags: [subscription.resultLevel, `day_${dayNumber}`],
    });

    // Marcar como enviado
    await db.updateDailyTip(tip.id, { sentAt: new Date() });
  }
}

// Agendar para rodar todo dia às 8:00 AM
schedule.scheduleJob('0 8 * * *', sendDailyTips);
```

---

## 💰 Monetização & Retenção

### Estratégia de Retenção

| Fase | Dias | Ação |
|------|------|------|
| Onboarding | 1-3 | Dicas motivacionais, build hype |
| Engajamento | 4-14 | Dicas acionáveis, histórias de sucesso |
| Consolidação | 15-25 | Reflexões profundas, comunidade |
| Renovação | 26-30 | Ofertas de renovação, desconto |

### Churn Prevention

- **Dia 7**: Email "Você está no caminho certo!"
- **Dia 14**: Oferta de desconto para renovação
- **Dia 21**: Testimonial de sucesso similar
- **Dia 28**: "Últimos dias - Renove agora com 50% off"

### Upsells Futuros

- 🎥 Vídeo coaching (R$ 29,90/mês)
- 👥 Comunidade premium (R$ 9,90/mês)
- 📚 Guias avançados (R$ 19,90)
- 🎁 Pacote anual (R$ 149,90/ano - 15% off)

---

## 📊 Métricas para Acompanhar

```
Assinatura
├── Conversion Rate (Pagamento → Assinatura)
├── Average Subscription Duration
├── Churn Rate (Taxa de cancelamento)
└── LTV (Lifetime Value)

Engajamento
├── Daily Tip Open Rate
├── Progress Update Frequency
├── Dashboard Visits
└── Time Spent

Satisfação
├── NPS (Net Promoter Score)
├── Review Rating
├── Renewal Rate
└── Referral Rate
```

---

## 🎯 Próximos Passos para Implementação

### MVP (Semana 1-2)
- [ ] Tabelas do banco de dados
- [ ] tRPC procedures básicos
- [ ] Dashboard simples
- [ ] Envio de dicas por email

### V2 (Semana 3-4)
- [ ] IA para gerar dicas personalizadas
- [ ] Sistema de progresso do usuário
- [ ] Comunidade de usuários
- [ ] Histórias de sucesso

### V3 (Mês 2)
- [ ] Chat com especialista
- [ ] Vídeos de orientação
- [ ] Meditações guiadas
- [ ] Análise de compatibilidade

---

**Versão**: 1.0  
**Status**: 📋 Documentação Completa - Pronto para Implementação
