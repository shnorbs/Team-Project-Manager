type User = {
  username: string;
  email: string;
  password: string;
};

export function getUsers(): User[] {
  const users = localStorage.getItem("users");
  if (!users) {
    return [];
  }
  return JSON.parse(users);
}

export function getCurrentUser(): User | null {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    return null;
  }
  return JSON.parse(currentUser);
}

export function isNewUser(username: string, email: string): boolean {
  const users = getUsers();
  return !users.some(
    (user) => user.username === username || user.email === email,
  );
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

export function signUp(
  username: string,
  email: string,
  password: string,
): boolean {
  if (!isNewUser(username, email)) {
    return false;
  }
  const user = { username, email, password };
  addUser(user);
  localStorage.setItem("currentUser", JSON.stringify(user));
  return true;
}

export function logIn(email: string, password: string): boolean {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return false;
  }
  localStorage.setItem("currentUser", JSON.stringify(user));
  return true;
}

export function logOut(): void {
  localStorage.removeItem("currentUser");
}

const auth = {
  getUsers,
  getCurrentUser,
  isNewUser,
  addUser,
  signUp,
  logIn,
  logOut,
};

export default auth;
