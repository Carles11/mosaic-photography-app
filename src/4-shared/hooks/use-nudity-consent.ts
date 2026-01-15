// src/4-shared/hooks/useNudityConsent.ts
import { supabase } from "@/4-shared/api/supabaseClient";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useCallback } from "react";

/**
 * Resilient nudity-consent hook (fixed storage key).
 *
 * Notes:
 * - Uses sanitized storage key for native SecureStore to avoid "Invalid key" errors.
 * - For anonymous users tries, in order: expo-secure-store, AsyncStorage, in-memory fallback.
 */

const RAW_STORAGE_KEY = "mosaic:nudity_consent";
// SecureStore keys must only contain alphanumeric characters, ".", "-", and "_".
// Create a sanitized key for any native storage that enforces that rule.
const STORAGE_KEY = RAW_STORAGE_KEY.replace(/[^A-Za-z0-9._-]/g, "_");

type StorageImpl = {
  getItemAsync?: (key: string) => Promise<string | null>;
  setItemAsync?: (key: string, value: string) => Promise<void>;
  deleteItemAsync?: (key: string) => Promise<void>;
  // AsyncStorage shape
  getItem?: (key: string) => Promise<string | null>;
  setItem?: (key: string, value: string) => Promise<void>;
  removeItem?: (key: string) => Promise<void>;
};

let runtimeStorage: StorageImpl | null = null;
let runtimeStorageType: "securestore" | "asyncstorage" | "memory" | null = null;
const memoryStore = new Map<string, string>();

function initRuntimeStorageIfNeeded() {
  if (runtimeStorage) return;

  // Try expo-secure-store dynamically
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SecureStore = require("expo-secure-store") as StorageImpl;
    if (SecureStore && (SecureStore.getItemAsync || SecureStore.setItemAsync)) {
      runtimeStorage = SecureStore;
      runtimeStorageType = "securestore";
      console.debug(
        "[useNudityConsent] Using expo-secure-store for anonymous consent. Storage key:",
        STORAGE_KEY
      );
      return;
    }
  } catch (e) {
    // module not available (likely running in Expo Go) — fall through
  }

  // Try AsyncStorage dynamically
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage =
      require("@react-native-async-storage/async-storage") as StorageImpl;
    if (AsyncStorage && (AsyncStorage.getItem || AsyncStorage.setItem)) {
      runtimeStorage = AsyncStorage;
      runtimeStorageType = "asyncstorage";
      console.debug(
        "[useNudityConsent] Using @react-native-async-storage/async-storage for anonymous consent. Storage key:",
        STORAGE_KEY
      );
      return;
    }
  } catch (e) {
    // not available
  }

  // Fallback: in-memory (non-persistent)
  runtimeStorage = {
    getItem: async (k: string) => {
      return memoryStore.has(k) ? (memoryStore.get(k) as string) : null;
    },
    setItem: async (k: string, v: string) => {
      memoryStore.set(k, v);
    },
    removeItem: async (k: string) => {
      memoryStore.delete(k);
    },
  };
  runtimeStorageType = "memory";
  console.warn(
    "[useNudityConsent] No secure storage available. Falling back to in-memory storage. " +
      "For persistent anonymous consent install expo-secure-store and rebuild the app, or install @react-native-async-storage/async-storage."
  );
}

export function useNudityConsent() {
  const { user } = useAuthSession();

  // Check if consent exists (server for logged users, runtime storage for anonymous)
  const hasConsent = useCallback(async (): Promise<boolean> => {
    if (user?.id) {
      try {
        const { data } = await supabase
          .from("user_profiles")
          .select("filters")
          .eq("id", user.id)
          .single();
        return !!data?.filters?.nudity_consent;
      } catch (e) {
        console.warn("[useNudityConsent] supabase hasConsent error:", e);
        return false;
      }
    } else {
      initRuntimeStorageIfNeeded();
      if (!runtimeStorage) return false;

      try {
        // Use sanitized STORAGE_KEY
        const val =
          (runtimeStorage.getItemAsync &&
            (await runtimeStorage.getItemAsync(STORAGE_KEY))) ||
          (runtimeStorage.getItem &&
            (await runtimeStorage.getItem(STORAGE_KEY))) ||
          null;
        return !!val;
      } catch (e) {
        console.warn(
          "[useNudityConsent] anonymous hasConsent storage error:",
          e
        );
        return false;
      }
    }
  }, [user?.id]);

  // Persist consent
  const confirmConsent = useCallback(
    async (payload: { confirmedAt: string }) => {
      if (user?.id) {
        try {
          // merge nudity_consent into existing filters to avoid schema migration
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("filters")
            .eq("id", user.id)
            .single();
          let existingFilters = {};
          if (!error && profile?.filters) existingFilters = profile.filters;

          const updatedFilters = {
            ...((existingFilters as any) ?? { nudity: "not-nude" }),
            nudity_consent: { optedIn: true, confirmedAt: payload.confirmedAt },
          };

          await supabase.from("user_profiles").upsert({
            id: user.id,
            filters: updatedFilters,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("[useNudityConsent] confirmConsent supabase error:", e);
        }
      } else {
        initRuntimeStorageIfNeeded();
        if (!runtimeStorage) {
          console.warn(
            "[useNudityConsent] No runtime storage available to save anonymous consent."
          );
          return;
        }
        try {
          if (runtimeStorage.setItemAsync) {
            await runtimeStorage.setItemAsync(
              STORAGE_KEY,
              JSON.stringify({ confirmedAt: payload.confirmedAt })
            );
          } else if (runtimeStorage.setItem) {
            await runtimeStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ confirmedAt: payload.confirmedAt })
            );
          } else {
            // fallback to memory
            memoryStore.set(
              STORAGE_KEY,
              JSON.stringify({ confirmedAt: payload.confirmedAt })
            );
          }
        } catch (e) {
          console.warn(
            "[useNudityConsent] confirmConsent anonymous storage error:",
            e
          );
        }
      }
    },
    [user?.id]
  );

  // Revoke consent
  const revokeConsent = useCallback(async () => {
    if (user?.id) {
      try {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("filters")
          .eq("id", user.id)
          .single();
        const filters = profile?.filters ?? { nudity: "not-nude" };
        const { nudity_consent, ...rest } = filters as any;
        await supabase.from("user_profiles").upsert({
          id: user.id,
          filters: rest,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("[useNudityConsent] revokeConsent supabase error:", e);
      }
    } else {
      initRuntimeStorageIfNeeded();
      if (!runtimeStorage) {
        console.warn(
          "[useNudityConsent] No runtime storage available to delete anonymous consent."
        );
        return;
      }
      try {
        if (runtimeStorage.deleteItemAsync) {
          await runtimeStorage.deleteItemAsync(STORAGE_KEY);
        } else if (runtimeStorage.removeItem) {
          await runtimeStorage.removeItem(STORAGE_KEY);
        } else {
          memoryStore.delete(STORAGE_KEY);
        }
      } catch (e) {
        console.warn(
          "[useNudityConsent] revokeConsent anonymous storage error:",
          e
        );
      }
    }
  }, [user?.id]);

  return { hasConsent, confirmConsent, revokeConsent };
}

export default useNudityConsent;
