// docs/main.js - demo: Run button writes to the console area
document.addEventListener('DOMContentLoaded', () => {
  const run = document.getElementById('run');
  const consoleBody = document.getElementById('console-body');
  const codeEl = document.querySelector('.code');

  run.addEventListener('click', () => {
    const code = codeEl.innerText.trim();
    if (!code) {
      consoleBody.innerText = 'Nothing to run — type something in the editor.';
      return;
    }
    // Demo: echo the code and show a fake runtime output
    const header = `> Running 1 file (mock run)...\n\n`;
    const body = `${code}\n\n---\nOutput:\nHello from Dawood AI demo (mock run).`;
    consoleBody.innerText = header + body;
    consoleBody.scrollTop = consoleBody.scrollHeight;
  });

  // Minor UX: placeholder clearing for the editable code area
  codeEl.addEventListener('focus', () => {
    if (codeEl.innerText.trim() === '# Start typing your Python here') {
      codeEl.innerText = '';
    }
  });
});
