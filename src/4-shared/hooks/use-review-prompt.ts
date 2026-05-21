// src/4-shared/hooks/useReviewPrompt.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { useEffect, useState } from "react";

const DOWNLOAD_COUNT_KEY = "@mosaic_download_count";
const REVIEW_THRESHOLD = 5; // Prompt every 5 downloads

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
    const newCount = count + 1;
    setCount(newCount);
    await AsyncStorage.setItem(DOWNLOAD_COUNT_KEY, newCount.toString());

    // Only prompt if we hit the threshold
    if (newCount >= REVIEW_THRESHOLD) {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
        // Reset count after prompting so we don't spam them
        setCount(0);
        await AsyncStorage.setItem(DOWNLOAD_COUNT_KEY, "0");
      }
    }
  };

  return { incrementDownloadCount };
};
