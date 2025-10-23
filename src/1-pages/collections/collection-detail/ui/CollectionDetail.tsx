import { fetchCollectionDetail } from "@/4-shared/api/collectionsApi";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { CollectionDetail } from "@/4-shared/types/collections";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";
import { styles } from "./CollectionDetail.styles";

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { width: screenWidth } = useWindowDimensions();

  // Adjust the thumbnail width for your grid; 180 is a common mobile grid size
  const thumbWidth = 180;
  const numColumns = Math.floor(screenWidth / thumbWidth) || 2;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCollectionDetail(id as string)
      .then((result) => {
        setCollection(result);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>
          Loading collection...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!collection) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.emptyIcon}>📚</ThemedText>
        <ThemedText style={styles.emptyTitle}>Collection not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {collection.name}
        </ThemedText>
        {collection.description ? (
          <ThemedText style={styles.description}>
            {collection.description}
          </ThemedText>
        ) : null}
        <ThemedText style={styles.imageCount}>
          {collection.images.length} image
          {collection.images.length === 1 ? "" : "s"}
        </ThemedText>
      </ThemedView>
      <FlatList
        data={collection.images}
        keyExtractor={(item, idx) =>
          item.favorite_id
            ? String(item.favorite_id)
            : item.id
            ? String(item.id)
            : String(idx)
        }
        numColumns={numColumns}
        contentContainerStyle={styles.imagesGrid}
        renderItem={({ item }) => {
          let imageUrl = "";
          if (item.base_url && item.filename) {
            // Use robust helper to get the best S3 url for current grid width
            const best = getBestS3FolderForWidth(
              {
                width: item.width,
                filename: item.filename,
                base_url: item.base_url,
              },
              thumbWidth
            );
            imageUrl = best.url;
          }
          return (
            <ThemedView style={styles.imageCard}>
              <Image
                source={imageUrl ? { uri: imageUrl } : undefined}
                style={styles.image}
                resizeMode="cover"
              />
              <ThemedText style={styles.imageTitle} numberOfLines={1}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.imageAuthor} numberOfLines={1}>
                {item.author}
              </ThemedText>
            </ThemedView>
          );
        }}
        ListEmptyComponent={
          <ThemedView style={styles.centered}>
            <ThemedText style={styles.emptyIcon}>📷</ThemedText>
            <ThemedText style={styles.emptyTitle}>
              No images in this collection
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}
