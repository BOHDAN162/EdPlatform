const USERS_KEY = "ep_users";
const CURRENT_KEY = "ep_current_user";

const canUseStorage = () => typeof localStorage !== "undefined";

const load = (key, fallback) => {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("load", key, e);
    return fallback;
  }
};

const save = (key, value) => {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("save", key, e);
  }
};

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const loadUsers = () => load(USERS_KEY, []);
export const saveUsers = (users) => save(USERS_KEY, users);
export const loadCurrentUser = () => load(CURRENT_KEY, null);
export const saveCurrentUser = (user) => save(CURRENT_KEY, user);
export const logoutUser = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(CURRENT_KEY);
};

export const registerUser = ({ firstName, lastName, age, email, password }) => {
  const users = loadUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "Такой email уже используется" };
  }
  const name = `${firstName} ${lastName}`.trim();
  const newUser = { id: generateId(), name, firstName, lastName, age, email, password };
  const updated = [...users, newUser];
  saveUsers(updated);
  saveCurrentUser(newUser);
  return { ok: true, user: newUser };
};

export const loginUser = ({ email, password }) => {
  const users = loadUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) return { ok: false, error: "Неверный логин или пароль" };
  saveCurrentUser(found);
  return { ok: true, user: found };
};

export const updatePassword = (userId, newPassword) => {
  const users = loadUsers();
  const updated = users.map((u) => (u.id === userId ? { ...u, password: newPassword } : u));
  saveUsers(updated);
  const current = updated.find((u) => u.id === userId);
  if (current) saveCurrentUser(current);
  return current;
};
