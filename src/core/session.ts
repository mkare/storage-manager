import { isBrowser } from "./utils";
import { createStorageFactory, createAsyncMethods } from "./storageFactory";

let sessionSync: any = null;

export const session = {
  loadSyncMethods: async () => {
    if (!sessionSync) {
      sessionSync = createStorageFactory(
        isBrowser() ? window.sessionStorage : null
      );
    }
    return sessionSync;
  },
  loadAsyncMethods: async () => {
    if (!sessionSync) {
      sessionSync = await session.loadSyncMethods();
    }
    return createAsyncMethods(sessionSync);
  },
};
