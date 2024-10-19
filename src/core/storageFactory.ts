import { isBrowser } from "./utils";
import { eventEmitter } from "./eventEmitter";
import { STORAGE_PREFIX, CACHE_EXPIRATION } from "./config";

const cache: Record<string, { value: any; timestamp: number }> = {};

export function createStorageFactory(storageType: Storage | null) {
  return {
    get<T>(key: string, defaultValue: T): T {
      const cacheKey = STORAGE_PREFIX + key;
      const cachedItem = cache[cacheKey];
      if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRATION) {
        // console.log(`Returning cached value for key: ${cacheKey}`);
        return cachedItem.value;
      }
      if (!isBrowser() || !storageType) return defaultValue;
      const value = storageType.getItem(cacheKey);
      // console.log(`Value for key ${cacheKey}: ${value}`);
      try {
        if (value === null) {
          // console.warn(
          //   `No value found for key: ${cacheKey}, returning default value.`
          // );
          return defaultValue;
        }
        const parsedValue = JSON.parse(value);
        cache[cacheKey] = { value: parsedValue, timestamp: Date.now() };
        eventEmitter.emit("itemLoaded", { key: cacheKey, value: parsedValue });
        return parsedValue;
      } catch (error) {
        // console.error(`Error parsing value for key: ${cacheKey}`, error);
        return defaultValue;
      }
    },
    set<T>(key: string, value: T) {
      const prefixedKey = STORAGE_PREFIX + key;
      // console.log(`Saving value for key: ${prefixedKey}, value: ${value}`);
      if (!isBrowser() || !storageType) return;
      try {
        storageType.setItem(
          prefixedKey,
          typeof value === "string" ? value : JSON.stringify(value)
        );
        cache[prefixedKey] = { value, timestamp: Date.now() };
        eventEmitter.emit("itemSaved", { key: prefixedKey, value });
      } catch (error) {
        // console.error(`Error setting item '${prefixedKey}':`, error);
      }
    },
    remove(key: string) {
      const prefixedKey = STORAGE_PREFIX + key;
      if (!isBrowser() || !storageType) return;
      storageType.removeItem(prefixedKey);
      delete cache[prefixedKey];
      eventEmitter.emit("itemRemoved", { key: prefixedKey });
    },
  };
}

export function createAsyncMethods(storageSync: any) {
  return {
    async get<T>(key: string, defaultValue: T): Promise<T> {
      return new Promise((resolve) =>
        resolve(storageSync.get(key, defaultValue))
      );
    },
    async set<T>(key: string, value: T): Promise<void> {
      return new Promise((resolve) => {
        storageSync.set(key, value);
        resolve();
      });
    },
    async remove(key: string): Promise<void> {
      return new Promise((resolve) => {
        storageSync.remove(key);
        resolve();
      });
    },
  };
}
