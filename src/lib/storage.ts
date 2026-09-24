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

export function addToStorageArray<T>(key: string, item: T): boolean {
  const items = readStorageArray<T>(key);
  items.push(item);
  return writeStorage(key, items);
}

export function updateStorageItem<T extends { id: string }>(
  key: string,
  updatedItem: T,
): boolean {
  const items = readStorageArray<T>(key);
  const itemIndex = items.findIndex((item) => item.id === updatedItem.id);

  if (itemIndex === -1) {
    return false;
  }

  items[itemIndex] = updatedItem;
  return writeStorage(key, items);
}

export type RemoveStorageResult = "saved" | "not-found" | "failed";

export function removeStorageItem(
  key: string,
  itemId: string,
): RemoveStorageResult {
  const items = readStorageArray<{ id: string }>(key);
  const remainingItems = items.filter((item) => item.id !== itemId);

  if (remainingItems.length === items.length) {
    return "not-found";
  }

  return writeStorage(key, remainingItems) ? "saved" : "failed";
}
