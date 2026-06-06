<<<<<<< HEAD
# Dawood AI Chatbot

> Open-source AI agent for your terminal and browser. Code, automate, create — directly from the command line.

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](web/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-@dawood%2Fcli-blue)](https://npmjs.com/package/@dawood/cli)

---

## Quick Start

### Terminal (CLI)

```bash
# Install globally
npm install -g @dawood

# Launch
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

### Features
- Beautiful homepage (dark theme, aurora background)
- Sign in with Google, Microsoft, GitHub, Apple, or email
- Full chat interface with model selector
- Conversation sidebar with history
- Streaming responses

---

## Development

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Monorepo setup

```bash
git clone https://github.com/dawood-ai/dawood
cd dawood
npm install
```

### CLI development

```bash
cd packages/cli
npm install
npm run dev        # run with --watch
node bin/dawood.js # run directly
```

### Web development

```bash
cd packages/web
npm install
npm run dev
```

### Publish CLI to npm

```bash
cd packages/cli
npm publish --access public
# Users can then: npm install -g @dawood
```

---

## Architecture

```
dawood-ai/
├── package.json              # Monorepo root (npm workspaces)
└── packages/
    ├── cli/                  # @dawood/cli — Terminal agent
    │   ├── bin/
    │   │   └── dawood.js     # #!/usr/bin/env node entry point
    │   └── src/
    │       ├── index.js      # REPL main loop (readline)
    │       ├── api.js        # Streaming SSE — Anthropic & OpenAI
    │       ├── config.js     # Config r/w → ~/.dawood/config.json
    │       └── ui.js         # Terminal UI (chalk, figlet, boxen)
    └── web/                  # @dawood/web — React + Vite frontend
        ├── index.html
        └── src/
            ├── App.jsx       # All components (Navbar, Hero, Auth, Chat)
            ├── App.css       # Design tokens, keyframes, resets
            └── main.jsx      # ReactDOM.createRoot
```

---

## Config File

Config is stored at `~/.dawood/config.json`:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "apiKey": "sk-ant-...",
  "systemPrompt": "You are Dawood AI...",
  "streaming": true,
  "maxTokens": 4096,
  "theme": "dark"
}
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## License

MIT © Dawood AI Contributors
=======
# Dawood AI Chatbot

> Open-source AI agent for your terminal and browser. Code, automate, create — directly from the command line.

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](web/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-@dawood%2Fcli-blue)](https://npmjs.com/package/@dawood/cli)

---

## Quick Start

### Terminal (CLI)

```bash
# Install globally
npm install -g @dawood

# Launch
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

---

**Run in VS Code (recommended)**

- Open the workspace in VS Code: `File → Open Folder...` and select the repository root.
- Install dependencies for the monorepo from the root terminal:

```powershell
npm install
```

- Run the web app (Vite) in an integrated terminal or using the built-in `Run` panel:

```powershell
cd packages/web
npm run dev
# open the URL shown by Vite (usually http://localhost:5173 or http://localhost:3001)
```

- Run the CLI app in a terminal (inside VS Code's terminal):

```powershell
cd packages/cli
npm install
npm run dev   # watch mode
node bin/dawood.js  # run directly
```

You can also create VS Code tasks or a launch configuration to run these commands from the Run panel.

---

**Run from Command Prompt / PowerShell**

- From Windows PowerShell or Command Prompt, run the same commands shown above. Example (PowerShell):

```powershell
cd "C:\Users\<you>\path\to\dawood-ai"
npm install

# Web
cd packages/web
npm install
npm run dev

# CLI (in another terminal)
cd packages/cli
npm install
node bin/dawood.js
```

Notes:
- Ensure Node.js >= 18 and npm >= 9 are installed.
- If the web dev server reports a port-in-use, Vite will try a different port — open the URL shown in the terminal.
- To make the CLI globally available: `cd packages/cli && npm install -g .` then run `dawood`.

### Features
- Beautiful homepage (dark theme, aurora background)
- Sign in with Google, Microsoft, GitHub, Apple, or email
- Full chat interface with model selector
- Conversation sidebar with history
- Streaming responses

---

## Development

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Monorepo setup

```bash
git clone https://github.com/dawood-ai/dawood
cd dawood
npm install
```

### CLI development

```bash
cd packages/cli
npm install
npm run dev        # run with --watch
node bin/dawood.js # run directly
```

### Web development

```bash
cd packages/web
npm install
npm run dev
```

### Publish CLI to npm

```bash
cd packages/cli
npm publish --access public
# Users can then: npm install -g @dawood
```

---

## Architecture

```
dawood-ai/
├── package.json              # Monorepo root (npm workspaces)
└── packages/
    ├── cli/                  # @dawood/cli — Terminal agent
    │   ├── bin/
    │   │   └── dawood.js     # #!/usr/bin/env node entry point
    │   └── src/
    │       ├── index.js      # REPL main loop (readline)
    │       ├── api.js        # Streaming SSE — Anthropic & OpenAI
    │       ├── config.js     # Config r/w → ~/.dawood/config.json
    │       └── ui.js         # Terminal UI (chalk, figlet, boxen)
    └── web/                  # @dawood/web — React + Vite frontend
        ├── index.html
        └── src/
            ├── App.jsx       # All components (Navbar, Hero, Auth, Chat)
            ├── App.css       # Design tokens, keyframes, resets
            └── main.jsx      # ReactDOM.createRoot
```

---

## Config File

Config is stored at `~/.dawood/config.json`:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "apiKey": "sk-ant-...",
  "systemPrompt": "You are Dawood AI...",
  "streaming": true,
  "maxTokens": 4096,
  "theme": "dark"
}
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## License

MIT © Dawood AI Contributors
>>>>>>> cb1f744 (docs: add run instructions; update package files)
