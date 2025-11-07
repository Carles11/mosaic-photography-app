import { Gallery } from "@/2-features/gallery/ui/Gallery";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { MainGalleryProps } from "@/4-shared/types/index";
import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { styles } from "./MainGallery.styles";
import { MainGalleryItem } from "./MainGalleryItem";

export const MainGallery: React.FC<MainGalleryProps> = ({
  images,
  loading,
  error,
  onOpenMenu,
  onPressComments,
  scrollY,
  onGalleryScroll,
}) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const handlePressZoom = useCallback((index: number) => {
    setZoomIndex(index);
    setZoomVisible(true);
  }, []);

  const handleZoomOpenAnalytics = useCallback(
    (imageIdx: number) => {
      if (images[imageIdx]) {
        // TODO: also call props.logEvent if injected for analytics
      }
    },
    [images]
  );

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
              onPressComments
                ? () => onPressComments(String(item.id))
                : undefined
            }
            onPressZoom={() => {
              handleZoomOpenAnalytics(index);
              handlePressZoom(index);
            }}
          />
        )}
        // onGalleryScroll={onGalleryScroll}
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
