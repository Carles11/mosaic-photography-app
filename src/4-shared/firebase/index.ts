import {
  getAnalytics,
  logEvent as logFirebaseEvent,
} from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";

// Singleton analytics instance
const analytics = getAnalytics(getApp());

// Our universal logging API
export function logEvent(event: string, params?: Record<string, any>) {
  // Optionally: add common params, error handling, or logging here!
  logFirebaseEvent(analytics, event, params);
}
