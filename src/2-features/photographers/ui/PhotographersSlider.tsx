import { OnlyTextButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import {
  FEATURED_PHOTOGRAPHERS_LIMIT,
  FEATURED_PHOTOGRAPHERS_THUMB_WIDTH,
} from "@/4-shared/config/photographers";
import {
  PhotographerListItem,
  PhotographersSliderProps,
} from "@/4-shared/types";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { fetchPhotographersList } from "../api/fetchPhotographersList";
import { styles } from "./PhotographersSlider.styles";
import { PhotographersSliderItem } from "./PhotographersSliderItem";

export const PhotographersSlider: React.FC<PhotographersSliderProps> = ({
  onPhotographerPress,
}) => {
  console.count("[PhotographersSlider] render");

  const [photographers, setPhotographers] = useState<PhotographerListItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Prefetch featured photographers and thumbnail images on app startup
  useEffect(() => {
    let mounted = true;
    console.log("[PhotographersSlider] effect: started");
    console.log("[PhotographersSlider] fetch:start");
    const start = Date.now();

    fetchPhotographersList(
      FEATURED_PHOTOGRAPHERS_LIMIT,
      FEATURED_PHOTOGRAPHERS_THUMB_WIDTH
    )
      .then((data) => {
        const took = Date.now() - start;
        console.log(
          `[PhotographersSlider] fetch:loaded time=${took}ms count=${
            data?.length ?? 0
          }`
        );
        if (mounted) {
          console.log("[PhotographersSlider] about to setPhotographers", {
            sampleFirstId: data && data.length ? data[0].id : null,
          });
          setPhotographers(data);
          console.log("[PhotographersSlider] setPhotographers called");
          setLoading(false);
          console.log("[PhotographersSlider] setLoading(false) called");
        } else {
          console.log(
            "[PhotographersSlider] mounted is false; skipping state update"
          );
        }
      })
      .catch((err) => {
        const took = Date.now() - start;
        console.warn(
          `[PhotographersSlider] fetch:error time=${took}ms error=${String(
            err
          )}`
        );
        if (mounted) {
          setPhotographers([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      console.log("[PhotographersSlider] effect: cleanup (mounted=false)");
    };
  }, []);

  const handleNavigateToPhotographer = useCallback(
    (slug: string) => {
      router.push(`/photographer/${slug}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: PhotographerListItem }) => (
      <PhotographersSliderItem
        item={item}
        onPhotographerPress={onPhotographerPress}
        onNavigateToPhotographer={handleNavigateToPhotographer}
      />
    ),
    [onPhotographerPress, handleNavigateToPhotographer]
  );

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
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle" style={styles.titleLeft}>
          Featured Photographers
        </ThemedText>

        <OnlyTextButton
          title="Photographers list"
          style={styles.titleRight}
          onPress={() => router.push("/photographer/photographers-list")}
        />
      </ThemedView>
      <FlatList
        data={photographers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        initialNumToRender={FEATURED_PHOTOGRAPHERS_LIMIT}
        windowSize={3}
        renderItem={renderItem}
      />
    </View>
  );
};
