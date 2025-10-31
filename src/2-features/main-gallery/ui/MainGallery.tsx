import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { ZoomGalleryModal } from "../../../4-shared/components/image-zoom/ui/ZoomGalleryModal.tsx";
import { ThemedText } from "../../../4-shared/components/themed-text.tsx";
import { ThemedView } from "../../../4-shared/components/themed-view.tsx";
import { MainGalleryProps } from "../../../4-shared/types/index.ts";
import { Gallery } from "../../gallery/ui/Gallery.tsx";
import { styles } from "./MainGallery.styles.ts";
import { MainGalleryItem } from "./MainGalleryItem.tsx";

export const MainGallery: React.FC<MainGalleryProps> = ({
  images,
  loading,
  error,
  onOpenMenu,
  onPressComments,
  scrollY,
}) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const handlePressZoom = useCallback((index: number) => {
    setZoomIndex(index);
    setZoomVisible(true);
  }, []);

  if (loading) return <ActivityIndicator />;

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.error}>{error}</ThemedText>
      </ThemedView>
    );
  }
  if (!images.length) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No images found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Gallery
        galleryTitle="Mosaic Gallery"
        scrollY={scrollY}
        images={images}
        renderItem={(item, index) => (
          <MainGalleryItem
            item={item}
            onOpenMenu={() => onOpenMenu(item)}
            onPressComments={
              onPressComments ? () => onPressComments(item.id) : undefined
            }
            onPressZoom={() => handlePressZoom(index)}
          />
        )}
      />
      <ZoomGalleryModal
        images={images}
        visible={zoomVisible}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </>
  );
};
