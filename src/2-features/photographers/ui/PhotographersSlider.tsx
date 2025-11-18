import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import {
  PhotographerListItem,
  PhotographersSliderProps,
} from "@/4-shared/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  View,
} from "react-native";
import { fetchPhotographersList } from "../api/fetchPhotographersList";
import { styles } from "./PhotographersSlider.styles";
import { PhotographersSliderItem } from "./PhotographersSliderItem";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const PhotographersSlider: React.FC<PhotographersSliderProps> = ({
  onPhotographerPress,
}) => {
  const [photographers, setPhotographers] = useState<PhotographerListItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedIntroId, setExpandedIntroId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    fetchPhotographersList().then((data) => {
      if (mounted) {
        setPhotographers(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleIntroToggle = (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIntroId((prev) => (prev === itemId ? null : itemId));
  };

  const handleNavigateToPhotographer = (slug: string) => {
    router.push(`/photographer/${slug}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!photographers.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.pageTitle}>
        Welcome to Mosaic
      </ThemedText>
      <ThemedView style={{ paddingHorizontal: 4 }}>
        <ThemedText type="defaultSemiBold">
          Experience the world’s best vintage photography.
        </ThemedText>
        <ThemedText type="default">
          Curated collections—fast, beautiful, high-res images. Browse,
          favorite, and download, always copyright free.
        </ThemedText>
      </ThemedView>
      <ThemedText type="subtitle" style={styles.title}>
        Featured Photographers
      </ThemedText>
      <FlatList
        data={photographers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        windowSize={7}
        renderItem={({ item }) => (
          <PhotographersSliderItem
            item={item}
            isExpanded={expandedIntroId === item.id}
            onPhotographerPress={onPhotographerPress}
            onIntroToggle={handleIntroToggle}
            onNavigateToPhotographer={handleNavigateToPhotographer}
          />
        )}
      />
    </View>
  );
};
