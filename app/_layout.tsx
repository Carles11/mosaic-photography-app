import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import FontLoader from "@/4-shared/components/FontLoader";
import { ThemeProvider, useTheme } from "@/4-shared/theme/ThemeProvider";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <FontLoader>
      <ThemeProvider>
        <InnerLayout />
      </ThemeProvider>
    </FontLoader>
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
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={mode === "light" ? "light" : "dark"} />
    </>
  );
}
