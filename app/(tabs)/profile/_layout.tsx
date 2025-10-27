import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { Stack } from "expo-router";
import { useMemo } from "react";

export default function ProfileStackLayout() {
  const { theme } = useTheme();

  const screenOptions = useMemo(
    () => ({
      title: "Profile",
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontFamily: "TradeGothic-Bold",
        fontSize: 18,
      },
    }),
    [theme]
  );

  return (
    <Stack>
      <Stack.Screen name="index" options={screenOptions} />
    </Stack>
  );
}
