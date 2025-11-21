# Será que Ele(a) Gosta de Mim? - TODO

## Landing Page & Marketing
- [x] Design landing page com hero image e copy persuasivo
- [x] Seção de benefícios e diferenciais
- [ ] Testimonials/social proof
- [ ] FAQ section
- [x] CTA buttons e paywall

## Quiz & Core Features
- [x] Criar schema do banco de dados (quizzes, respostas, resultados)
- [x] Implementar 20 perguntas comportamentais
- [x] Lógica de diagnóstico (4 níveis de resultado)
- [x] Plano de ação emocional por resultado
- [x] Fluxo do quiz (freemium: 5 perguntas grátis)
- [x] Página de resultado com teaser

## Sistema de Pagamento
- [x] Integrar Stripe
- [x] Checkout simplificado (R$ 4,90 - R$ 9,90)
- [x] Assinatura mensal (R$ 14,90/mês)
- [x] Webhook de pagamento
- [x] Confirmação de pagamento

## Área de Membros
- [x] Dashboard de usuário autenticado (páginas de resultado)
- [ ] Histórico de quizzes
- [x] Acesso ao resultado completo (pós-pagamento)
- [ ] Dicas e acompanhamento diário
- [ ] Gerenciamento de assinatura

## Design & UX
- [x] Paleta de cores (rosa #FF6B9F, roxo #C8A2FF, azul #A5D8FF)
- [x] Design mobile-first responsivo
- [x] Animações e micro-interações
- [x] Variações visuais por resultado (ex: dourado para "Paixão Recíproca")
- [x] Ícone/logótipo com coração em gradiente

## Otimizações & Testes
- [x] SEO com palavras-chave (teste do crush, ele(a) gosta de mim?, etc)
- [x] Teste A/B de preços
- [ ] Analytics e tracking
- [x] Testes de funcionalidade
- [x] Otimização de performance

## Deployment & Publicação
- [x] Checkpoint final
- [x] Publicação no Manus


## Ajustes Estratégicos do Fluxo de Vendas (NOVO)
- [x] Remover limite de 5 perguntas grátis - quiz completo é grátis
- [x] Implementar paywall após responder todas as 20 perguntas (R$ 4,90)
- [x] Página de pagamento do resultado (antes de visualizar diagnóstico)
- [x] Upsell inteligente: oferecer "Conselheiro Amoroso" (R$ 14,90/mês) após visualizar resultado
- [x] Personalizações de upsell baseadas no resultado (diferentes mensagens por nível)
- [ ] Integrar Capacitor para gerar apps Android e iOS nativos

## Ajustes de UX (NOVO)
- [x] Remover seção "Planos e Preços" da landing page
- [x] Mostrar preços apenas após completar o quiz


## Capacitor - Apps Nativos
- [x] Instalar Capacitor e dependências
- [ ] Configurar Capacitor para Android
- [ ] Configurar Capacitor para iOS
- [ ] Build Android APK
- [ ] Build iOS app
- [ ] Publicar na Google Play Store
- [ ] Publicar na App Store

## Analytics & Tracking
- [x] Integrar Google Analytics 4
- [x] Integrar Hotjar para heatmaps
- [x] Rastrear eventos do quiz (início, progresso, conclusão)
- [x] Rastrear eventos de pagamento (visualização, clique, conclusão)
- [x] Rastrear drop-off points
- [ ] Dashboard de métricas

## Email Marketing - Mailchimp
- [x] Integrar Mailchimp API
- [ ] Criar formulário de captura de email na landing page
- [ ] Implementar double opt-in
- [ ] Criar sequência de welcome email
- [ ] Criar recovery campaign (para quem abandona quiz)
- [ ] Criar follow-up para pagamento
- [ ] Automação de upsell por email


## INSTRUÇÕES DE CONFIGURAÇÃO - IMPORTANTE!

### Google Analytics 4
1. Crie um projeto em https://analytics.google.com
2. Obtenha seu MEASUREMENT_ID
3. Adicione ao arquivo de Secrets (Settings → Secrets):
   - `VITE_GA_MEASUREMENT_ID`: Seu measurement ID do GA4

### Hotjar
1. Crie uma conta em https://www.hotjar.com
2. Obtenha seu SITE_ID
3. Adicione ao arquivo de Secrets:
   - `VITE_HOTJAR_SITE_ID`: Seu site ID do Hotjar

### Mailchimp
1. Crie uma conta em https://mailchimp.com
2. Obtenha sua API Key em Account → Extras → API Keys
3. Obtenha seu Server Prefix (ex: us1, us2, etc)
4. Crie uma audience (lista) e obtenha o LIST_ID
5. Adicione ao arquivo de Secrets:
   - `MAILCHIMP_API_KEY`: Sua API key
   - `MAILCHIMP_SERVER_PREFIX`: Seu server prefix
   - `MAILCHIMP_LIST_ID`: ID da sua audience

### Capacitor
1. Configure seu Android SDK (se quiser build Android)
2. Configure seu Xcode (se quiser build iOS)
3. Execute: `pnpm exec cap add android` ou `pnpm exec cap add ios`
4. Execute: `pnpm run build` para compilar o web app
5. Execute: `pnpm exec cap sync` para sincronizar com plataformas nativas
6. Para Android: `pnpm exec cap open android`
7. Para iOS: `pnpm exec cap open ios`


## Seção de Depoimentos
- [x] Criar seção de testimonials na landing page
- [x] Adicionar 5-6 depoimentos com avatar, nome e resultado
- [x] Implementar carousel/slider de depoimentos
- [x] Adicionar rating/estrelas nos depoimentos


## Remoção de Hotjar
- [ ] Remover Hotjar completamente do projeto
- [ ] Remover imports de Hotjar de todas as páginas
- [ ] Remover tracking de Hotjar do Quiz e Result


## MVP - Conselheiro Amoroso (NOVO)
- [x] Criar tabelas: subscriptions, daily_tips, user_progress
- [x] Implementar tRPC procedures para assinatura
- [x] Criar dashboard simples do Conselheiro
- [x] Implementar envio automático de dicas por email
- [x] Configurar renovação automática no Stripe
- [x] Testar fluxo completo de assinatura

## Área de Login e Perfil do Usuário
- [x] Página de login com Manus OAuth
- [x] Perfil do usuário com dados pessoais
- [x] Histórico de quizzes realizados (placeholder)
- [x] Gerenciamento de assinatura
- [x] Logout
