import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { styles } from "./ProfileStatCard.styles";

type ProfileStatCardProps = {
  favoritesCount: number;
  collectionsCount?: number; // optional, will default to 0
};

export const ProfileStatCard: React.FC<ProfileStatCardProps> = ({
  favoritesCount,
  collectionsCount = 0,
}) => {
  const { theme, mode } = useTheme();
  const router = useRouter();

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
      {/* Favorites */}
      <Pressable
        onPress={() => router.push("/favorites-list")}
        style={[styles.statBlock, styles.leftStat]}
        android_ripple={{ color: theme.border }}
      >
        <IconSymbol
          name="favorite"
          type="material"
          size={28}
          color={theme.favoriteIcon}
        />
        <ThemedText style={styles.statLabel}>Favorites</ThemedText>
        <ThemedText style={styles.statValue}>{favoritesCount}</ThemedText>
      </Pressable>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Collections */}
      <Pressable
        onPress={() => router.push("/collections/collections-list")}
        style={[styles.statBlock, styles.rightStat]}
        android_ripple={{ color: theme.border }}
      >
        <IconSymbol
          name="collections-bookmark"
          type="material"
          size={28}
          color={mode === "light" ? theme.primary : "#888"}
        />
        <ThemedText style={styles.statLabel}>Collections</ThemedText>
        <ThemedText style={styles.statValue}>{collectionsCount}</ThemedText>
      </Pressable>
    </ThemedView>
  );
};
