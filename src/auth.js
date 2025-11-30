const USERS_KEY = "ep_users";
const CURRENT_KEY = "ep_current_user";

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("load", key, e);
    return fallback;
  }
};

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const loadUsers = () => load(USERS_KEY, []);
export const saveUsers = (users) => save(USERS_KEY, users);
export const loadCurrentUser = () => load(CURRENT_KEY, null);
export const saveCurrentUser = (user) => save(CURRENT_KEY, user);
export const logoutUser = () => localStorage.removeItem(CURRENT_KEY);

export const registerUser = ({ name, email, password }) => {
  const users = loadUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "Такой email уже используется" };
  }
  const newUser = { id: crypto.randomUUID(), name, email, password };
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
