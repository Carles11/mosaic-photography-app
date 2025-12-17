import { fetchPhotographersList } from "@/2-features/photographers/api/fetchPhotographersList";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import SwipeableCard from "@/4-shared/components/swipeable-card/ui/SwipeableCard";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { ASO } from "@/4-shared/config/aso";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { PhotographerListItem } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./PhotographersList.styles";

const PhotographersList = () => {
  const [photographers, setPhotographers] = useState<PhotographerListItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { theme, mode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPhotographersList();
        setPhotographers(data);
      } catch (e) {
        showErrorToast("Failed to load photographers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigateToPhotographer = (slug: string) => {
    router.push(`/photographer/${slug}`);
  };

  const handleShare = async (slug: string) => {
    const url = `https://www.mosaic.photography/photographer/${slug}`;
    const message = `Check out this photographer on Mosaic! ${url}`;
    try {
      await Share.share({
        message,
        url,
        title: "Share Photographer",
      });
    } catch (e) {
      showErrorToast("Failed to share");
    }
  };

  const renderItem = ({ item }: { item: PhotographerListItem }) => (
    <SwipeableCard
      imageUrl={item.portrait}
      title={item.author}
      subtitle={item.intro}
      onPress={() => handleNavigateToPhotographer(item.slug)}
      rightActions={[
        {
          icon: (
            <Ionicons
              name="link-outline"
              size={26}
              color={mode === "light" ? theme.icon : theme.primary}
            />
          ),
          onPress: () => handleNavigateToPhotographer(item.slug),
          accessibilityLabel: "View photographer",
          backgroundColor: "#fff",
        },
        {
          icon: (
            <IconSymbol
              name="share"
              type="material"
              size={26}
              color={mode === "light" ? theme.icon : theme.primary}
            />
          ),
          onPress: () => handleShare(item.slug),
          accessibilityLabel: "Share photographer",
          backgroundColor: "#f5f5f5",
        },
      ]}
      containerStyle={{ marginBottom: 12 }}
    />
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={styles.loadingText}>
          Loading photographers...
        </ThemedText>
      </ThemedView>
    );
  }

  if (photographers.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.emptyIcon}>📷</ThemedText>
        <ThemedText style={styles.emptyTitle}>
          {ASO.photographers?.title ?? "Photographers"}
        </ThemedText>
        <ThemedText style={styles.emptyText}>
          No photographers found.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView
      style={[{ flex: 1 }, styles.page, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {ASO.photographers?.title ?? "Photographers"} (
            {photographers.length})
          </ThemedText>
          {!!ASO.photographers?.description && (
            <ThemedText style={styles.subtitle}>
              {ASO.photographers.description}
            </ThemedText>
          )}
        </ThemedView>
        <FlatList
          data={photographers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default PhotographersList;
