# Storage Utility

This utility provides a modular way to handle `localStorage`, `sessionStorage`, and cookies in both synchronous and asynchronous methods. It allows for the dynamic loading of storage methods, and helps keep your bundle size small by loading only what you need.

## Key Features

- **Sync** and **Async** Support: Provides both synchronous and asynchronous methods for managing localStorage, sessionStorage, and cookies.
- **Dynamic imports** Loads async methods on demand, reducing initial bundle size.
- Custom Key Prefix: Configurable **prefix** for storage keys to avoid conflicts.
- Event-driven Notifications: Notifies other parts of your app about storage changes using an event emitter.
- Error Handling: Gracefully handles storage errors such as quota exceedance and logs them to the console.
- Modular structure for easy maintenance and scalability.

<!-- ## Installation

```bash
npm install
``` -->

## Getting Started

```javascript
export const STORAGE_PREFIX = "myApp_"; // Prefix for storage keys
export const DEFAULT_COOKIE_EXP_DAYS = 14; // Default expiration for cookies (in days)
export const CACHE_EXPIRATION = 60 * 60 * 1000; // Cache expiration time in milliseconds
```

## Basic Usage

### 1. Loading Sync Methods

To load synchronous methods for localStorage or sessionStorage, use the `loadSyncMethods` function:

```javascript
import { local, session } from "./core";

// Load sync localStorage methods
const syncLocal = await local.loadSyncMethods();
syncLocal.set("user", { name: "John Doe" });
const user = syncLocal.get("user", { name: "default" });
syncLocal.remove("user");

// Load sync sessionStorage methods
const syncSession = await session.loadSyncMethods();
syncSession.set("sessionKey", "value");
```

### 2. Loading Async Methods

You can also load asynchronous methods dynamically using the loadAsyncMethods function:

```javascript
import { local, session } from "./core";

// Load async localStorage methods
const asyncLocal = await local.loadAsyncMethods();
await asyncLocal.set("user", { name: "John Doe" });
const user = await asyncLocal.get("user", { name: "default" });
await asyncLocal.remove("user");

// Load async sessionStorage methods
const asyncSession = await session.loadAsyncMethods();
await asyncSession.set("sessionKey", "value");
```

### 3. Working with Cookies

You can also manage cookies in both sync and async modes:

```javascript
import { cookie } from "./core";

// Load async cookie methods
const asyncCookie = await cookie.loadAsyncMethods();
await asyncCookie.set("cookieKey", "cookieValue", 7); // Set cookie with expiration in days
const cookieValue = await asyncCookie.get("cookieKey", null);
await asyncCookie.remove("cookieKey");
```

## Advanced Usage

### Storage Event Listener

The utility includes an event emitter that triggers events when storage changes. This is useful if you need to notify the user or update the UI upon saving data.

```javascript
import { eventEmitter } from "./core/eventEmitter";

// Listen for storage changes
eventEmitter.on("itemSaved", ({ key, value }) => {
  console.log(`Item saved to ${key}`, value);
  // Additional UI updates or notifications
});

eventEmitter.on("itemRemoved", ({ key }) => {
  console.log(`Item removed from ${key}`);
  // Additional UI updates or notifications
});

eventEmitter.on("itemLoaded", ({ key, value }) => {
  console.log(`Item loaded from ${key}`, value);
  // Additional UI updates or notifications
});
```

### Custom Prefix

Configuring Prefix
You can set a custom prefix for your storage keys by modifying the `STORAGE_PREFIX` in the `config.ts` file.

```javascript
export const STORAGE_PREFIX = "customApp_";
```

## API Reference

```javascript
// createStorageFactory
get(key: string, defaultValue: T): Retrieves a value from storage. Returns `defaultValue` if key not found.
set(key: string, value: T): Stores a value with the specified key.
remove(key: string): Deletes a value associated with the specified key.

// EventEmitter Methods
on(event: string, handler: EventHandler): Registers a handler for the specified event.
emit(event: string, ...args: any[]): Emits an event to trigger registered handlers.
off(event: string, handler: EventHandler): Removes a handler for the specified event.
```

## Common Use Cases

```javascript
// Handling Large Data Objects
local.set("largeData", { key1: "value1", key2: "value2", ... });
const largeData = local.get("largeData");

// User Settings Management
local.set("userSettings", { theme: "dark", language: "en" });
const userSettings = local.get("userSettings");

// Cross-Component Communication
eventEmitter.on("itemSaved", ({ key, value }) => {
  console.log(`New data saved under ${key}`);
});
```

## Error Handling

This utility handles errors during `get`, `set`, and `remove` operations gracefully. If there is an issue (e.g., storage quota exceeded), it logs the error to the console.

```javascript
core/
├── config.ts # Configuration settings
├── eventEmitter.ts # Event emitter for storage changes
├── local.ts # LocalStorage manager
├── session.ts # SessionStorage manager
├── storageFactory.ts # Storage factory for creating storage methods
├── utils.ts # Utility functions (e.g., isBrowser)
└── cookie.ts # Cookie manager
```
