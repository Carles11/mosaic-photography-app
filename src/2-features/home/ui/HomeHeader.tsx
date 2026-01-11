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
        {/* Filter icon + badge — wrapped so badge overlays the icon but does not change layout */}
        <View style={{ position: "relative" }}>
          <IconSymbol
            type="ion"
            name="filter"
            size={28}
            color={theme.icon ?? theme.text}
            style={styles.icon}
            accessibilityLabel="Open filter menu"
            onPress={onOpenFilters}
          />
          {filtersActive ? (
            <View
              // badge positioned over the top-right of the filter icon
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 10,
                height: 10,
                borderRadius: 6,
                backgroundColor: "#FF3B30",
                borderWidth: 1,
                borderColor: theme.background,
              }}
            />
          ) : null}
        </View>

        {/* Keep the chat icon exactly where it was */}
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
