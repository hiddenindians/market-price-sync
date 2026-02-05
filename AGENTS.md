# AGENTS.md

This file is for agentic coding tools operating in this repo. Keep guidance practical, concise, and aligned
with the current project conventions.

## Quick Facts
- Stack: FeathersJS (Koa) + TypeScript backend, Angular 18 frontend.
- Node: >= 20.11.1 (backend package.json).
- Package manager: npm (package-lock present). pnpm files exist but are not required.

## Project Structure
- Backend source: `backend/src`.
- Backend services: `backend/src/services/*` (plural feature folders like `products`, `prices`).
- Backend hooks: `backend/src/hooks/*`.
- Backend config: `backend/config/*.json` (env mapping in `custom-environment-variables.json`).
- Backend public assets: `backend/public`.
- Backend build output: `backend/lib` (generated; do not edit).
- Backend tests: `backend/test/**/*.test.ts`.
- Frontend source: `frontend/src`.
- Frontend assets: `frontend/public`.
- Frontend tests: `frontend/src/**/*.spec.ts`.

## Build / Run / Test Commands
Run commands from the relevant subdirectory.

Backend
- Install: `cd backend && npm install`
- Dev server: `npm run dev` (ts-node + nodemon)
- Build: `npm run compile` (outputs `backend/lib`)
- Start (built): `npm start`
- Format: `npm run prettier`
- Tests (all): `npm test`
- Tests (single file): `npm run mocha -- test/services/users/users.test.ts`
- Scripts:
  - Backfill prints: `npm run backfill:prints`
  - Bundle client: `npm run bundle:client`

Frontend
- Install: `cd frontend && npm install`
- Dev server: `npm start` (Angular dev server)
- Build: `npm run build`
- Build (watch): `npm run watch`
- Test (all): `npm test`
- Test (single spec): `npm test -- --include=src/app/path/to/file.spec.ts`
  - If include does not work in your environment, use: `npx ng test --include=**/file.spec.ts`

Linting
- No ESLint config detected. Use Prettier and existing code style.

## Formatting Rules
- Prettier config in `.prettierrc`:
  - 2 spaces, no tabs.
  - print width 110.
  - single quotes.
  - no semicolons.
  - no trailing commas.
- Frontend `.editorconfig` enforces 2-space indentation, utf-8, and trailing newline.
- Keep files ASCII unless the file already uses Unicode or requires it.

## TypeScript Style
- Strict mode enabled in backend `tsconfig.json`; avoid `any`.
- Prefer `import type` for type-only imports.
- Favor explicit return types for exported functions, service methods, and hooks.
- Use `async/await` with `try/catch` for error flow you want to handle locally.
- Use `void` for fire-and-forget promises (see `frontend/src/app/app.component.ts`).

## Imports
- Order groups: external packages, then internal modules.
- Separate groups with a blank line.
- Keep type-only imports in the same group but use `import type`.

## Naming Conventions
- camelCase: variables, functions, object keys.
- PascalCase: classes, types, interfaces, enums.
- kebab-case: Angular component files and folders.
- Feathers services: plural, feature-based folders with `*.class.ts`, `*.schema.ts`, `*.shared.ts`.

## Backend Conventions (FeathersJS)
- Use TypeBox schemas for service data and queries (`*.schema.ts`).
- Export `Static<typeof schema>` types for data, patch, and query shapes.
- Validators come from `dataValidator` and `queryValidator` in `backend/src/validators`.
- Register global hooks in `backend/src/app.ts` (e.g., `logError`).
- Keep app configuration in `backend/config/` and read via `app.get`.
- Prefer `@feathersjs/errors` for consistent HTTP errors.
- Log errors via the shared logger (`backend/src/logger`). Do not swallow errors.

## Backend Services & Hooks
- Add new services under `backend/src/services/<feature>`.
- Register services in `backend/src/services/index.ts`.
- Service folders typically include `*.class.ts`, `*.schema.ts`, `*.shared.ts`, `*.hooks.ts`.
- Keep hooks focused: validate/authorize in `before`, post-process in `after`.
- Prefer `Type.Object(..., { additionalProperties: false })` for schemas.
- Use `Type.Pick`, `Type.Partial`, and `querySyntax` when defining data/patch/query types.
- Keep resolver definitions in the corresponding `*.schema.ts` file.
- Avoid mutating params or context in-place unless required by Feathers patterns.

## Backend Runtime & Data
- MongoDB is the primary datastore; keep ObjectId fields as `ObjectIdSchema()` in schemas.
- Prefer `app.get()` for config values (host, port, origins, public path).
- Handle unhandled promise rejections via logger; do not ignore them.
- Keep scripts under `backend/scripts` and run with `ts-node` if needed.

## Frontend Conventions (Angular)
- Standalone components are used (see `frontend/src/app/app.component.ts`).
- Use Angular Material modules as needed; keep imports scoped to the component.
- Prefer RxJS operators (`map`, `shareReplay`) for derived streams.
- Keep component templates in HTML and styles in `.scss`/`.less` as configured.

## Frontend Patterns
- Use `inject()` for DI where it keeps constructors minimal.
- Name observable streams with a `$` suffix (e.g., `isHandset$`).
- Keep side effects in `ngOnInit` and use `void` for fire-and-forget calls.
- Favor `AsyncPipe` over manual subscriptions in templates.
- Keep routing in `frontend/src/app` and use `RouterLink` for navigation.
- Add static assets under `frontend/public` to match Angular asset configuration.
- Use Angular Material prebuilt theme referenced in `frontend/angular.json`.

## Error Handling
- Backend: throw Feathers errors with meaningful messages and status codes.
- Backend: avoid broad `catch` without rethrowing or logging.
- Frontend: surface user-facing errors when appropriate; avoid silent failures.

## Testing Guidelines
- Backend: Mocha + ts-node. Tests live under `backend/test/**` and use `.test.ts`.
- Backend: keep tests deterministic; stub external services/network.
- Frontend: Jasmine/Karma specs `*.spec.ts` under `frontend/src`.
- Frontend: prefer shallow tests with service mocks for API calls.

## Configuration & Environment
- Backend configuration is loaded with `@feathersjs/configuration`.
- Environment values are mapped in `backend/config/custom-environment-variables.json`.
- Prefer `NODE_ENV=test` when running Mocha for backend tests.
- Keep environment-specific secrets out of the repo.

## Docs and Rules
- Cursor rules: none found (`.cursor/rules/` or `.cursorrules`).
- Copilot rules: none found (`.github/copilot-instructions.md`).

## Commit & PR Guidance
- Commits: imperative, concise subject (~72 chars). Conventional Commits welcome.
- PRs: include summary, linked issues, test plan, and screenshots/GIFs for UI.
- Keep backend and frontend changes in separate commits when possible.

## Security Notes
- Always code in a way that is secure. Do not introduce security issues.
- Do not commit API keys or secrets.
