# DevPath

Painel de carreira para dev freelancer sair do zero aos R$ 5 mil por mês.

## O que tem

- **Fila de abordagem:** cadastre empresas (ou cole uma lista) e aborde com 1 clique no WhatsApp, com a mensagem já escrita a partir do que você notou no negócio.
- **Follow-ups automáticos:** quem não respondeu volta para a lista em 3 dias, com a mensagem certa para cada etapa.
- **Funil:** taxa de resposta, propostas e fechamentos, por nicho e por tipo de mensagem.
- **Propostas em PDF:** escolha a oferta e o cliente; sai uma proposta pronta para enviar.
- **Página pública de serviços** (`/s/seu-nome`): ofertas, case e botão de WhatsApp para colocar na bio.
- **Roadmap em 5 níveis**, prioridades do dia, timer de foco, quadro da semana e controle de renda com meta.
- **App instalável** no celular (PWA), funciona offline.

Site estático (HTML, CSS e JavaScript puro), sem build. Login e sincronização com [Supabase](https://supabase.com).

## Rodar localmente

```bash
npx serve .
```

Sem configurar o Supabase, o DevPath funciona com os dados salvos no navegador.

## Ativar login e dados na nuvem

1. Crie um projeto gratuito no Supabase.
2. Em **SQL Editor**, rode o arquivo `supabase/schema.sql` (cria as tabelas `devpath_state` e `devpath_public` com RLS).
3. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public* para `config.js`.
4. Em **Authentication → URL Configuration**, coloque a URL do site (ex.: `https://devpath.vercel.app`) em *Site URL*.

## Deploy

Importe o repositório no Vercel. Não precisa de build command nem de output directory.

## Stack

- HTML, CSS e JavaScript sem framework
- Supabase Auth + Postgres com Row Level Security
- PWA (manifest + service worker)
- Vercel
