import { User } from "@/types/users.types";
import { toast } from "sonner";
import {
  addToStorageArray,
  readStorageArray,
  readStorageObject,
  removeStorage,
  updateStorageItem,
  writeStorage,
} from "@/lib/storage";

export function getUsers(): User[] {
  return readStorageArray<User>("users");
}

export function getCurrentUser(): User | null {
  return readStorageObject<User>("currentUser");
}

export type UniquenessConflict = "username" | "email" | null;

export function checkUniqueness(
  username: string,
  email: string,
  excludeUserId?: string,
): UniquenessConflict {
  const users = getUsers().filter((u) => u.id !== excludeUserId);

  if (users.some((u) => u.username === username)) {
    return "username";
  }
  if (users.some((u) => u.email === email)) {
    return "email";
  }
  return null;
}

export function addUser(user: User): boolean {
  if (!addToStorageArray("users", user)) {
    toast.error("Unable to save user information");
    return false;
  }
  return true;
}

export function signUp(
  username: string,
  email: string,
  password: string,
): boolean {
  if (checkUniqueness(username, email) !== null) {
    return false;
  }
  const user = { id: crypto.randomUUID(), username, email, password };
  if (!addUser(user)) {
    return false;
  }
  if (!writeStorage("currentUser", user)) {
    toast.error("Unable to complete sign up");
    return false;
  }
  return true;
}

export function updateUser(updatedUser: User): boolean {
  if (!updateStorageItem("users", updatedUser)) {
    return false;
  }
  if (!writeStorage("currentUser", updatedUser)) {
    toast.error("Unable to save user information");
    return false;
  }
  toast.success("User information updated");
  return true;
}

export function updateName(newUsername: string): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  if (
    checkUniqueness(newUsername, currentUser.email, currentUser.id) ===
    "username"
  ) {
    return false;
  }
  const updatedUser = { ...currentUser, username: newUsername };
  return updateUser(updatedUser);
}

export function updateEmail(newEmail: string): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  if (
    checkUniqueness(currentUser.username, newEmail, currentUser.id) === "email"
  ) {
    return false;
  }
  const updatedUser = { ...currentUser, email: newEmail };
  return updateUser(updatedUser);
}

export function updatePassword(newPassword: string): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  const updatedUser = { ...currentUser, password: newPassword };
  return updateUser(updatedUser);
}

export function logIn(email: string, password: string): boolean {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return false;
  }
  if (!writeStorage("currentUser", user)) {
    toast.error("Unable to complete sign in");
    return false;
  }
  return true;
}

export function logOut(): void {
  removeStorage("currentUser");
}
