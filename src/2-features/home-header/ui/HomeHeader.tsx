import { ThemedView } from "@/4-shared/components/themed-view";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import { useRouter } from "expo-router";
import React from "react";
import { styles } from "./HomeHeader.styles";

type HomeHeaderProps = {
  onOpenFilters?: () => void;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onOpenFilters }) => {
  const colorScheme = useColorScheme();
  const theme = globalTheme[colorScheme];
  const router = useRouter();

  return (
    <ThemedView style={[styles.header, { backgroundColor: theme.background }]}>
      <ThemedView style={styles.iconsRow}>
        <IconSymbol
          type="ion"
          name="filter"
          size={28}
          color={theme.icon ?? theme.text}
          style={styles.icon}
          accessibilityLabel="Filters"
          onPress={onOpenFilters}
        />
        <IconSymbol
          type="material"
          name="chat-bubble-outline"
          size={28}
          color={theme.icon ?? theme.text}
          style={styles.icon}
          accessibilityLabel="Messages"
          onPress={() => router.push("/comments-list")}
        />
      </ThemedView>
    </ThemedView>
  );
};
