# Task Manager (Next.js 15 + tRPC)

A small task manager built with **Next.js 15 (App Router)** and **tRPC v11**. Tasks live in server memory (no database). The list is server-side rendered and loads more tasks as you scroll.

## Screenshots

- [Task list](docs/screenshots/list.png)
- [Form validation showing the required-title error](docs/screenshots/form-validation.png)
- [Success toast after deleting a task](docs/screenshots/delete-toast.png)

## Running it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Other scripts:

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `npm test`          | Runs the unit tests (Vitest)         |
| `npm run typecheck` | Type-checks the whole project        |

The app starts with 25 sample tasks so the infinite scroll can be tried right away. Set `SEED_TASKS=0` for an empty list (or any other number).

> **Important:** data lives in the memory of the Node.js process. It is lost on restart, and it only works where a single long-running server handles all requests (`next dev`, `next start`, Docker). Serverless platforms such as Vercel run several isolated instances, so each would have its own list. For a deployment like that, implement `TaskRepository` against a real database (see below).

## Features

- **CRUD via tRPC**: create, list, update and delete tasks.
- **Task model**: `id` (UUID), `title` (required), `description` (optional), `createdAt` (ISO-8601 timestamp).

The challenge uses Portuguese field names; the code uses English names by convention, with the same meaning for each field.

| Challenge | Code | Type |
| --------- | ---- | ---- |
| `id` | `id` | string (UUID, generated) |
| `titulo` | `title` | string, required |
| `descricao` | `description` | string, optional |
| `dataCriacao` | `createdAt` | ISO-8601 timestamp |

- **Validation on both sides**: the same Zod schema is used by the form and by the API, so a task can never be created without a title.
- **Meaningful errors**: `BAD_REQUEST` with per-field messages for invalid input, `NOT_FOUND` when a task does not exist (for example updating or deleting one that was already removed).
- **SSR list**: the first page of tasks is fetched on the server and hydrated on the client, so the HTML already contains the tasks.
- **Infinite scroll (bonus)**: cursor-based pagination, 10 tasks per page, loaded with an `IntersectionObserver`.
- **Feedback**: loading states, toasts for success and failure, inline field errors, an error banner with a retry button, and a 404 page.

## Pages

| Route               | Purpose                          |
| ------------------- | -------------------------------- |
| `/`                 | Task list (SSR) with delete      |
| `/tasks/new`        | Create a task                    |
| `/tasks/[id]/edit`  | Edit a task                      |
| `/api/trpc/*`       | tRPC endpoint                    |

## Architecture

The code is organized **by feature**, so adding a new module does not mean touching existing ones.

```
src/
├── app/                      # Routes only: compose pieces, no business logic
├── features/
│   └── tasks/
│       ├── domain/           # Types, Zod schemas, pure business rules (shared by client and server)
│       ├── server/           # Repository interface + in-memory implementation, service, router
│       ├── hooks/            # Data and form logic for the UI (one hook per responsibility)
│       └── components/       # TaskList, TaskItem, TaskForm
├── shared/                   # Reusable and feature-agnostic: components, hooks, utilities
├── server/                   # tRPC setup and the root router
└── trpc/                     # tRPC + TanStack Query wiring (server and client)
```

### Layers on the server

```
router  →  service  →  repository (interface)  →  in-memory implementation
```

- **Router** (`task-router.ts`): thin transport layer. Validates input with Zod and delegates.
- **Service** (`task-service.ts`): application rules (description normalization, creation timestamp, "not found" handling). It knows nothing about tRPC or Next.js, and receives the repository and a clock by injection.
- **Repository** (`task-repository.ts`): the persistence contract. `in-memory-task-repository.ts` implements it today.
- **Composition root** (`task-container.ts`): the only file that decides which repository the app runs on.

**To use a real database**, write a class or factory that implements `TaskRepository` and change one line in `task-container.ts`. The service, router and UI do not change.

### Isolated rules (pure functions)

Business rules are small pure functions, tested in isolation:

- `normalizeDescription` (`domain/task-rules.ts`)
- `validateTaskForm` (`domain/task-form.ts`)
- `paginate` (`server/pagination.ts`)
- `getFieldErrors` / `firstFieldErrors` (`shared/lib/api-error.ts`)
- `getSeedCount` / `buildSeedTasks` (`server/seed.ts`)

### UI composition

- **Hooks** hold the logic: `useTaskList`, `useDeleteTask`, `useSaveTask`, `useTaskForm`, plus the generic `useInfiniteScroll`.
- **Presentational components** (`TaskItem`, `FormField`, `ErrorBanner`, `PageHeader`) only render props.
- **Containers** (`TaskList`, `TaskForm`) just wire hooks to presentational components.

## Key decisions

- **tRPC v11 with the TanStack Query integration** (`@trpc/tanstack-react-query`). It is the supported way to prefetch on the server (React Server Components) and hydrate on the client.
- **No self-HTTP call during SSR.** The server prefetches by calling the router in-process.
- **The store is kept on `globalThis`** (inside `task-container.ts`). In `next dev`, hot reload re-evaluates modules, and route handlers and server components can live in separate module graphs. A plain module-level variable would reset or split the list.
- **Cursor pagination with a monotonic `seq`**, not an offset or the id of the last item. The cursor stays valid when a task is deleted while the user is scrolling.
- **`createdAt` is an ISO string**, so the API needs no custom serializer (like superjson) and is easy to read in any client.
- **Dates use a fixed time zone (UTC)** to avoid React hydration mismatches between the server and the browser.
- **Pages that read the list are `force-dynamic`.** Without this, `next build` would freeze the initial list into static HTML.
- **CSS Modules** instead of a styling framework: zero dependencies, works with Server Components, and enough for a layout that does not need an elaborate design.
- **Plain `useState` for form state** plus the shared Zod schema, instead of a form library. The form has two fields.
- **Update replaces `title` and `description`.** Sending an empty description clears it.
- **The router → service → repository layers are intentional.** They let a real database replace the in-memory store by changing only `task-container.ts`, and let the service be tested with a fake repository and clock. For a disposable project with no expected database, keeping the logic in the router would be simpler; this separation is a deliberate trade-off.

## Tests

`npm test` runs 34 unit tests covering the pure rules, the service (with a fake clock and a fresh repository per test) and the router (validation errors, `NOT_FOUND`, and a full CRUD cycle).

Because the service receives its repository by injection, tests never share state and need no reset helpers.

## Possible next steps

- A database-backed `TaskRepository` (for example Postgres with Drizzle) for real persistence and multi-instance deployments.
- Optimistic updates for delete.
- Component tests (Testing Library) and an end-to-end test (Playwright) for the scroll behavior.
- Search, filters and a "completed" status.
