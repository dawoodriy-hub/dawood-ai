const USERS_KEY = 'dawood-ai-users';

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : {};
    return users && typeof users === 'object' ? users : {};
  } catch {
    return {};
  }
}

export function saveUser(email, userData) {
  const users = getUsers();
  users[email.toLowerCase()] = {
    email: email.toLowerCase(),
    ...userData,
    updatedAt: Date.now(),
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUser(email) {
  const users = getUsers();
  return users[email.toLowerCase()] || null;
}

export function upsertUser(email, userData) {
  const users = getUsers();
  const existing = users[email.toLowerCase()] || {};
  users[email.toLowerCase()] = {
    ...existing,
    ...userData,
    email: email.toLowerCase(),
    updatedAt: Date.now(),
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users[email.toLowerCase()];
}
