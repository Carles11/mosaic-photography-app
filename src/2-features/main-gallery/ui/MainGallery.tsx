import { Gallery } from "@/2-features/gallery/ui/Gallery";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { ASO } from "@/4-shared/config/aso";
import { logEvent } from "@/4-shared/firebase";
import { useResponsiveGalleryDimensions } from "@/4-shared/hooks/use-responsive-gallery-dimensions";
import { GalleryImage, MainGalleryProps } from "@/4-shared/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import { createMainGalleryStyles } from "./MainGallery.styles";
import { MainGalleryItem } from "./MainGalleryItem";
import { createMainGalleryItemStyles } from "./MainGalleryItem.styles";

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
  const { galleryItemHeight, imageHeight } = useResponsiveGalleryDimensions();

  const mainGalleryStyles = createMainGalleryStyles(
    galleryItemHeight,
    imageHeight
  );

  const mainGalleryItemStyles = createMainGalleryItemStyles(
    galleryItemHeight,
    imageHeight
  );

  // 1. Shuffle images when images changes, stable between renders:
  const shuffledImages = useMemo(() => {
    const arr = [...images];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [images]);

  useEffect(() => {
    logEvent("main_gallery_screen_view", {
      screen: "Home",
      galleryTitle: ASO.home.title,
      imagesCount: shuffledImages.length,
    });
  }, [shuffledImages.length]);

  const handlePressZoom = useCallback(
    (index: number) => {
      setZoomIndex(index);
      setZoomVisible(true);
      if (shuffledImages[index]) {
        logEvent("main_gallery_image_zoom", {
          imageId: shuffledImages[index].id,
          index,
          screen: "Home",
        });
      }
    },
    [shuffledImages]
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
      <ThemedView style={mainGalleryStyles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={mainGalleryStyles.centered}>
        <ThemedText style={mainGalleryStyles.error}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!shuffledImages.length) {
    return (
      <ThemedView style={mainGalleryStyles.centered}>
        <ThemedText>No images found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Gallery
        galleryTitle={ASO.home.title}
        scrollY={scrollY}
        images={shuffledImages} // Use shuffled!
        itemHeight={galleryItemHeight}
        renderItem={(item, index) => (
          <MemoizedMainGalleryItem
            item={item}
            itemHeight={galleryItemHeight}
            imageHeight={imageHeight}
            styles={mainGalleryItemStyles}
            onOpenMenu={() => handleOpenMenu(item)}
            onPressComments={
              onPressComments ? () => handleOpenComments(item.id) : undefined
            }
            onPressZoom={() => handlePressZoom(index)}
          />
        )}
      />
      <ZoomGalleryModal
        images={shuffledImages} // Use shuffled!
        visible={zoomVisible}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </>
  );
};

const MemoizedMainGalleryItem = React.memo(MainGalleryItem);
