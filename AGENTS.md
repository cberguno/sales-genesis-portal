# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a **Taskade Genesis "Sales Genesis Portal"** — a client-side-only React SPA (CRM dashboard) built on the Taskade Genesis platform. It has no backend or database in this repo; all data comes from the Taskade Platform API (`/api/taskade/`), which is only available when the app runs inside the Taskade iframe in production.

The sole application lives at `apps/default/`. There is no monorepo structure.

### Dev environment setup

The original build toolchain (`scripts/build.mjs`, `@taskade/parade-shared`, `@taskade/parade-template-utils`) is private/internal to Taskade and not available on the public npm registry. A Vite-based dev environment has been set up as a replacement:

- **Config files added**: `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- **Type stubs**: `src/types/taskade-parade-shared.d.ts` (stubs the private `@taskade/parade-shared` types), `src/types/vite-env.d.ts`

### Key commands (run from `apps/default/`)

| Task | Command |
|------|---------|
| Dev server | `npx vite --host 0.0.0.0 --port 3000` |
| TypeScript check | `npx tsc --noEmit` |
| Test runner | `npx vitest --run` (no test files exist currently) |

### Known issues

- **3 pre-existing TS errors**: Type mismatches in `message.tsx`, `reasoning.tsx` (streamdown/shiki plugin types), and `AgentsView.tsx` (tool UI props). These are not caused by the dev setup and don't block the dev server.
- **Production build fails**: Vite v8 + lightningcss has a CSS minification conflict with Tailwind v3 output. Dev mode works fine.
- **API-dependent features**: All data views (leads, deals, activities) and AI agent chat require the Taskade Platform API, which is unavailable outside the Taskade iframe. Views show empty states in local dev.

### Installing dependencies

When running `npm install`, you must first temporarily remove the private Taskade packages from `devDependencies` in `package.json`:
1. Remove `"@taskade/parade-shared": "*"` and `"@taskade/parade-template-utils": "*"` from `devDependencies`
2. Run `npm install`
3. Restore the original `package.json` via `git checkout apps/default/package.json`

The `@/` path alias maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).
