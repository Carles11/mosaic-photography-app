import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontLoader from "../src/4-shared/components/FontLoader.tsx";
import { AuthSessionProvider } from "../src/4-shared/context/auth/AuthSessionContext.tsx";
import { CommentsProvider } from "../src/4-shared/context/comments/index.ts";
import { FavoritesProvider } from "../src/4-shared/context/favorites/index.ts";
import {
  ThemeProvider,
  useTheme,
} from "../src/4-shared/theme/ThemeProvider.tsx";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
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
    </SafeAreaProvider>
  );
}

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
