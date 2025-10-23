import FontLoader from "@/4-shared/components/FontLoader";
import { AuthSessionProvider } from "@/4-shared/context/auth/AuthSessionContext";
import { CommentsProvider } from "@/4-shared/context/comments";
import { FavoritesProvider } from "@/4-shared/context/favorites";
import { ThemeProvider, useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <AuthSessionProvider>
          <BottomSheetModalProvider>
            <FontLoader>
              <ThemeProvider>
                <CommentsProvider>
                  <FavoritesProvider>
                    <InnerLayout />
                  </FavoritesProvider>
                </CommentsProvider>
              </ThemeProvider>
            </FontLoader>
          </BottomSheetModalProvider>
        </AuthSessionProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function InnerLayout() {
  const { mode, theme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={mode === "light" ? "dark" : "light"} />
    </>
  );
}
