# Contributing to Dawood AI

Thank you for your interest in contributing! Here's how to get started.

---

## Development setup

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
git clone https://github.com/dawoodriy-hub/dawood-ai
cd dawood-ai
npm install
```

### Run the CLI

```bash
cd packages/cli
npm install
node bin/dawood.js
```

### Run the web app

```bash
cd packages/web
npm install
npm run dev
# → http://localhost:3000
```

---

## Project structure

```
dawood-ai/
├── .github/              # CI workflows, issue templates, PR template
├── .vscode/              # Editor settings, tasks, extensions
├── packages/
│   ├── cli/              # Terminal AI agent (@dawood/cli)
│   │   ├── bin/          # Entry point (dawood.js)
│   │   └── src/          # index.js · api.js · config.js · ui.js
│   └── web/              # React + Vite web app (@dawood/web)
│       └── src/
│           ├── components/  # AuroraBackground · Navbar · HomePage · ApiKeyModal · ChatPage
│           └── lib/         # streamApi.js · constants.js
├── .eslintrc.json
├── .prettierrc
└── package.json
```

---

## Code style

- **Prettier** handles formatting — run `npx prettier --write .` or let VS Code format on save.
- **ESLint** catches common issues — run `npx eslint packages/` to check.
- No `console.log` left in production paths (use the `showInfo`/`showError` helpers in CLI).
- Keep components small and single-purpose.

---

## Submitting changes

1. Fork the repo and create a branch: `git checkout -b feat/my-feature`
2. Make your changes and test them manually.
3. Commit with a clear message: `git commit -m 'feat(cli): add /history command'`
4. Push and open a Pull Request — the PR template will guide you.

### Commit message format

```
<type>(<scope>): <short description>

type:  feat | fix | refactor | docs | chore | ci
scope: cli | web | root
```

---

## Reporting bugs

Use the [Bug report](.github/ISSUE_TEMPLATE/bug_report.md) issue template.  
For security issues, see [SECURITY.md](.github/SECURITY.md).
