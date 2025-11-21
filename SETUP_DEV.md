# 🚀 Guia de Setup para Desenvolvimento

Este guia ajudará seu DEV a configurar o ambiente e continuar com as atualizações do projeto "Será que Ele(a) Gosta de Mim?".

---

## 📋 Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** 9+ (gerenciador de pacotes)
- **Git** (para versionamento)
- **MySQL/TiDB** acesso (fornecido pelo Manus)

---

## 🔧 Instalação Inicial

### 1. Descompactar o Projeto

```bash
tar -xzf sera_que_ele_gosta.tar.gz
cd sera_que_ele_gosta
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/sera_que_ele_gosta

# Manus OAuth
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/oauth

# Stripe (Teste)
STRIPE_SECRET_KEY=sk_test_seu_key_aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_seu_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui

# Google Analytics (Opcional)
VITE_GA_MEASUREMENT_ID=G-seu_id_aqui

# Mailchimp (Opcional)
MAILCHIMP_API_KEY=seu_api_key_aqui
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=seu_list_id_aqui

# JWT
JWT_SECRET=seu_secret_jwt_aqui

# Manus Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=seu_key_aqui
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=seu_key_aqui

# App Info
VITE_APP_TITLE=Será que Ele(a) Gosta de Mim?
VITE_APP_LOGO=/logo.svg
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id
```

### 4. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

O servidor iniciará em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
sera_que_ele_gosta/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas (Home, Quiz, Result, etc)
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── contexts/         # React Contexts (QuizContext)
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilitários (analytics, trpc)
│   │   ├── App.tsx           # Roteamento principal
│   │   └── main.tsx          # Entry point
│   └── public/               # Assets estáticos
├── server/                    # Backend Express + tRPC
│   ├── routers.ts            # Definição de procedures tRPC
│   ├── db.ts                 # Query helpers
│   ├── stripe.ts             # Integração Stripe
│   ├── mailchimp.ts          # Integração Mailchimp
│   └── _core/                # Framework (não editar)
├── drizzle/                   # Schema do banco de dados
│   └── schema.ts             # Definição de tabelas
├── shared/                    # Código compartilhado
│   ├── quiz-data.ts          # Perguntas e lógica do quiz
│   ├── testimonials.ts       # Depoimentos
│   └── stripe-products.ts    # Produtos Stripe
├── APIS_UTILIZADAS.md        # Documentação de APIs
├── todo.md                    # Checklist de funcionalidades
└── package.json              # Dependências
```

---

## 🔄 Workflow de Desenvolvimento

### Adicionar Nova Funcionalidade

1. **Atualizar Schema** (se necessário)
   ```bash
   # Editar drizzle/schema.ts
   pnpm db:push  # Aplicar migração
   ```

2. **Criar Query Helper** (em `server/db.ts`)
   ```typescript
   export async function getFeatureData(userId: number) {
     const db = await getDb();
     return db.select().from(yourTable).where(eq(yourTable.userId, userId));
   }
   ```

3. **Adicionar tRPC Procedure** (em `server/routers.ts`)
   ```typescript
   feature: router({
     getData: protectedProcedure.query(({ ctx }) =>
       db.getFeatureData(ctx.user.id)
     ),
   }),
   ```

4. **Usar no Frontend** (em `client/src/pages/YourPage.tsx`)
   ```typescript
   const { data, isLoading } = trpc.feature.getData.useQuery();
   ```

---

## 🧪 Testes

### Testar Localmente

```bash
# Terminal 1: Servidor de desenvolvimento
pnpm dev

# Terminal 2: Abrir navegador
open http://localhost:3000
```

### Testar Fluxo do Quiz

1. Clique em "Começar Quiz Grátis"
2. Responda todas as 20 perguntas
3. Veja o resultado (paywall de R$ 4,90)
4. Teste pagamento com Stripe (use cartão de teste: `4242 4242 4242 4242`)

### Testar Pagamento Stripe

Use cartões de teste:
- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **Expiração**: Qualquer data futura
- **CVC**: Qualquer número

---

## 📊 Banco de Dados

### Acessar Banco de Dados

```bash
# Conectar via MySQL CLI
mysql -h seu_host -u seu_user -p seu_database
```

### Tabelas Principais

- **users** - Usuários autenticados
- **quizzes** - Histórico de quizzes respondidos
- **quiz_answers** - Respostas individuais do quiz
- **payments** - Histórico de pagamentos
- **subscriptions** - Assinaturas ativas

---

## 🚀 Deploy

### Preparar para Produção

1. **Build do Frontend**
   ```bash
   pnpm run build
   ```

2. **Configurar Variáveis de Produção**
   - Usar Stripe Live Keys (não teste)
   - Configurar Google Analytics com ID real
   - Configurar Mailchimp com credenciais reais

3. **Deploy** (depende da plataforma)
   - Manus: Clique em "Publish" no Management UI
   - Vercel: `vercel deploy`
   - Heroku: `git push heroku main`

---

## 📱 Apps Nativos (Capacitor)

### Gerar App Android

```bash
pnpm run build
pnpm exec cap add android
pnpm exec cap sync
pnpm exec cap open android
```

### Gerar App iOS

```bash
pnpm run build
pnpm exec cap add ios
pnpm exec cap sync
pnpm exec cap open ios
```

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"
- Verificar `DATABASE_URL` em `.env.local`
- Confirmar que MySQL está rodando
- Testar conexão: `mysql -h host -u user -p`

### Erro: "Stripe key not found"
- Adicionar `STRIPE_SECRET_KEY` e `VITE_STRIPE_PUBLISHABLE_KEY` em `.env.local`
- Usar chaves de teste (começam com `sk_test_` e `pk_test_`)

### Erro: "OAuth callback failed"
- Verificar `VITE_APP_ID` e `OAUTH_SERVER_URL`
- Confirmar que app está registrado no Manus

### Erro: "Port 3000 already in use"
```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>
```

---

## 📚 Recursos Úteis

- **tRPC Docs**: https://trpc.io/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Stripe Docs**: https://stripe.com/docs
- **Drizzle ORM**: https://orm.drizzle.team

---

## 💡 Próximas Melhorias Sugeridas

1. **Google Analytics** - Configure `VITE_GA_MEASUREMENT_ID` para rastrear conversões
2. **Mailchimp** - Configure credenciais para automação de email
3. **TikTok Pixel** - Integre para rastreamento de ads
4. **Referral Program** - Sistema de indicação com descontos
5. **SMS Notifications** - Integre Twilio para confirmações

---

## 📞 Suporte

Para dúvidas sobre o código ou arquitetura, consulte:
- `APIS_UTILIZADAS.md` - Lista de APIs integradas
- `todo.md` - Funcionalidades implementadas
- Comentários no código (procure por `TODO:` e `FIXME:`)

---

**Última atualização**: 16 de Novembro de 2025
**Versão**: 8b1dec48
