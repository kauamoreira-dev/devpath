# DevPath

Painel de carreira para dev freelancer: roadmap em 5 níveis, abordagem diária de clientes, pipeline de clientes e vagas, timer de foco, quadro da semana e controle de renda com meta.

Site estático (HTML, CSS e JavaScript puro), sem build. Login e sincronização com [Supabase](https://supabase.com).

## Rodar localmente

```bash
npx serve .
```

Sem configurar o Supabase, o DevPath funciona com os dados salvos no navegador.

## Ativar login e dados na nuvem

1. Crie um projeto gratuito no Supabase.
2. Em **SQL Editor**, rode o arquivo `supabase/schema.sql`.
3. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public* para `config.js`.
4. Em **Authentication → URL Configuration**, coloque a URL do site (ex.: `https://devpath.vercel.app`) em *Site URL*.

## Deploy

Importe o repositório no Vercel. Não precisa de build command nem de output directory.

## Stack

- HTML, CSS e JavaScript sem framework
- Supabase Auth + Postgres com Row Level Security
- Vercel
