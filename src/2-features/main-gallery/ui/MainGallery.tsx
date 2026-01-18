import { Gallery } from "@/2-features/gallery/ui/Gallery";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { ASO } from "@/4-shared/config/aso";
import { GALLERY_FIRST_BLOCK } from "@/4-shared/constants/gallery";
import { logEvent } from "@/4-shared/firebase";
import { useResponsiveGalleryDimensions } from "@/4-shared/hooks/use-responsive-gallery-dimensions";
import { GalleryImage, MainGalleryProps } from "@/4-shared/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import { createMainGalleryStyles } from "./MainGallery.styles";
import { MainGalleryItem } from "./MainGalleryItem";
import { createMainGalleryItemStyles } from "./MainGalleryItem.styles";

export const MainGallery: React.FC<
  MainGalleryProps & { firstBlockSize?: number }
> = ({
  images,
  loading,
  error,
  onOpenMenu,
  onPressComments,
  scrollY,
  ListHeaderComponent,
  firstBlockSize,
}) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const { galleryItemHeight, imageHeight } = useResponsiveGalleryDimensions();

  const mainGalleryStyles = createMainGalleryStyles(
    galleryItemHeight,
    imageHeight,
  );

  const mainGalleryItemStyles = createMainGalleryItemStyles(
    galleryItemHeight,
    imageHeight,
  );

  // ---------- Seeded shuffle helpers ----------
  // xmur3: string -> 32-bit seed
  const xmur3 = (str: string) => {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      const t = (h ^= h >>> 16) >>> 0;
      return t;
    };
  };

  // mulberry32 PRNG from 32-bit seed
  const mulberry32 = (a: number) => {
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const seededShuffle = <T,>(arr: T[], seedStr: string) => {
    const arrCopy = [...arr];
    const seedFn = xmur3(seedStr);
    const seed = seedFn();
    const rand = mulberry32(seed);
    for (let i = arrCopy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
    }
    return arrCopy;
  };

  // ---------- Seeded shuffle usage ----------
  // Preserve first block (firstBlockSize) and seeded-shuffle remainder.
  // Seed lifetime: per-day (YYYYMMDD).
  const FIRST_BLOCK = firstBlockSize ?? GALLERY_FIRST_BLOCK;

  // Use today's date (YYYYMMDD) as seed basis so ordering changes daily.
  const todaySeed = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const shuffledImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    if (images.length <= FIRST_BLOCK) return images;

    const firstBlock = images.slice(0, FIRST_BLOCK);
    const rest = images.slice(FIRST_BLOCK);

    // Build a seed from today's date + count of images to slightly vary if needed.
    const seed = `${todaySeed}:${images.length}`;

    const shuffledRest = seededShuffle(rest, seed);

    const final = [...firstBlock, ...shuffledRest];

    // Optional logging (enabled): seed and first 10 displayed IDs
    try {
      const first10 = final.slice(0, 10).map((i) => i.id);
    } catch (e) {
      // ignore logging errors in production
    }

    return final;
  }, [images, todaySeed, FIRST_BLOCK]);

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
    [shuffledImages],
  );

  const handleOpenMenu = useCallback(
    (item: GalleryImage) => {
      logEvent("main_gallery_image_menu_open", {
        imageId: item.id,
        screen: "Home",
      });
      onOpenMenu?.(item);
    },
    [onOpenMenu],
  );

  const handleOpenComments = useCallback(
    (imageId: string | number) => {
      logEvent("main_gallery_image_comments_open", {
        imageId,
        screen: "Home",
      });
      onPressComments?.(String(imageId));
    },
    [onPressComments],
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
    <ThemedView style={{ flex: 1, marginBottom: 122 }}>
      <Gallery
        galleryTitle={ASO.home.title}
        scrollY={scrollY}
        images={shuffledImages}
        itemHeight={galleryItemHeight}
        ListHeaderComponent={ListHeaderComponent}
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
        images={shuffledImages}
        visible={zoomVisible}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </ThemedView>
  );
};

const MemoizedMainGalleryItem = React.memo(MainGalleryItem);
