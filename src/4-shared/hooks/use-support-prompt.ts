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
        await AsyncStorage.setItem(OPEN_COUNT_KEY, next.toString());

        if (next >= OPEN_THRESHOLD) {
          setShouldShow(true);
          try {
            logEvent("support_modal_shown", { open_count: next });
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
      await AsyncStorage.setItem(SEEN_KEY, "true");
    } catch {
      // swallow
    }
  };

  return { shouldShow, markSeen };
};
