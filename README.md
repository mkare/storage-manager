# Storage Utility

This utility provides a modular way to handle `localStorage`, `sessionStorage`, and cookies in both synchronous and asynchronous methods. It allows for the dynamic loading of storage methods, and helps keep your bundle size small by loading only what you need.

## Features

- Supports both **sync** and **async** methods for localStorage, sessionStorage, and cookies.
- **Dynamic imports** for async methods to reduce bundle size.
- Ability to add a custom **prefix** for all storage keys.
- Modular structure for easy maintenance and scalability.

## Installation

```bash
npm install
```

## Usage

```javascript
export const STORAGE_PREFIX = "myApp_"; // Prefix for storage keys
export const DEFAULT_COOKIE_EXP_DAYS = 14; // Default expiration for cookies in days
```

### 1. Loading Sync Methods

To load synchronous methods for localStorage or sessionStorage, use the loadSyncMethods function:

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

### 3. Using Cookies

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

## Error Handling

This utility handles errors during `get`, `set`, and `remove` operations gracefully. If there is an issue (e.g., storage quota exceeded), it logs the error to the console.
