import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useCollections } from "@/4-shared/context/collections/CollectionsContext";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
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
  const { getCollectionDetail, detail, detailLoading } = useCollections();
  const [zoomVisible, setZoomVisible] = React.useState(false);
  const [zoomIndex, setZoomIndex] = React.useState(0);

  const { width: screenWidth } = useWindowDimensions();
  const thumbWidth = 180;
  const numColumns = Math.floor(screenWidth / thumbWidth) || 2;

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: detail?.name || "Collection Details",
    });
  }, [navigation, detail]);

  useEffect(() => {
    if (id) {
      getCollectionDetail(id as string);
    }
    // Optional: clear detail on unmount if desired.
    // return () => setDetail(null); // would need setter in context
  }, [id, getCollectionDetail]);

  if (detailLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>
          Loading collection...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!detail) {
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
        {detail.description ? (
          <ThemedText style={styles.description}>
            {detail.description}
          </ThemedText>
        ) : null}
        <ThemedText style={styles.imageCount}>
          {detail.images.length} image
          {detail.images.length === 1 ? "" : "s"}
        </ThemedText>
      </ThemedView>
      <FlatList
        data={detail.images}
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
        images={detail.images.map((img) => ({
          ...img,
          id: Number(img.id),
          base_url: img.base_url ?? "",
          filename: img.filename ?? "",
          author: img.author ?? "",
          title: img.title ?? "",
          description: img.description ?? "",
          created_at: img.created_at ?? "",
          orientation: img.orientation ?? "",
          width: img.width ?? 0,
          height: img.height ?? 0,
        }))}
        visible={zoomVisible}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </ThemedView>
  );
}
