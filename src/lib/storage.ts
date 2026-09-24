export function readStorage<T>(key: string, fallback: T): T {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return fallback;
    }

    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readStorageArray<T>(key: string): T[] {
  const storedValue = readStorage<unknown>(key, []);
  if (!Array.isArray(storedValue)) {
    return [];
  }

  return storedValue as T[];
}

export function readStorageObject<T>(key: string): T | null {
  const storedValue = readStorage<unknown>(key, null);
  if (
    storedValue === null ||
    typeof storedValue !== "object" ||
    Array.isArray(storedValue)
  ) {
    return null;
  }

  return storedValue as T;
}
