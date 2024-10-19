export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function asyncWrapper<T>(fn: () => T): Promise<T> {
  return new Promise((resolve) => resolve(fn()));
}
