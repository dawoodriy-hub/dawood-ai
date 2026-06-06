import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';

// Brand gradient: cyan → violet → coral
const dawoodGrad = gradient(['#00d4ff', '#7c3aed', '#ff6b6b']);
const cyanGrad   = gradient(['#00d4ff', '#38bdf8']);

// ── Banner ────────────────────────────────────────────────────────────────────

export function showBanner() {
  let ascii;
  try {
    ascii = figlet.textSync('Dawood AI', {
      font: 'ANSI Shadow',
      horizontalLayout: 'full',
    });
  } catch {
    ascii = [
      '  ██████╗  █████╗ ██╗    ██╗ ██████╗  ██████╗ ██████╗     █████╗ ██╗ ',
      '  ██╔══██╗██╔══██╗██║    ██║██╔═══██╗██╔═══██╗██╔══██╗   ██╔══██╗██║ ',
      '  ██║  ██║███████║██║ █╗ ██║██║   ██║██║   ██║██║  ██║   ███████║██║ ',
      '  ██║  ██║██╔══██║██║███╗██║██║   ██║██║   ██║██║  ██║   ██╔══██║██║ ',
      '  ██████╔╝██║  ██║╚███╔███╔╝╚██████╔╝╚██████╔╝██████╔╝   ██║  ██║██║ ',
      '  ╚═════╝ ╚═╝  ╚═╝ ╚══╝╚══╝  ╚═════╝  ╚═════╝ ╚═════╝    ╚═╝  ╚═╝╚═╝ ',
    ].join('\n');
  }

  console.log('\n' + dawoodGrad(ascii));

  const tagline =
    chalk.bold.white('  Dawood AI Chatbot') +
    chalk.gray(' — Open-Source Terminal AI Agent\n') +
    chalk.dim('  v1.0.0  ·  MIT License  ·  github.com/dawood-ai/dawood\n\n') +
    chalk.cyan('  Type ') +
    chalk.bold.white('/help') +
    chalk.cyan(' for commands  ·  ') +
    chalk.bold.white('/key YOUR_KEY') +
    chalk.cyan(' to get started');

  console.log(
    boxen(tagline, {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 0, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'cyan',
    }),
  );
}

// ── Help ──────────────────────────────────────────────────────────────────────

export function showHelp() {
  const cmds = [
    ['/help',          'Show this help message'],
    ['/clear',         'Clear conversation history and screen'],
    ['/model <name>',  'Switch AI model  (e.g. /model gpt-4o)'],
    ['/provider <p>',  'Switch provider  (anthropic | openai)'],
    ['/key <key>',     'Set your API key (saved to ~/.dawood/)'],
    ['/config',        'Show current configuration'],
    ['/export',        'Export chat to markdown file'],
    ['/exit',          'Quit Dawood AI'],
  ];

  const rows = cmds
    .map(([cmd, desc]) => chalk.cyan(cmd.padEnd(18)) + chalk.gray(desc))
    .join('\n');

  console.log(
    '\n' +
    boxen(rows, {
      title: chalk.bold.white(' ⚙  Commands '),
      titleAlignment: 'center',
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
    }) +
    '\n',
  );
}

// ── Config display ────────────────────────────────────────────────────────────

export function showConfig(config, configPath) {
  const maskedKey = config.apiKey
    ? chalk.green('••••••••' + config.apiKey.slice(-6))
    : chalk.red('not set — run /key YOUR_KEY');

  const rows = [
    row('Provider   ', chalk.cyan(config.provider)),
    row('Model      ', chalk.cyan(config.model)),
    row('API Key    ', maskedKey),
    row('Streaming  ', config.streaming ? chalk.green('enabled') : chalk.yellow('disabled')),
    row('Max Tokens ', chalk.cyan(String(config.maxTokens))),
    row('Config     ', chalk.dim(configPath)),
  ].join('\n');

  console.log(
    '\n' +
    boxen(rows, {
      title: chalk.bold.white(' ⚙  Configuration '),
      titleAlignment: 'center',
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
    }) +
    '\n',
  );
}

function row(label, value) {
  return chalk.dim(label.padEnd(12)) + value;
}

// ── API key missing warning ───────────────────────────────────────────────────

export function showApiKeyWarning() {
  console.log(
    '\n' +
    boxen(
      chalk.bold.yellow('⚠  API Key Required\n\n') +
      chalk.white('Set your API key to start chatting:\n\n') +
      chalk.cyan('  /key ') + chalk.bold.white('YOUR_API_KEY') +
      '\n\n' +
      chalk.dim('Anthropic keys: console.anthropic.com\n') +
      chalk.dim('OpenAI keys:    platform.openai.com'),
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'yellow',
      },
    ) +
    '\n',
  );
}

// ── Message printing ──────────────────────────────────────────────────────────

export function printUserMessage(content) {
  console.log(
    '\n' +
    chalk.bold.cyan('  You') +
    chalk.dim(' ›') +
    '\n' +
    chalk.white('  ' + content.split('\n').join('\n  ')) +
    '\n',
  );
}

export function printAssistantLabel() {
  process.stdout.write(
    chalk.bold.magenta('  Dawood') + chalk.dim(' ›') + '\n  ',
  );
}

export function printChunk(text) {
  process.stdout.write(chalk.white(text));
}

export function endAssistantMessage() {
  process.stdout.write('\n\n');
}

// ── Utility ───────────────────────────────────────────────────────────────────

export function showError(msg) {
  console.log('\n' + chalk.red('  ✗ ') + chalk.white(msg) + '\n');
}

export function showSuccess(msg) {
  console.log(chalk.green('  ✓ ') + chalk.white(msg));
}

export function showInfo(msg) {
  console.log(chalk.cyan('  ℹ ') + chalk.gray(msg));
}

export function showDivider() {
  const width = Math.min(process.stdout.columns || 80, 80);
  console.log(chalk.dim('  ' + '─'.repeat(width - 4)));
}

export function prompt() {
  process.stdout.write(cyanGrad('\n  › '));
}