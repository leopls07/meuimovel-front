# meuimovel — Frontend

Interface web para cadastro, busca e análise de imóveis, com simulação de financiamento integrada. Consome a [meuimovel-api](https://github.com/leopls07/meuimovel).

---

## Stack

| Tecnologia | Função |
|---|---|
| React 18 + Vite | Framework e bundler |
| React Router v6 | Roteamento SPA |
| Tailwind CSS | Estilização utilitária |
| shadcn/ui (Radix UI) | Componentes base (Sheet, Dialog, Tooltip...) |
| Axios | Client HTTP com interceptors |
| `@react-oauth/google` | Google Sign-In |
| Sonner | Toasts/notificações |
| Lucide React | Ícones |

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- A [meuimovel-api](https://github.com/leopls07/meuimovel) rodando (local ou em produção)
- Um projeto no [Google Cloud Console](https://console.cloud.google.com) com o **Client ID OAuth 2.0** configurado

---

## Como rodar

**1. Instale as dependências:**

```bash
npm install
```

**2. Crie o arquivo de variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o `.env` com os seus valores:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

**3. Suba o servidor de desenvolvimento:**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

**4. Build para produção:**

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`.

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | ❌ | URL base da API (padrão: `http://localhost:8080`) |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Client ID do projeto no Google Cloud Console |

> **Atenção:** no Google Cloud Console, adicione `http://localhost:5173` (dev) e a URL de produção como **origens JavaScript autorizadas**.

---

## Estrutura do projeto

```
src/
├── api/                  # Funções de chamada à API
│   ├── axios.js          # Instância Axios (interceptors de auth e 401)
│   ├── auth.js           # Login com Google
│   ├── imoveis.js        # CRUD de imóveis
│   └── simulacao.js      # CRUD de simulações
│
├── contexts/
│   └── AuthContext.jsx   # Estado global de autenticação (token + user)
│
├── hooks/
│   ├── useImoveis.js     # Lógica de listagem, busca, criação, patch e remoção
│   ├── useSimulacao.js   # Lógica de simulação por imóvel
│   └── useSimulacoesGeral.js # Listagem global de simulações
│
├── components/
│   ├── auth/             # PrivateRoute
│   ├── imovel/           # ImovelCard, ImovelForm, ImovelPatchForm, FiltrosBusca
│   ├── simulacao/        # SimulacaoForm, SimulacaoResultado, SimulacaoCard
│   ├── layout/           # Header, Sidebar, Layout
│   └── ui/               # Componentes base (shadcn/ui + customizados)
│
├── pages/
│   ├── LoginPage.jsx
│   ├── ListaImoveisPage.jsx
│   ├── NovoImovelPage.jsx
│   ├── DetalheImovelPage.jsx
│   └── SimulacoesPage.jsx
│
└── utils/
    └── formatters.js     # Formatação de moeda, percentuais etc.
```

---

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/login` | Público | Tela de login com Google |
| `/imoveis` | Autenticado | Lista e busca de imóveis |
| `/imoveis/novo` | Autenticado | Formulário de cadastro |
| `/imoveis/:id` | Autenticado | Detalhe + edição + simulação |
| `/simulacoes` | Autenticado | Visão geral de todas as simulações |

Rotas não encontradas redirecionam para `/imoveis`. Rotas protegidas redirecionam para `/login` se não houver sessão ativa.

---

## Funcionalidades

### Autenticação

- Login via **Google OAuth2** (botão Google Sign-In nativo).
- O ID Token do Google é enviado para a API, que retorna um **JWT próprio**.
- O token é armazenado no `localStorage` e injetado automaticamente em todas as requisições pelo interceptor do Axios.
- Ao receber um `401`, o interceptor limpa a sessão e redireciona para `/login`.

### Lista de imóveis (`/imoveis`)

- Exibe todos os imóveis do usuário em um grid responsivo (1 / 2 / 3 colunas).
- **Skeleton loading** animado enquanto os dados carregam.
- **Estado vazio** com ação direta para cadastrar o primeiro imóvel.
- Botão **"Novo imóvel"** no canto superior.

### Busca com filtros

Painel de filtros expansível na tela de lista, com combinação AND:

| Filtro | Tipo |
|---|---|
| Localização | Texto |
| Preço mínimo / máximo | Valor monetário |
| Metragem mínima | Número |
| Quartos | Número |
| Banheiros | Número |
| Vagas | Número |
| Área de lazer | Booleano |
| Vaga coberta | Booleano |
| Distância máxima do metrô | Número (km) |
| Nota mínima de localização | Número |

### Cadastro de imóvel (`/imoveis/novo`)

- Formulário completo com todos os campos disponíveis.
- Campos obrigatórios: **Localização** e **Preço**.
- Exibe erros de validação por campo retornados pela API (400).
- Após salvar, redireciona para o detalhe do imóvel criado.

### Detalhe do imóvel (`/imoveis/:id`)

- Exibe cards de destaque: **Preço**, **Preço/m²** e **Custo fixo mensal** (calculados no frontend).
- Tabela completa com todos os campos do imóvel.
- **Editar:** abre um **Sheet lateral** com o formulário de patch (apenas campos alterados são enviados).
- **Remover:** abre um **Dialog de confirmação** antes de deletar.
- Badge indicando se o imóvel possui simulação cadastrada.
- Scroll automático para a seção de simulação via hash `#simulacao`.

### Simulação de financiamento

Gerenciada dentro da tela de detalhe do imóvel:

- **Criar simulação:** abre Sheet lateral com o `SimulacaoForm`. Parâmetros: entrada, taxa de juros anual, prazo em meses e amortização extra mensal.
- **Editar simulação:** preenche o formulário com os valores atuais e recalcula tudo ao salvar.
- **Remover simulação:** Dialog de confirmação.
- **Resultados exibidos:** parcela mensal (Price), prazo efetivo, total pago, total de juros, custo total mensal (parcela + custos fixos do imóvel).

### Visão geral de simulações (`/simulacoes`)

- Lista todas as simulações do usuário em cards, independente do imóvel.
- Filtros rápidos: **parcela máxima**, **total pago máximo**, **entrada máxima**, **prazo máximo (anos)**.
- Contador de filtros ativos no botão.
- Editar e remover simulações diretamente pelos cards.

---

## Autenticação — fluxo completo

```
1. Usuário clica em "Entrar com Google"
2. Google retorna um idToken
3. Frontend envia idToken para POST /api/auth/google
4. API valida, cria/atualiza o usuário e retorna { token, user }
5. Frontend salva token no localStorage (chave: meuimovel:token)
6. Todas as requisições seguintes incluem: Authorization: Bearer <token>
7. Se a API retornar 401, sessão é limpa e usuário vai para /login
```

---

## Design

O projeto usa um sistema de design próprio com **CSS custom properties**:

| Variável | Valor | Uso |
|---|---|---|
| `--color-bg` | `#F5EFE6` | Fundo da aplicação |
| `--color-surface` | `#FDFAF5` | Cards e painéis |
| `--color-accent` | `#C96A2E` | Cor principal (terracota) |
| `--color-accent-2` | `#6B8F6E` | Cor secundária (verde sage) |
| `--color-text` | `#2C2017` | Texto principal |
| `--color-muted` | `#8C7B6B` | Texto secundário |
| `--color-sidebar` | `#2C2017` | Fundo da sidebar |

**Tipografia:**
- Display / títulos: `Sora`
- Corpo: `Nunito`

**Animações:**
- Entrada de elementos: `fadeInUp` com delay escalonado (`.animate-fade-up`, `.animate-fade-up-1`...)
- Skeleton loading com efeito `shimmer`
- Textura sutil de ruído no fundo via SVG inline
