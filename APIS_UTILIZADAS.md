# APIs Utilizadas - "Será que Ele(a) Gosta de Mim?"

## 1. **Manus OAuth** (Autenticação)
- **Tipo**: Autenticação & Autorização
- **Token**: `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`
- **Uso**: Login/logout de usuários, gerenciamento de sessão
- **Documentação**: Integrada no template
- **Status**: ✅ Ativo e funcionando

---

## 2. **Stripe** (Pagamentos)
- **Tipo**: Processamento de Pagamentos
- **Tokens**: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Uso**: Checkout de resultado (R$ 4,90), assinatura mensal (R$ 14,90/mês)
- **Modo**: Teste (sandbox) - sem cobrança real
- **Documentação**: https://stripe.com/docs
- **Status**: ✅ Ativo e funcionando

---

## 3. **Google Analytics 4** (Analytics)
- **Tipo**: Rastreamento & Analytics
- **Token**: `VITE_GA_MEASUREMENT_ID` (não configurado ainda)
- **Uso**: Rastrear eventos do quiz (início, conclusão), pagamentos, engajamento
- **Documentação**: https://analytics.google.com
- **Status**: ⚠️ Instalado mas não configurado (precisa de MEASUREMENT_ID)
- **Próximos passos**: 
  1. Criar projeto em Google Analytics
  2. Obter MEASUREMENT_ID
  3. Adicionar em Settings → Secrets

---

## 4. **Mailchimp** (Email Marketing)
- **Tipo**: Email Marketing & Automação
- **Tokens**: `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_LIST_ID` (não configurados)
- **Uso**: Captura de emails, automações, recovery campaigns
- **Documentação**: https://mailchimp.com/developer/
- **Status**: ⚠️ Integrado mas não configurado
- **Próximos passos**:
  1. Criar conta em Mailchimp
  2. Obter API Key em Account → Extras → API Keys
  3. Obter Server Prefix (ex: us1, us2)
  4. Criar audience e obter LIST_ID
  5. Adicionar em Settings → Secrets

---

## 5. **Manus Built-in APIs** (Múltiplos Serviços)
- **Tipo**: LLM, Storage, Notifications, Data API
- **Tokens**: `BUILT_IN_FORGE_API_KEY`, `BUILT_IN_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`
- **Uso**: 
  - LLM (processamento de linguagem natural)
  - Storage (armazenamento de arquivos em S3)
  - Notifications (notificações ao owner)
  - Data API (acesso a dados externos)
- **Status**: ✅ Pré-configurado automaticamente pelo Manus
- **Documentação**: Integrada no template

---

## 6. **MySQL/TiDB Database** (Banco de Dados)
- **Tipo**: Banco de Dados Relacional
- **Token**: `DATABASE_URL`
- **Uso**: Armazenar usuários, respostas do quiz, pagamentos, assinaturas
- **Status**: ✅ Ativo e funcionando
- **Schema**: 
  - `users` (autenticação)
  - `quizzes` (histórico de quizzes)
  - `quiz_answers` (respostas dos usuários)
  - `payments` (histórico de pagamentos)
  - `subscriptions` (assinaturas ativas)

---

## 7. **Capacitor** (Apps Nativos)
- **Tipo**: Framework para apps Android/iOS
- **Tokens**: Não requer token (código aberto)
- **Uso**: Gerar apps nativos para Google Play Store e App Store
- **Status**: ✅ Instalado e configurado
- **Próximos passos**: 
  1. Configurar Android SDK ou Xcode
  2. Executar `pnpm exec cap add android` ou `pnpm exec cap add ios`
  3. Executar `pnpm run build && pnpm exec cap sync`

---

## Resumo de Tokens Necessários

| API | Token | Status | Ação |
|-----|-------|--------|------|
| Manus OAuth | `VITE_APP_ID` | ✅ Configurado | Nenhuma |
| Stripe | `STRIPE_SECRET_KEY` | ✅ Configurado (teste) | Nenhuma |
| Google Analytics | `VITE_GA_MEASUREMENT_ID` | ⚠️ Não configurado | Adicionar em Secrets |
| Mailchimp | `MAILCHIMP_API_KEY` | ⚠️ Não configurado | Adicionar em Secrets |
| Manus APIs | `BUILT_IN_FORGE_API_KEY` | ✅ Configurado | Nenhuma |
| MySQL | `DATABASE_URL` | ✅ Configurado | Nenhuma |

---

## Como Adicionar Tokens Faltantes

1. Vá para **Settings → Secrets** no Management UI
2. Clique em "Add New Secret"
3. Preencha:
   - **Key**: Nome exato da variável (ex: `VITE_GA_MEASUREMENT_ID`)
   - **Value**: Seu token/chave
4. Clique em "Save"
5. O servidor reiniciará automaticamente

---

## APIs Removidas

- **Hotjar** (Heatmaps): ❌ Removido por causar erros
  - Razão: Erro "Hotjar is not available" persistente
  - Alternativa: Use Google Analytics para rastreamento completo

---

## Próximas Integrações Sugeridas

1. **TikTok Pixel** - Para rastreamento de conversões em ads
2. **Facebook Pixel** - Para retargeting e lookalike audiences
3. **Twilio SMS** - Para confirmação de pagamento via SMS
4. **SendGrid** - Alternativa a Mailchimp para emails transacionais
5. **Sentry** - Monitoramento de erros em produção

