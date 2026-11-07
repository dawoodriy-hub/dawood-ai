const API_BASE = import.meta.env.DEV ? 'http://localhost:8787' : (import.meta.env.VITE_API_URL || '');

async function request(path, body, fallbackMessage) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the Dawood AI server. Run npm run dev and try again.');
  }

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // Vite's proxy returns plain text when its backend is unavailable.
  }

  if (!response.ok) {
    if (data.error) throw new Error(data.error);
    if (response.status >= 500) {
      throw new Error('The Dawood AI server is unavailable. Run npm run dev and try again.');
    }
    throw new Error(`${fallbackMessage} (${response.status})`);
  }
  return data;
}

export async function sendCode(email) {
  return request('/api/auth/send-code', { email }, 'Failed to send code');
}

export async function verifyCode(email, code) {
  return request('/api/auth/verify-code', { email, code }, 'Failed to verify code');
}
