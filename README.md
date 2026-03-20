# ShopSmart

A full-stack web application with a React frontend and Node.js/Express backend.

## Tech Stack
- **Frontend**: React 18 + Vite + ESLint
- **Backend**: Node.js + Express + ESLint
- **Testing**: Vitest (frontend), Jest + Supertest (backend), Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Database**: SQLite + Prisma (ORM)

## Getting Started

```bash
# One-command idempotent setup
bash setup.sh

# Start backend
cd server && npm run dev

# Start frontend (in another terminal)
cd client && npm run dev
```

## Running Tests

```bash
# Backend — unit + integration tests
cd server && npm test

# Backend — linting
cd server && npm run lint

# Frontend — unit + integration tests
cd client && npm run test -- --run

# Frontend — linting
cd client && npm run lint

# E2E — Playwright (requires built frontend)
cd client && npm run build
npm run test:e2e
```

## CI Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `Frontend-test.yml` | push / PR | lint + test + build frontend |
| `backend-tests.yml` | push / PR | lint + test backend |
| `e2e-tests.yml` | push / PR | build frontend + run Playwright |
| `deploy to Ec2.yml` | push to demo | deploy to AWS EC2 via SSH |
| `deploy-pages.yml` | push to main | deploy frontend to GitHub Pages |

## Project Structure

```
shopsmart/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── e2e/             # Playwright E2E tests
├── .github/
│   ├── workflows/   # CI/CD pipelines
│   └── dependabot.yml
├── setup.sh         # idempotent local setup
└── playwright.config.js
```
