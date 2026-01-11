import FontLoader from "@/4-shared/components/FontLoader";
import { AuthSessionProvider } from "@/4-shared/context/auth/AuthSessionContext";
import { CollectionsProvider } from "@/4-shared/context/collections/CollectionsContext";
import { CommentsProvider } from "@/4-shared/context/comments";
import { FavoritesProvider } from "@/4-shared/context/favorites";
import { FiltersProvider } from "@/4-shared/context/filters/FiltersContext";
import { ThemeProvider, useTheme } from "@/4-shared/theme/ThemeProvider";
import { MosaicToast } from "@/4-shared/utility/toast/Toast";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { logEvent } from "src/4-shared/firebase";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
  // spotlight: __DEV__,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default Sentry.wrap(function RootLayout() {
  useEffect(() => {
    logEvent("gallery_opened", { screen: "home", userType: "guest" });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GestureHandlerRootView>
          <AuthSessionProvider>
            <BottomSheetModalProvider>
              <KeyboardProvider>
                <FontLoader>
                  <CommentsProvider>
                    <FiltersProvider>
                      <CollectionsProvider>
                        <FavoritesProvider>
                          <InnerLayout />
                        </FavoritesProvider>
                      </CollectionsProvider>
                    </FiltersProvider>
                  </CommentsProvider>
                </FontLoader>
              </KeyboardProvider>
            </BottomSheetModalProvider>
          </AuthSessionProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
      <MosaicToast />
    </SafeAreaProvider>
  );
});

function InnerLayout() {
  const { mode, theme } = useTheme();
  const defaultScreenOptions = useMemo(
    () => ({
      title: "Back",
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontFamily: "TradeGothic-Bold",
        fontSize: 18,
        color: theme.text,
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
        <Stack.Screen
          name="favorites-list"
          options={{ headerShown: true, title: "Favorites" }}
        />
        <Stack.Screen
          name="collections/[id]"
          options={{ headerShown: true, title: "Collection detail" }}
        />
        <Stack.Screen
          name="collections/collections-list"
          options={{ headerShown: true, title: "Collections" }}
        />
        <Stack.Screen
          name="photographer/[slug]"
          options={{ headerShown: true, title: "Photographer" }}
        />
        <Stack.Screen
          name="photographer/photographers-list"
          options={{ headerShown: true, title: "Photographers List" }}
        />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/forgot-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/verify-email"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/confirm-email-change"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="auth/magic-link" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={mode === "light" ? "dark" : "light"} />
    </>
  );
}
