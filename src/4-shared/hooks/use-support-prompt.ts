import {
  GLOBAL_PROMPT_LAST_SHOWN_AT_KEY,
  hasGlobalPromptCooldownElapsed,
} from "@/4-shared/constants/prompts";
import { logEvent } from "@/4-shared/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const OPEN_COUNT_KEY = "@mosaic_app_open_count";
const SEEN_KEY = "@mosaic_support_modal_seen";
const OPEN_THRESHOLD = 5;

export const useSupportPrompt = () => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const seen = await AsyncStorage.getItem(SEEN_KEY);
        if (seen === "true") return;

        const stored = await AsyncStorage.getItem(OPEN_COUNT_KEY);
        const current = stored ? parseInt(stored, 10) : 0;
        const next = current + 1;
        const [lastPromptRaw] = await Promise.all([
          AsyncStorage.getItem(GLOBAL_PROMPT_LAST_SHOWN_AT_KEY),
          AsyncStorage.setItem(OPEN_COUNT_KEY, next.toString()),
        ]);
        const lastPromptAt = lastPromptRaw ? parseInt(lastPromptRaw, 10) : null;

        if (
          next >= OPEN_THRESHOLD &&
          hasGlobalPromptCooldownElapsed(lastPromptAt)
        ) {
          setShouldShow(true);
          try {
            logEvent("APP_support_modal_shown", { open_count: next });
            logEvent("APP_prompt_shown", {
              prompt_type: "support",
              trigger: "app_open_threshold",
              threshold: OPEN_THRESHOLD,
              open_count: next,
            });
          } catch {
            // swallow
          }
        }
      } catch {
        // swallow storage errors
      }
    }
    check();
  }, []);

  const markSeen = async () => {
    setShouldShow(false);
    try {
      await Promise.all([
        AsyncStorage.setItem(SEEN_KEY, "true"),
        AsyncStorage.setItem(
          GLOBAL_PROMPT_LAST_SHOWN_AT_KEY,
          Date.now().toString(),
        ),
      ]);
    } catch {
      // swallow
    }
  };

  return { shouldShow, markSeen };
};
