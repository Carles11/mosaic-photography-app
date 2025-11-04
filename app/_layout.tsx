import FontLoader from "@/4-shared/components/FontLoader";
import { AuthSessionProvider } from "@/4-shared/context/auth/AuthSessionContext";
import { CommentsProvider } from "@/4-shared/context/comments";
import { FavoritesProvider } from "@/4-shared/context/favorites";
import { ThemeProvider, useTheme } from "@/4-shared/theme/ThemeProvider";
import { MosaicToast } from "@/4-shared/utility/toast/Toast";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default Sentry.wrap(function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <AuthSessionProvider>
          <BottomSheetModalProvider>
            <KeyboardProvider>
              <FontLoader>
                <ThemeProvider>
                  <CommentsProvider>
                    <FavoritesProvider>
                      <InnerLayout />
                    </FavoritesProvider>
                  </CommentsProvider>
                </ThemeProvider>
              </FontLoader>
            </KeyboardProvider>
          </BottomSheetModalProvider>
        </AuthSessionProvider>
      </GestureHandlerRootView>
      <MosaicToast />
    </SafeAreaProvider>
  );
});

function InnerLayout() {
  const { mode, theme } = useTheme();
  const defaultScreenOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontFamily: "TradeGothic-Bold",
        fontSize: 18,
      },
      headerShadowVisible: false,
    }),
    [theme]
  );
  return (
    <>
      <Stack screenOptions={defaultScreenOptions}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="comments-list"
          options={{ headerShown: true, title: "Comments List" }}
        />
      </Stack>
      <StatusBar style={mode === "light" ? "dark" : "light"} />
    </>
  );
}
