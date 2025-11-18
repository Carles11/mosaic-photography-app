import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { View } from "react-native";
import { styles } from "./ProfileStatCard.styles";

type ProfileStatCardProps = {
  favoritesCount: number;
  collectionsCount?: number; // optional, will default to 0
};

export const ProfileStatCard: React.FC<ProfileStatCardProps> = ({
  favoritesCount,
  collectionsCount = 0,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
      {/* Favorites */}
      <View style={[styles.statBlock, styles.leftStat]}>
        <IconSymbol
          name="favorite"
          type="material"
          size={28}
          color={theme.favoriteIcon}
        />
        <ThemedText style={styles.statLabel}>Favorites</ThemedText>
        <ThemedText style={styles.statValue}>{favoritesCount}</ThemedText>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Collections */}
      <View style={[styles.statBlock, styles.rightStat]}>
        <IconSymbol
          name="collections-bookmark"
          type="material"
          size={28}
          color={theme.primary}
        />
        <ThemedText style={styles.statLabel}>Collections</ThemedText>
        <ThemedText style={styles.statValue}>{collectionsCount}</ThemedText>
      </View>
    </ThemedView>
  );
};
