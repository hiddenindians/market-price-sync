# Repository Guidelines

## Project Structure & Module Organization
- Backend: FeathersJS + TypeScript in `backend/src` (services under `services/*`, hooks in `hooks/*`, app bootstrap in `index.ts`). Config in `backend/config/*.json`. Public assets for the backend UI/client in `backend/public`.
- Backend tests: Mocha/TS in `backend/test/**/*.test.ts`.
- Frontend: Angular app in `frontend/src` with specs in `**/*.spec.ts` and assets in `frontend/public`.

## Build, Test, and Development Commands
- Backend setup: `cd backend && npm install`
- Backend dev: `npm run dev` (ts-node + nodemon)
- Backend build: `npm run compile` → output in `backend/lib`
- Backend start (built): `npm start`
- Backend tests: `npm test` or a file: `npm run mocha -- test/services/users/users.test.ts`
- Backend format: `npm run prettier`
- Frontend setup: `cd frontend && npm install`
- Frontend dev: `npm start` (Angular dev server)
- Frontend build: `npm run build`
- Frontend tests: `npm test`

Note: Prefer npm for both apps (package-lock present). pnpm files exist but are not required.

## Coding Style & Naming Conventions
- TypeScript 5.x; Prettier (defaults) on backend. Use 2-space indentation, semicolons, single quotes.
- Names: camelCase (vars/functions), PascalCase (classes), kebab-case for Angular component files.
- Feathers services follow plural, feature-based folders: e.g., `products`, `prices` with `*.class.ts`, `*.schema.ts`, `*.shared.ts`.

## Testing Guidelines
- Backend: Write unit/service tests in `backend/test/**`, name `*.test.ts`. Run with `npm test`. Keep tests deterministic; stub external calls.
- Frontend: Jasmine/Karma specs `*.spec.ts`. Prefer shallow tests for components and service mocks for API calls.

## Commit & Pull Request Guidelines
- Commits: Imperative, concise subject (max ~72 chars). Group related changes per commit. Conventional Commits style is welcome (feat/fix/chore), though not required.
- PRs: Include summary, linked issues, test plan, and screenshots/GIFs for UI changes. Note any config or migration steps. Keep backend and frontend changes in separate commits when possible.

## Security & Configuration Tips
- Do not commit secrets. Backend config lives in `backend/config/`; environment variable mappings are in `custom-environment-variables.json`. Set values (e.g., `MONGODB_URL`, auth secrets) via environment for each environment.
