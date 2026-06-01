// src/4-shared/hooks/useReviewPrompt.ts
import {
  GLOBAL_PROMPT_LAST_SHOWN_AT_KEY,
  hasGlobalPromptCooldownElapsed,
} from "@/4-shared/constants/prompts";
import { logEvent } from "@/4-shared/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const DOWNLOAD_COUNT_KEY = "@mosaic_download_count";
const REVIEW_THRESHOLD = 5; // Prompt every 5 downloads

// Keep review prompt from colliding with support ask around the same lifecycle window.
const SUPPORT_OPEN_COUNT_KEY = "@mosaic_app_open_count";
const SUPPORT_SEEN_KEY = "@mosaic_support_modal_seen";
const SUPPORT_THRESHOLD = 5;

function showReviewPrePrompt(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "Enjoying Mosaic?",
      "If Mosaic helped you discover great photography, a quick review would mean a lot.",
      [
        {
          text: "Not now",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Rate Mosaic",
          onPress: () => resolve(true),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolve(false),
      },
    );
  });
}

export const useReviewPrompt = () => {
  const [count, setCount] = useState(0);

  // Load current count on mount
  useEffect(() => {
    const loadCount = async () => {
      const stored = await AsyncStorage.getItem(DOWNLOAD_COUNT_KEY);
      setCount(stored ? parseInt(stored, 10) : 0);
    };
    loadCount();
  }, []);

  const incrementDownloadCount = async () => {
    try {
      const stored = await AsyncStorage.getItem(DOWNLOAD_COUNT_KEY);
      const current = stored ? parseInt(stored, 10) : 0;
      const newCount = current + 1;

      setCount(newCount);
      await AsyncStorage.setItem(DOWNLOAD_COUNT_KEY, newCount.toString());

      // Only prompt if we hit the threshold
      if (newCount >= REVIEW_THRESHOLD) {
        const [supportSeen, supportOpenCountRaw, lastPromptRaw] =
          await Promise.all([
            AsyncStorage.getItem(SUPPORT_SEEN_KEY),
            AsyncStorage.getItem(SUPPORT_OPEN_COUNT_KEY),
            AsyncStorage.getItem(GLOBAL_PROMPT_LAST_SHOWN_AT_KEY),
          ]);

        const supportOpenCount = supportOpenCountRaw
          ? parseInt(supportOpenCountRaw, 10)
          : 0;
        const supportAskIsDue =
          supportSeen !== "true" && supportOpenCount >= SUPPORT_THRESHOLD - 1;
        const lastPromptAt = lastPromptRaw ? parseInt(lastPromptRaw, 10) : null;

        const canAttemptPrompt =
          !supportAskIsDue && hasGlobalPromptCooldownElapsed(lastPromptAt);

        if (canAttemptPrompt) {
          try {
            logEvent("APP_prompt_shown", {
              prompt_type: "review",
              trigger: "download_threshold",
              threshold: REVIEW_THRESHOLD,
            });
          } catch {
            // swallow analytics errors
          }

          const agreed = await showReviewPrePrompt();

          if (agreed) {
            try {
              logEvent("APP_prompt_converted", {
                prompt_type: "review",
                conversion: "preprompt_accept",
              });
            } catch {
              // swallow analytics errors
            }

            const canPrompt = await StoreReview.hasAction();
            if (canPrompt) {
              try {
                logEvent("APP_review_prompt_requested", {
                  source: "preprompt_accept",
                });
              } catch {
                // swallow analytics errors
              }
              await StoreReview.requestReview();
            } else {
              try {
                logEvent("APP_review_prompt_unavailable", {
                  source: "preprompt_accept",
                });
              } catch {
                // swallow analytics errors
              }
            }
          } else {
            try {
              logEvent("APP_prompt_dismissed", {
                prompt_type: "review",
                trigger: "download_threshold",
              });
            } catch {
              // swallow analytics errors
            }
          }

          await AsyncStorage.setItem(
            GLOBAL_PROMPT_LAST_SHOWN_AT_KEY,
            Date.now().toString(),
          );
        }

        // Reset after threshold check to avoid prompt loops.
        setCount(0);
        await AsyncStorage.setItem(DOWNLOAD_COUNT_KEY, "0");
      }
    } catch {
      // swallow storage/review API errors
    }
  };

  return { incrementDownloadCount };
};
