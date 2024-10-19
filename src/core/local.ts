import { isBrowser } from "./utils";
import { createStorageFactory, createAsyncMethods } from "./storageFactory";

let localSync: any = null;

export const local = {
  loadSyncMethods: async () => {
    if (!localSync) {
      localSync = createStorageFactory(
        isBrowser() ? window.localStorage : null
      );
    }
    return localSync;
  },
  loadAsyncMethods: async () => {
    if (!localSync) {
      localSync = await local.loadSyncMethods();
    }
    return createAsyncMethods(localSync);
  },
};
