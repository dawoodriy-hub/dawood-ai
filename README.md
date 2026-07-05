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

The web app now supports sign-in with Microsoft, Google, GitHub, or Apple and asks for a display name and date of birth before entering chat. It currently runs locally in the browser and uses a fallback response path when no external AI provider is configured.

### Features
- Beautiful homepage (dark theme, aurora background)
- Sign in without an API key using OAuth-style auth providers
- Submit your display name and date of birth before chattingG
- Local demo response mode for a browser-only experience
- Live streaming responses with stop button
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
            │   ├── AuthModal.jsx        # OAuth-style login modal
            │   ├── ProfileModal.jsx     # Profile collection after sign-in
            │   └── ChatPage.jsx         # Full chat interface
            └── lib/
                ├── streamApi.js         # Browser streaming API and local fallback
                └── constants.jsx       # Shared config (providers, models, features)
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
# dawood-ai
# dawood-ai
