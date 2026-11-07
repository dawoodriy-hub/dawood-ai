# Dawood AI Chatbot

> Open-source AI agent for your terminal and browser. Code, automate, create — directly from the command line.

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)

---

## Quick Start

### Terminal (CLI)

```bash
# Install locally
cd packages/cli
npm install
node bin/dawood.js

# Or install globally
npm install -g .

# Then run
dawood
```

---

## CLI Commands

| Command | Description |
|---|---|
| `/help` | Show all available commands |
| `/model <name>` | Switch model (e.g. `gpt-4o`, `claude-sonnet-4-20250514`) |
| `/config` | View current configuration |
| `/system <prompt>` | Set a custom system prompt |
| `/export` | Export conversation to a Markdown file |
| `/clear` | Clear conversation history |
| `/exit` | Quit Dawood AI |

---

## Web App

From the repo root:

```bash
npm install
npm run dev
# web → http://localhost:3000
# server → http://localhost:8787
```

No API key is required. Sign-in is local to this browser (email + display name). Chats are saved in localStorage.

### Features
- Dark homepage and chat UI
- Streaming replies with a stop button
- Free Dawood AI model (optional OpenRouter models if you later add a key)
- Tools: current time, calculator, web search
- Markdown replies, saved chats, export to Markdown
- Optional voice input and speak-last-reply (browser APIs)

---

## Development

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Monorepo setup

```bash
npm install
```

### CLI development

```bash
cd packages/cli
npm install
node bin/dawood.js        # run directly
node --watch bin/dawood.js  # watch mode
```

### Web development

```bash
cd packages/web
npm install
npm run dev
```

---

## Architecture

```
dawood-ai/
├── .env.example              # optional settings
├── package.json              # Monorepo root (npm workspaces)
└── packages/
    ├── cli/                  # @dawood/cli — Terminal agent
    ├── server/               # @dawood/server — OpenRouter proxy + tools
    │   └── src/
    │       ├── index.js      # HTTP API on :8787
    │       ├── openrouter.js # Streaming + tool loop
    │       ├── tools.js      # time, calculator, web_search
    │       └── models.js     # Allowlisted models
    └── web/                  # @dawood/web — React + Vite frontend
        └── src/
            ├── App.jsx
            ├── components/ChatPage.jsx
            └── lib/streamApi.js  # POST /api/chat (proxied to server)
```

---

## License

MIT © Dawood AI Contributors
