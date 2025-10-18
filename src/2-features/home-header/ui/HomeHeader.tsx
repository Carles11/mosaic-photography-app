import { DropdownButton, SwitchButton } from "@/4-shared/components/buttons";
import { ThemedView } from "@/4-shared/components/themed-view";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { DropdownMenuItem } from "@/4-shared/types/menu";
import React, { useState } from "react";
import { styles } from "./HomeHeader.styles";

export const HomeHeader: React.FC = () => {
  const colorScheme = useColorScheme();
  const { mode } = useTheme();

  const theme = globalTheme[colorScheme];
  const [themeIsDark, setThemeIsDark] = useState(mode === "dark");

  // Pick logo version based on current theme
  const menuItems: DropdownMenuItem[] = [
    {
      label: "Filters",
      icon: <IconSymbol name="filter" size={20} color="#222" />,
      action: () => {
        // open filter modal or trigger filter logic
      },
    },
    {
      label: "Toggle Theme",
      component: (
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <IconSymbol name="brightness-4" size={20} color="#222" />
          <SwitchButton
            value={themeIsDark}
            onValueChange={(value) => {
              setThemeIsDark(value);
              // Add your theme toggle logic here, e.g. update context/provider
            }}
          />
        </ThemedView>
      ),
    },
    // Add more items if needed
  ];
  return (
    <ThemedView style={[styles.header, { backgroundColor: theme.background }]}>
      <DropdownButton menuItems={menuItems}>Customize</DropdownButton>

      <ThemedView style={styles.iconsRow}>
        <IconSymbol
          type="material"
          name="favorite-border"
          size={28}
          color={theme.favoriteIcon}
          style={styles.icon}
          accessibilityLabel="Favorites"
          onPress={() => {
            // handle favorite action
          }}
        />
        <IconSymbol
          type="material"
          name="chat-bubble-outline"
          size={28}
          color={theme.icon ?? theme.text}
          style={styles.icon}
          accessibilityLabel="Messages"
          onPress={() => {
            // handle messages action
          }}
        />
      </ThemedView>
    </ThemedView>
  );
};
