# Casa IBBI - Plataforma de ingressos

Plataforma para venda e gerenciamento de ingressos de eventos, com React, Vite, TypeScript, Tailwind CSS, Supabase e Mercado Pago Checkout Pro.

## Instalacao

```bash
npm install
npm run dev
```

## Variaveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_EMAIL=
VITE_ADMIN_PASSWORD=
```

Secrets privadas ficam somente nas Edge Functions:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=
SITE_URL=
```

Nunca use `VITE_` para tokens privados.

## Supabase

O projeto ja inclui `supabase/config.toml`, migration, seed e Edge Functions.

1. Crie ou escolha um projeto no Supabase e copie o `project-ref`.
2. Instale/autentique a CLI do Supabase.
3. Vincule este repositorio ao projeto:

```bash
supabase link --project-ref SEU_PROJECT_REF
```

4. Aplique a migration:

```bash
supabase db push
```

5. Opcionalmente rode `supabase/seed.sql` para dados de demonstracao no SQL Editor ou via CLI.
6. Publique as Edge Functions:

```bash
supabase functions deploy create-payment
supabase functions deploy mercadopago-webhook
```

`mercadopago-webhook` fica com `verify_jwt = false` em `supabase/config.toml`, pois o Mercado Pago chama o webhook sem JWT Supabase.

7. Configure os secrets:

```bash
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set MERCADO_PAGO_ACCESS_TOKEN=...
supabase secrets set MERCADO_PAGO_WEBHOOK_SECRET=...
supabase secrets set SITE_URL=...
```

## Mercado Pago

Use Checkout Pro. A funcao `create-payment` valida o pedido no banco, recalcula valores pelo backend e cria a preferencia. A funcao `mercadopago-webhook` consulta o pagamento diretamente na API do Mercado Pago antes de alterar o banco.

Configure o webhook no Mercado Pago apontando para:

```text
https://SEU-PROJETO.supabase.co/functions/v1/mercadopago-webhook
```

## Fluxos implementados

- Descoberta de eventos com home, categorias e cards responsivos.
- Pagina de evento com seletor de ingressos, cupom, resumo sticky e barra fixa mobile.
- Checkout em etapas, com pedido pending e ponto de integracao do Mercado Pago.
- Meus ingressos, tela do ingresso com QR Code e status.
- Check-in com camera do celular usando QR Code.
- Painel administrativo com dashboard, eventos, pedidos, participantes, criacao de evento e metricas.
- Migration com tabelas principais, RLS, reservas temporarias, confirmacao de pagamento, geracao de tickets e check-in atomico.

## Deploy

Frontend preparado para Vercel ou Netlify.

- Netlify: `netlify.toml` contem redirect SPA.
- Vercel: `vercel.json` contem rewrite SPA.

Build:

```bash
npm run build
```

## Seguranca

- Credenciais privadas nunca ficam no frontend.
- Preco, cupom, disponibilidade e status de pagamento devem ser validados no backend.
- RLS ativado nas tabelas publicas.
- Check-in e reserva usam funcoes transacionais no Postgres para evitar duplicidade e corrida de estoque.
