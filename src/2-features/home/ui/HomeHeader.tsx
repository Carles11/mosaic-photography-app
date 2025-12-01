import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { styles } from "./HomeHeader.styles";

type HomeHeaderProps = {
  onOpenFilters?: () => void;
  filtersActive?: boolean;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onOpenFilters,
  filtersActive,
}) => {
  const colorScheme = useColorScheme();
  const theme = globalTheme[colorScheme];
  const router = useRouter();

  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.iconsRow}>
        {filtersActive ? <View style={styles.badge} /> : null}
        <IconSymbol
          type="ion"
          name="filter"
          size={28}
          color={theme.icon ?? theme.text}
          style={styles.icon}
          accessibilityLabel="Open filter menu"
          onPress={onOpenFilters}
        />
        <IconSymbol
          type="material"
          name="chat-bubble-outline"
          size={28}
          color={theme.icon ?? theme.text}
          style={styles.icon}
          accessibilityLabel="Open messages/comments"
          onPress={() => router.push("/comments-list")}
        />
      </ThemedView>
    </ThemedView>
  );
};
