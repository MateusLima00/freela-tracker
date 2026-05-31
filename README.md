# FreelaTracker

Sistema FullStack para gerenciamento de projetos freelancer com controle de tempo, acompanhamento de progresso e dashboard para clientes.

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Banco de Dados](#banco-de-dados)
- [Rodando o Projeto](#rodando-o-projeto)
- [API — Endpoints](#api--endpoints)
- [Roles de Usuário](#roles-de-usuário)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Convenções de Código](#convenções-de-código)

---

## Sobre o Projeto

O **FreelaTracker** centraliza tudo que um freelancer precisa: gerenciar projetos, registrar o tempo trabalhado por sessão, acompanhar tarefas e compartilhar um painel de progresso com o cliente. O objetivo final é evoluir para uma plataforma SaaS.

---

## Funcionalidades

### Admin
- Cadastro e gerenciamento de clientes
- Criação e edição de projetos com deadline e status
- Controle de tarefas com prioridade e status (TODO → IN_PROGRESS → DONE)
- Timer de sessão por projeto (iniciar, pausar, parar)
- Histórico de tempo trabalhado por projeto
- Publicação de atualizações de progresso para o cliente
- Dashboard analítico (totais, projetos recentes, tempo logado)

### Cliente
- Visualização dos próprios projetos
- Acompanhamento de progresso e status
- Timeline de atualizações publicadas pelo admin
- Lista de tarefas do projeto

---

## Stack

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor HTTP |
| TypeScript | Tipagem estática |
| Prisma ORM | Acesso ao banco de dados |
| PostgreSQL | Banco de dados relacional |
| Supabase | Provedor de banco (opcional) |
| JWT | Autenticação |
| Zod | Validação de requests |
| Bcrypt | Hash de senhas |
| Helmet + CORS | Segurança HTTP |
| Morgan | Logs de requisições |
| express-rate-limit | Rate limiting |
| Swagger UI | Documentação da API |

### Frontend
| Tecnologia | Uso |
|---|---|
| React + TypeScript | Interface |
| Vite | Build tool |
| React Router | Roteamento |
| Context API | Estado global |
| Axios | Requisições HTTP |
| CSS Modules | Estilização por componente |

---

## Arquitetura

```
freela-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/          # env, database, supabase, swagger
│       ├── controllers/     # recebe request, retorna response
│       ├── services/        # regras de negócio
│       ├── repositories/    # queries Prisma
│       ├── routes/          # definição das rotas da API
│       ├── middlewares/     # auth, role, validate, error, logger...
│       ├── dto/             # contratos de entrada/saída
│       ├── validations/     # schemas Zod
│       ├── interfaces/      # tipos TypeScript
│       ├── enums/           # Role, ProjectStatus, TaskStatus, Priority
│       ├── utils/           # jwt, hash, response, time
│       ├── database/seeds/  # dados iniciais
│       ├── app.ts           # configuração do Express
│       └── server.ts        # bootstrap
└── frontend/
    └── src/
        ├── api/             # instância do axios
        ├── components/      # componentes reutilizáveis
        ├── context/         # Context API (auth, projeto...)
        ├── hooks/           # hooks customizados
        ├── pages/           # páginas da aplicação
        ├── routes/          # roteamento protegido
        ├── services/        # chamadas à API
        ├── styles/          # CSS global, variáveis, reset
        ├── types/           # tipos e interfaces do frontend
        └── utils/           # funções auxiliares
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org) v18+
- [npm](https://npmjs.com) v9+
- [PostgreSQL](https://www.postgresql.org) v14+ (ou conta no [Supabase](https://supabase.com))

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/freela-tracker.git
cd freela-tracker
```

### 2. Instalar dependências do backend

```bash
cd backend
npm install
```

### 3. Instalar dependências do frontend

```bash
cd ../frontend
npm install
```

---

## Variáveis de Ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cd backend
cp .env.example .env
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente | `development` |
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Chave secreta do JWT | `super_secret_key` |
| `JWT_EXPIRES_IN` | Expiração do token | `7d` |
| `SUPABASE_URL` | URL do projeto Supabase | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Chave pública do Supabase | `eyJ...` |
| `CORS_ORIGIN` | Origem permitida pelo CORS | `http://localhost:5173` |

---

## Banco de Dados

### Modelos

```
User           → id, name, email, password, role (ADMIN | CLIENT)
Project        → id, title, description, progress, status, deadline, totalTime, clientId
Task           → id, title, description, status, priority, projectId
TimerSession   → id, projectId, userId, startTime, endTime, duration, isActive, note
ProjectUpdate  → id, projectId, title, content
```

### Migrations e seed

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Criar as tabelas no banco
npm run prisma:migrate

# Popular com dados de teste
npm run prisma:seed
```

O seed cria:

| Usuário | Email | Senha | Role |
|---|---|---|---|
| Admin | admin@freela.com | admin123 | ADMIN |
| Cliente Demo | cliente@freela.com | client123 | CLIENT |

---

## Rodando o Projeto

### Backend (desenvolvimento)

```bash
cd backend
npm run dev
```

Servidor em: `http://localhost:3000`
Documentação Swagger: `http://localhost:3000/api/docs`
Health check: `http://localhost:3000/api/health`

### Backend (produção)

```bash
npm run build
npm start
```

### Frontend (desenvolvimento)

```bash
cd frontend
npm run dev
```

Interface em: `http://localhost:5173`

---

## API — Endpoints

Todos os endpoints privados exigem o header:

```
Authorization: Bearer <token>
```

### Auth — `/api/auth`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/register` | Público | Criar conta |
| POST | `/login` | Público | Login e retorno do token JWT |
| GET | `/me` | Autenticado | Dados do usuário logado |
| GET | `/clients` | ADMIN | Listar todos os clientes |

### Projetos — `/api/projects`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/` | ADMIN | Listar todos os projetos |
| GET | `/:id` | ADMIN | Buscar projeto por ID |
| POST | `/` | ADMIN | Criar projeto |
| PUT | `/:id` | ADMIN | Atualizar projeto |
| DELETE | `/:id` | ADMIN | Deletar projeto |

### Tarefas — `/api/tasks`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/project/:projectId` | ADMIN | Listar tarefas de um projeto |
| POST | `/` | ADMIN | Criar tarefa |
| PUT | `/:id` | ADMIN | Atualizar tarefa |
| DELETE | `/:id` | ADMIN | Deletar tarefa |

### Timer — `/api/timer`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/start` | ADMIN | Iniciar sessão de timer |
| PATCH | `/stop/:sessionId` | ADMIN | Parar sessão ativa |
| GET | `/active` | ADMIN | Verificar timer ativo |
| GET | `/project/:projectId` | ADMIN | Histórico de sessões do projeto |

### Painel do Cliente — `/api/client`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/projects` | CLIENT | Listar meus projetos |
| GET | `/projects/:id` | CLIENT | Ver detalhes de um projeto |
| GET | `/projects/:id/updates` | CLIENT | Ver atualizações do projeto |

### Estatísticas — `/api/stats`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/dashboard` | ADMIN | Totais, projetos recentes e gráficos |

---

## Roles de Usuário

```
ADMIN                          CLIENT
─────────────────────────      ─────────────────────────
✔ Criar projetos               ✔ Ver seus projetos
✔ Editar/deletar projetos      ✔ Acompanhar progresso
✔ Gerenciar tarefas            ✔ Ver timeline de updates
✔ Iniciar/parar timer          ✔ Ver tarefas do projeto
✔ Publicar atualizações
✔ Ver analytics/dashboard
✔ Gerenciar clientes
```

---

## Estrutura de Pastas

### Backend detalhado

```
backend/src/
│
├── config/
│   ├── database.ts          # Prisma Client singleton
│   ├── env.ts               # Variáveis de ambiente tipadas
│   ├── supabase.ts          # Cliente Supabase
│   └── swagger.ts           # Configuração da documentação
│
├── controllers/             # Camada HTTP: recebe req, chama service, retorna res
│   ├── authController.ts
│   ├── clientController.ts
│   ├── projectController.ts
│   ├── statsController.ts
│   ├── taskController.ts
│   └── timerController.ts
│
├── services/                # Regras de negócio
│   ├── auth.service.ts
│   ├── client.service.ts
│   ├── project.service.ts
│   ├── stats.service.ts
│   ├── task.service.ts
│   └── timer.service.ts
│
├── repositories/            # Queries Prisma (acesso ao banco)
│   ├── project.repository.ts
│   ├── task.repository.ts
│   ├── timer.repository.ts
│   ├── update.repository.ts
│   └── user.repository.ts
│
├── middlewares/
│   ├── authMiddleware.ts    # Valida JWT
│   ├── roleMiddleware.ts    # Verifica permissões por role
│   ├── validateMiddleware.ts# Valida body com Zod
│   ├── errorMiddleware.ts   # Handler global de erros
│   ├── loggerMiddleware.ts  # Logs HTTP (morgan)
│   ├── rateLimitMiddleware.ts
│   └── securityMiddleware.ts# Helmet + CORS
│
├── routes/                  # Definição das rotas
├── dto/                     # Interfaces de entrada e saída
├── validations/             # Schemas Zod
├── interfaces/              # Tipos TypeScript globais
├── enums/                   # Enumeradores
├── utils/                   # jwt, hash, response, time
├── database/seeds/          # Seed inicial
├── app.ts
└── server.ts
```

### Frontend detalhado

```
frontend/src/
│
├── api/                     # Instância axios com interceptors
├── assets/                  # Imagens, fontes, ícones
├── components/              # Componentes reutilizáveis (cada um em sua pasta)
│   └── TimerCard/
│       ├── TimerCard.tsx
│       ├── TimerCard.css
│       ├── TimerDisplay.tsx
│       ├── TimerControls.tsx
│       ├── TimerProgress.tsx
│       ├── types.ts
│       └── constants.ts
│
├── context/                 # Context API (auth, projetos)
├── hooks/                   # Hooks customizados (useTimer, useProjects...)
├── pages/                   # Páginas da aplicação
├── routes/                  # Roteamento com proteção por role
├── services/                # Funções de chamada à API
├── styles/
│   ├── global.css
│   ├── variables.css        # Design tokens (cores, espaços, radius)
│   ├── animations.css
│   ├── reset.css
│   └── responsive.css
│
├── types/                   # Tipos e interfaces
├── enums/                   # Enumeradores do frontend
├── interfaces/              # Interfaces de modelos
└── utils/                   # Funções auxiliares
```

---

## Convenções de Código

### Nomenclatura

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componentes | PascalCase | `TimerCard.tsx` |
| Hooks | camelCase com `use` | `useTimer.ts` |
| Services/Utils | camelCase | `auth.service.ts` |
| CSS | Mesmo nome do componente | `TimerCard.css` |
| Enums | PascalCase | `ProjectStatus` |

### Regras obrigatórias

- CSS sempre separado — nunca inline desnecessário
- Componentes com responsabilidade única
- Props sempre tipadas com TypeScript
- Nunca usar `any` sem justificativa
- Nunca expor secrets no frontend
- Nunca colocar lógica de negócio no componente principal

### Design tokens (CSS)

```css
/* Cores principais */
--color-primary:    #7c3aed;
--color-background: #030712;
--color-surface:    #111827;
--color-text:       #ffffff;

/* Outros */
--radius-lg:        20px;
--transition-normal: 0.3s ease;
--z-modal:          200;
```

---

## Scripts disponíveis

### Backend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com hot reload |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda o build de produção |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Roda as migrations |
| `npm run prisma:studio` | Abre o Prisma Studio (GUI do banco) |
| `npm run prisma:seed` | Popula o banco com dados iniciais |

---

## Licença

Projeto privado — todos os direitos reservados.
