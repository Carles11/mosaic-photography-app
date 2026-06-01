import {
  GLOBAL_PROMPT_LAST_SHOWN_AT_KEY,
  hasGlobalPromptCooldownElapsed,
} from "@/4-shared/constants/prompts";
import { logEvent } from "@/4-shared/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert } from "react-native";

const SUPPORT_OPEN_COUNT_KEY = "@mosaic_app_open_count";
const SUPPORT_SEEN_KEY = "@mosaic_support_modal_seen";
const SUPPORT_THRESHOLD = 5;

type UseUpdateAwarenessOptions = {
  blockPrompts?: boolean;
};

export function useUpdateAwareness({
  blockPrompts = false,
}: UseUpdateAwarenessOptions = {}) {
  useEffect(() => {
    if (__DEV__) return;
    if (blockPrompts) return;

    let active = true;

    const maybePromptForUpdate = async () => {
      try {
        // Delay slightly to give other startup UI (like support prompt) time to settle.
        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (!active) return;

        const [lastPromptRaw, supportSeen, supportOpenCountRaw] =
          await Promise.all([
            AsyncStorage.getItem(GLOBAL_PROMPT_LAST_SHOWN_AT_KEY),
            AsyncStorage.getItem(SUPPORT_SEEN_KEY),
            AsyncStorage.getItem(SUPPORT_OPEN_COUNT_KEY),
          ]);

        const lastPromptAt = lastPromptRaw ? parseInt(lastPromptRaw, 10) : null;
        const supportOpenCount = supportOpenCountRaw
          ? parseInt(supportOpenCountRaw, 10)
          : 0;
        const supportAskIsDue =
          supportSeen !== "true" && supportOpenCount >= SUPPORT_THRESHOLD - 1;

        if (!hasGlobalPromptCooldownElapsed(lastPromptAt) || supportAskIsDue) {
          return;
        }

        const update = await Updates.checkForUpdateAsync();
        if (!active || !update.isAvailable) return;

        try {
          logEvent("APP_update_prompt_shown", {
            source: "startup_check",
          });
        } catch {
          // swallow analytics errors
        }

        Alert.alert(
          "Update Available",
          "A newer version of Mosaic is ready. Update now for the latest fixes and features.",
          [
            {
              text: "Later",
              style: "cancel",
              onPress: async () => {
                try {
                  logEvent("APP_update_prompt_dismissed", {
                    source: "startup_check",
                  });
                } catch {
                  // swallow analytics errors
                }

                try {
                  await AsyncStorage.setItem(
                    GLOBAL_PROMPT_LAST_SHOWN_AT_KEY,
                    Date.now().toString(),
                  );
                } catch {
                  // swallow storage errors
                }
              },
            },
            {
              text: "Update",
              onPress: async () => {
                try {
                  logEvent("APP_update_prompt_converted", {
                    source: "startup_check",
                  });
                } catch {
                  // swallow analytics errors
                }

                try {
                  await AsyncStorage.setItem(
                    GLOBAL_PROMPT_LAST_SHOWN_AT_KEY,
                    Date.now().toString(),
                  );
                } catch {
                  // swallow storage errors
                }

                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } catch (e) {
                  console.error("[UpdateAwareness] Failed to apply update:", e);
                  try {
                    logEvent("APP_update_apply_failed", {
                      source: "startup_check",
                      error: String(e),
                    });
                  } catch {
                    // swallow analytics errors
                  }
                }
              },
            },
          ],
          {
            cancelable: true,
          },
        );
      } catch (e) {
        console.error("[UpdateAwareness] Failed to check updates:", e);
        try {
          logEvent("APP_update_check_failed", {
            source: "startup_check",
            error: String(e),
          });
        } catch {
          // swallow analytics errors
        }
      }
    };

    maybePromptForUpdate();

    return () => {
      active = false;
    };
  }, [blockPrompts]);
}
