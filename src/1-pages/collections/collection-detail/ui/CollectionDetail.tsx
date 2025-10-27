import { fetchCollectionDetail } from "@/4-shared/api/collectionsApi";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { CollectionDetail } from "@/4-shared/types/collections";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { styles } from "./CollectionDetail.styles";

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const { width: screenWidth } = useWindowDimensions();

  // Adjust the thumbnail width for your grid; 180 is a common mobile grid size
  const thumbWidth = 180;
  const numColumns = Math.floor(screenWidth / thumbWidth) || 2;

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: collection?.name || "Collection Details",
    });
  }, [navigation, collection]);

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
        renderItem={({ item, index }) => {
          let imageUrl = "";
          if (item.base_url && item.filename) {
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
              <TouchableOpacity
                onPress={() => {
                  setZoomIndex(index);
                  setZoomVisible(true);
                }}
              >
                <Image
                  source={imageUrl ? { uri: imageUrl } : undefined}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
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
      <ZoomGalleryModal
        images={collection.images.map((img) => ({
          ...img,
          id: String(img.id),
          base_url: img.base_url ?? "",
          filename: img.filename ?? "",
          author: img.author ?? "",
          title: img.title ?? "",
          description: img.description ?? "",
          created_at: img.created_at ?? "",
          orientation: img.orientation ?? "",
          width: img.width ?? 0,
          height: img.height ?? 0,
          // You do not need to assign url or favorite_id if not required by GalleryImage
        }))}
        visible={zoomVisible}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </ThemedView>
  );
}
