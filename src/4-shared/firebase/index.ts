let logEvent: (event: string, params?: Record<string, any>) => void;

// Try/catch the import, fallback to noop for iOS or if not installed.
try {
  // Only require if available (will fail gracefully if package removed)
  const {
    getAnalytics,
    logEvent: logFirebaseEvent,
  } = require("@react-native-firebase/analytics");
  const { getApp } = require("@react-native-firebase/app");
  const analytics = getAnalytics(getApp());
  logEvent = (event: string, params?: Record<string, any>) => {
    logFirebaseEvent(analytics, event, params);
  };
} catch (e) {
  logEvent = (event: string, params?: Record<string, any>) => {
    // No-op: analytics removed or not available
    if (__DEV__) {
      console.warn("Analytics not enabled. Event suppressed:", event, params);
    }
  };
}

export { logEvent };
