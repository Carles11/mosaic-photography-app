import { DropdownButton, SwitchButton } from "@/4-shared/components/buttons";
import { ThemedView } from "@/4-shared/components/themed-view";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { DropdownMenuItem } from "@/4-shared/types/menu";
import { useRouter } from "expo-router";
import React from "react";
import { styles } from "./HomeHeader.styles";

type HomeHeaderProps = {
  onOpenFilters?: () => void;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onOpenFilters }) => {
  const colorScheme = useColorScheme();
  const { mode, setMode } = useTheme();
  const theme = globalTheme[colorScheme];
  const router = useRouter();

  const menuItems: DropdownMenuItem[] = [
    {
      label: "Filters",
      icon: <IconSymbol name="filter" size={20} color={theme.text} />,
      action: () => {
        if (onOpenFilters) onOpenFilters();
      },
    },
    {
      label: "Toggle Theme",
      component: (
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <IconSymbol name="brightness-4" size={20} color={theme.text} />
          <SwitchButton
            value={mode === "dark"}
            onValueChange={(value) => {
              setMode(value ? "dark" : "light");
            }}
          />
        </ThemedView>
      ),
    },
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
          onPress={() => router.push("/favorites-list")}
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
