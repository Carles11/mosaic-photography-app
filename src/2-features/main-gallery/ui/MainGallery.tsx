import { Gallery } from "@/2-features/gallery/ui/Gallery";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { ASO } from "@/4-shared/config/aso";
import { logEvent } from "@/4-shared/firebase";
import { GalleryImage } from "@/4-shared/types";
import { MainGalleryProps } from "@/4-shared/types/index";
import React, { useCallback, useEffect, useState } from "react";
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
}) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  // Analytics: fire event on mount/render
  useEffect(() => {
    logEvent("main_gallery_screen_view", {
      screen: "Home", // Parent screen
      galleryTitle: ASO.home.title,
      imagesCount: images.length,
    });
  }, [images.length]);

  const handlePressZoom = useCallback(
    (index: number) => {
      setZoomIndex(index);
      setZoomVisible(true);
      if (images[index]) {
        logEvent("main_gallery_image_zoom", {
          imageId: images[index].id,
          index,
          screen: "Home",
        });
      }
    },
    [images]
  );

  const handleOpenMenu = useCallback(
    (item: GalleryImage) => {
      logEvent("main_gallery_image_menu_open", {
        imageId: item.id,
        screen: "Home",
      });
      onOpenMenu?.(item);
    },
    [onOpenMenu]
  );

  const handleOpenComments = useCallback(
    (imageId: string | number) => {
      logEvent("main_gallery_image_comments_open", {
        imageId,
        screen: "Home",
      });
      onPressComments?.(String(imageId));
    },
    [onPressComments]
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

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
        galleryTitle={ASO.home.title}
        scrollY={scrollY}
        images={images}
        renderItem={(item, index) => (
          <MemoizedMainGalleryItem
            item={item}
            onOpenMenu={() => handleOpenMenu(item)}
            onPressComments={
              onPressComments ? () => handleOpenComments(item.id) : undefined
            }
            onPressZoom={() => handlePressZoom(index)}
          />
        )}
        // Make sure FlatList optimizations are set inside Gallery
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

// Memoized MainGalleryItem for better performance
const MemoizedMainGalleryItem = React.memo(MainGalleryItem);
