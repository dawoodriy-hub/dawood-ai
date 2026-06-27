# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes     |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, email a description of the issue to the maintainer directly, or use GitHub's private vulnerability reporting if available on this repository.

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact

We aim to respond within **72 hours** and will coordinate a fix before any public disclosure.

## API key safety

- The CLI stores your API key in `~/.dawood/config.json` with standard file permissions.
- The web app keeps your API key **only in memory** — it is never persisted to localStorage or sent to any server other than the AI provider (Anthropic / OpenAI).
- Never commit your API key to version control.
