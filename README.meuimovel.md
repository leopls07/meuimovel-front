# meuimovel-front

Frontend do **meuimovel** — cadastro e análise de imóveis.

## Stack

- React 18 + Vite
- Tailwind CSS (v4) + shadcn/ui
- React Router
- Axios
- Sonner (toasts)
- Lucide React

## Variáveis de ambiente

Edite o arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:8080
```

## Rodar local

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run lint
npm run build
npm run preview
```

## Rotas

- `/imoveis` — lista + filtros
- `/imoveis/novo` — cadastro
- `/imoveis/:id` — detalhe + simulação

## API

Os endpoints consumidos estão em:

- `src/api/imoveis.js`
- `src/api/simulacao.js`

## Notas

- Formatação de moeda/percentual usa `Intl` do browser (pt-BR)
- UX: skeletons, empty states, confirmação de remoção (Dialog) e toasts (Sonner)
