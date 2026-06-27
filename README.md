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

### First-time setup

```
  › /key sk-ant-YOUR_ANTHROPIC_KEY
  ✓ API key saved to ~/.dawood/config.json

  › Hello, what can you do?
  Dawood › I can help you write and debug code, explain concepts...
```

---

## CLI Commands

| Command | Description |
|---|---|
| `/help` | Show all available commands |
| `/key <api_key>` | Set your API key (Anthropic or OpenAI) |
| `/provider anthropic\|openai` | Switch AI provider |
| `/model <name>` | Switch model (e.g. `gpt-4o`, `claude-sonnet-4-20250514`) |
| `/config` | View current configuration |
| `/system <prompt>` | Set a custom system prompt |
| `/export` | Export conversation to a Markdown file |
| `/clear` | Clear conversation history |
| `/exit` | Quit Dawood AI |

---

## Supported Providers

| Provider | Models | Get API Key |
|---|---|---|
| **Anthropic** (default) | claude-sonnet-4-20250514, claude-opus-4, claude-haiku-4 | [console.anthropic.com](https://console.anthropic.com) |
| **OpenAI** | gpt-4o, gpt-4o-mini, gpt-4-turbo | [platform.openai.com](https://platform.openai.com) |

---

## Web App

```bash
cd packages/web
npm install
npm run dev
# → http://localhost:3000
```

The web app uses your API key directly in the browser — it's never sent to any server. Your key is stored only in memory (cleared on page refresh).

### Features
- Beautiful homepage (dark theme, aurora background)
- Enter your Anthropic or OpenAI API key to start chatting
- Live streaming responses with stop button
- Model selector per session
- Export conversation to Markdown
- Quick-prompt chips

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
├── package.json              # Monorepo root (npm workspaces)
└── packages/
    ├── cli/                  # @dawood/cli — Terminal agent
    │   ├── bin/dawood.js     # Entry point
    │   └── src/
    │       ├── index.js      # REPL main loop
    │       ├── api.js        # Streaming SSE — Anthropic & OpenAI
    │       ├── config.js     # Config r/w → ~/.dawood/config.json
    │       └── ui.js         # Terminal UI (chalk, boxen, figlet)
    └── web/                  # @dawood/web — React + Vite frontend
        ├── index.html
        └── src/
            ├── App.jsx                  # Root — routing between pages
            ├── index.css                # Design tokens & keyframes
            ├── components/
            │   ├── AuroraBackground.jsx # Animated background blobs
            │   ├── Navbar.jsx           # Top navigation bar
            │   ├── HomePage.jsx         # Landing page
            │   ├── ApiKeyModal.jsx      # API key entry modal
            │   └── ChatPage.jsx         # Full chat interface
            └── lib/
                ├── streamApi.js         # Browser SSE streaming (Anthropic + OpenAI)
                └── constants.js         # Shared config (providers, models, features)
```

---

## Config File (CLI)

Config is stored at `~/.dawood/config.json`:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "apiKey": "sk-ant-...",
  "systemPrompt": "You are Dawood AI...",
  "streaming": true,
  "maxTokens": 4096
}
```

---

## License

MIT © Dawood AI Contributors
