# Radar de Clientes

Módulo de prospecção do DevPath: busca empresas reais por cidade e segmento (OpenStreetMap de graça, ou Google Places com chave), mostra sinais de oportunidade verificáveis, salva leads no funil que já existe e ajuda a escrever mensagens e propostas com IA. O contato é sempre manual, pelo WhatsApp.

## Modo gratuito (padrão) e modo Google

| | Gratuito (OpenStreetMap) | Google Places |
|---|---|---|
| Quando vale | Sempre que **não** há `GOOGLE_PLACES_API_KEY` | Quando a chave está configurada |
| Custo | Zero, sem cartão | Pago por consulta (há cota grátis mensal) |
| Empresas | Reais, mapeadas pela comunidade | Reais, cadastradas no Google |
| Telefone e site | Poucos cadastrados (em Santarém, 2 de 60 restaurantes tinham telefone) | Quase sempre |
| Avaliações | Não tem | Tem |
| Guardar os dados | Permitido (licença ODbL, com atribuição) | Restrito pelos termos do Google |

No modo gratuito, cada card sem telefone mostra **Procurar contato no Google** e **Procurar no Instagram**: links que abrem a busca para você encontrar o contato manualmente, sem raspar nada.

Sem `ANTHROPIC_API_KEY`, a análise e o rascunho de proposta da ficha são **automáticos**: feitos com regras sobre os dados do lead e das suas ofertas, sem custo, e marcados como "sem IA".

Detalhes técnicos do modo gratuito: a cidade é localizada pelo Nominatim, e a busca roda num raio de 10 km do centro no Overpass. O servidor principal (`overpass-api.de`) recusa pedidos vindos do Supabase (erro 406), então a função tenta `overpass.kumi.systems`, depois `overpass.private.coffee` e só por último o principal.

## Como funciona

```
Navegador (radar.js)
   │  supabase.functions.invoke("radar") + token de login
   ▼
Edge Function "radar" (Supabase, Deno)        ← chaves ficam só aqui
   ├─ valida a entrada (validate.ts)
   ├─ confere o limite de uso no banco (radar_try_consume)
   ├─ Google Places API (New): Text Search e Place Details (places.ts)
   ├─ classifica a oportunidade (opportunity.ts)
   └─ IA: Claude via SDK oficial (ai.ts + prompts.ts)
```

- Os leads salvos entram no mesmo funil de **Clientes e vagas**: aparecem na fila de abordagem, nos follow-ups, no funil e nas propostas. Ficam só no navegador do usuário (com backup em arquivo na aba Hoje). Nada dos leads vai para o banco; a conta serve só para autenticar as chamadas ao Radar.
- Duplicatas são evitadas pelo `place_id` do Google. Para leads antigos sem `place_id`, a checagem usa nome e telefone.
- O WhatsApp abre por um link `wa.me` só quando o usuário clica, com a mensagem para revisar. Nada é enviado automaticamente e não existe disparo em massa.

## Classificação de oportunidade

Usa só dados que vêm do Google. A pontuação aparece no card, em "Por que essa classificação".

| Sinal | Pontos |
|---|---|
| Site não informado no Google | +45 |
| O link cadastrado é rede social ou agregador (Instagram, Linktree, iFood…) | +30 |
| Site próprio cadastrado | 0 |
| Telefone comercial público | +15 |
| Sem avaliações ou menos de 15 avaliações | +10 |
| Marcado como fechado no Google | classificação "Fechado no Google" |

Alta a partir de 55 pontos, média a partir de 30. "Site não informado" significa que o Google não tem site cadastrado, nunca que a empresa não tem site.

## O que falta configurar

### 1. Chave do Google Places (opcional: troca a fonte gratuita pelo Google)

1. Em https://console.cloud.google.com crie um projeto e ative o faturamento (o Google exige cartão, mesmo dentro da cota gratuita).
2. Em **APIs e serviços → Biblioteca**, ative **Places API (New)**.
3. Em **APIs e serviços → Credenciais**, crie uma **chave de API**. Em "Restrições de API", deixe só a **Places API (New)**. Não restrinja por site: a chave é usada no servidor, não no navegador.
4. Em **Faturamento → Orçamentos e alertas**, crie um alerta de orçamento (por exemplo, R$ 50).
5. No Supabase: **Edge Functions → radar → Secrets** (ou **Project Settings → Edge Functions → Secrets**), adicione `GOOGLE_PLACES_API_KEY`.

Custos: a busca pede telefone, site e avaliações, o que cai nos SKUs **Text Search Enterprise** e **Place Details Enterprise** do Google. Os preços e a cota gratuita mensal mudam; confira em https://developers.google.com/maps/billing-and-pricing/pricing. Cada página de resultados (até 20 empresas) é uma chamada. Os limites abaixo seguram o gasto mesmo se algo sair do controle.

### 2. Chave da IA (opcional)

Sem ela, o Radar funciona normalmente, mas os botões de IA ficam desativados e os modelos de mensagem continuam disponíveis.

1. Crie uma chave em https://platform.claude.com (API Keys) e defina um limite de gasto mensal na conta.
2. No Supabase, adicione o secret `ANTHROPIC_API_KEY`.

### Variáveis de ambiente (secrets da Edge Function)

| Variável | Obrigatória | Padrão | Para quê |
|---|---|---|---|
| `GOOGLE_PLACES_API_KEY` | não | — | Troca o OpenStreetMap pelo Google Places (pago) |
| `ANTHROPIC_API_KEY` | não | — | Liga os recursos de IA |
| `AI_PROVIDER` | não | `anthropic` | Provedor de IA (a camada é desacoplada em `ai.ts`) |
| `AI_MODEL` | não | `claude-opus-5-5` | Modelo usado. Para gastar menos, `claude-haiku-5-5` |
| `AI_EFFORT` | não | `low` | Esforço do modelo: `low`, `medium` ou `high` |
| `RADAR_SEARCH_DAILY` / `RADAR_SEARCH_MONTHLY` | não | 25 / 900 | Buscas por usuário por dia / total da plataforma por mês |
| `RADAR_DETAILS_DAILY` / `RADAR_DETAILS_MONTHLY` | não | 60 / 900 | Atualizações de dados de uma empresa |
| `RADAR_AI_DAILY` / `RADAR_AI_MONTHLY` | não | 40 / 1500 | Usos da IA |
| `ALLOWED_ORIGINS` | não | `https://devpath-sand.vercel.app,http://localhost:8765` | Sites que podem chamar a função (CORS) |

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já vêm prontas em toda Edge Function.

## Segurança

- Chaves só no servidor. O navegador manda apenas o token de login, validado pela função em cada chamada.
- Entradas validadas e limitadas em tamanho (`validate.ts`). Links externos só são exibidos se forem `http(s)`.
- Limites de uso contados de forma atômica no banco (`radar_usage`, funções `radar_try_consume` e `radar_refund`). Só o servidor pode chamar essas funções; cada usuário só lê o próprio uso (RLS). Chamadas que falham no Google ou na IA não contam no limite.
- A IA recebe só fatos verificáveis e as anotações do usuário, dentro de `<dados>`, com instruções para não inventar problemas, preços ou interesse do dono. Os dados vão como informação, não como instrução, para reduzir prompt injection pelo nome da empresa.

## Dados do Google: retenção e exibição

- Os resultados de busca não são guardados: ficam só na memória da página.
- Ao salvar um lead, o DevPath guarda o `place_id` (o Google permite guardar esse identificador) e uma cópia dos dados exibidos (nome, telefone, site, endereço, avaliações) com a data da consulta. A ficha avisa quando a cópia tem mais de 30 dias e oferece **Atualizar dados**.
- **Atenção:** os termos do Google Maps Platform restringem guardar conteúdo do Places além do `place_id`. A cópia existe para o CRM funcionar sem pagar uma consulta a cada vez que a ficha abre. Se quiser seguir a leitura mais estrita dos termos, a alternativa é guardar só o `place_id` e as suas anotações, e buscar os detalhes na hora (cada abertura custa uma consulta Place Details). Avalie com base nos termos atuais: https://cloud.google.com/maps-platform/terms
- A página mostra a atribuição "Dados de empresas: Google Maps" junto dos resultados.

## LGPD e boas práticas de contato

- Use só telefones comerciais públicos, para abordagem individual e com motivo legítimo (oferta de serviço ao negócio).
- Toda mensagem gerada inclui a opção de a pessoa dizer que não tem interesse.
- O botão **Pediu para não ser contatado** tira o lead da fila e dos follow-ups.
- Não use o Radar para disparos em massa nem para montar listas para terceiros.

## Testes

```bash
npm test
```

Testa validação, classificação, prompts e esquemas da IA (sem rede).

Teste de interface com backend **simulado** (fixture de teste, não são dados reais). Requer Playwright:

```bash
npx serve -l 8765 .
```

```bash
node tests/e2e/radar.e2e.mjs
```

## Deploy da Edge Function

O código fica em `supabase/functions/radar/`. Para publicar com a CLI do Supabase:

```bash
supabase functions deploy radar --no-verify-jwt --project-ref ohpkdbvhqfckzqitsuvt
```

`--no-verify-jwt` porque a própria função valida o token (e assim o preflight de CORS passa). A migração do banco está em `supabase/migrations/20261104_radar_usage.sql`.
