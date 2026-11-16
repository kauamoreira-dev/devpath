# DevPath

Painel de carreira para dev freelancer sair do zero aos R$ 5 mil por mês.

**Demo:** https://devpath-sand.vercel.app

Quem começa como freelancer costuma perder clientes por falta de método: não sabe quem abordar, esquece de
fazer follow-up e não mede o que funciona. O DevPath junta prospecção, abordagem, propostas e metas num
painel só, que roda no navegador e pode ser instalado no celular.

## O que tem

- **Radar de clientes:** busca empresas reais por cidade e segmento (OpenStreetMap, gratuito, ou Google Places com chave), mostra sinais de oportunidade verificáveis, salva leads sem duplicar e ajuda com mensagens e propostas por IA. Configuração em [docs/RADAR.md](docs/RADAR.md).
- **Fila de abordagem:** cadastre empresas (ou cole uma lista) e aborde com 1 clique no WhatsApp, com a mensagem já escrita a partir do que você notou no negócio.
- **Follow-ups automáticos:** quem não respondeu volta para a lista em 3 dias, com a mensagem certa para cada etapa.
- **Funil:** taxa de resposta, propostas e fechamentos, por nicho e por tipo de mensagem.
- **Propostas em PDF:** escolha a oferta e o cliente; sai uma proposta pronta para enviar.
- **Página pública de serviços** (`/s/seu-nome`): ofertas, case e botão de WhatsApp para colocar na bio.
- **Roadmap em 5 níveis**, prioridades do dia, timer de foco, quadro da semana e controle de renda com meta.
- **App instalável** no celular (PWA), funciona offline.

Site estático (HTML, CSS e JavaScript puro), sem build. Os dados ficam no navegador (com backup em arquivo). A conta no [Supabase](https://supabase.com) é opcional: libera o Radar, a página pública de serviços e uma cópia dos dados na conta.

## Arquitetura

```
Navegador (app.js, radar.js, servicos.js, sw.js)
   │  dados locais + PWA offline
   │  login opcional (Supabase Auth)
   ▼
Supabase
   ├─ Postgres com RLS: devpath_state (dados do usuário) e devpath_public (página de serviços)
   └─ Edge Function "radar" (Deno): valida a entrada, aplica limite de uso,
      busca empresas (OpenStreetMap ou Google Places) e gera textos com IA (Claude, opcional)
```

As chaves de API ficam só nos segredos da Edge Function, nunca no navegador. Detalhes em [docs/RADAR.md](docs/RADAR.md).

## Testes

```bash
npm test
```

Testes com o executor nativo do Node (`node --test`) para o núcleo do Radar e a leitura de dados do OpenStreetMap, em `tests/`.

## Rodar localmente

```bash
npx serve .
```

Sem configurar o Supabase, o DevPath funciona com os dados salvos no navegador.

## Ativar login (para o Radar)

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
- Supabase Edge Function (Deno) para o Radar: OpenStreetMap (Nominatim e Overpass), Google Places API (New) e Claude
- Vercel
