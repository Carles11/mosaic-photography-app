import { ThemedText } from "@/4-shared/components/themed-text";
import { getCanonicalSlug } from "@/4-shared/lib/authorSlug";
import { getBestS3UrlsForProgressiveZoom } from "@/4-shared/lib/getBestS3UrlsForProgressiveZoom";
import { ZoomImageProps } from "@/4-shared/types/gallery";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { styles } from "./ImageZoom.styles";
import { ZoomScaleBadge } from "./ZoomScaleBadge";

export const ZoomImage: React.FC<ZoomImageProps> = ({
  image,
  minScale = 1,
  maxScale = 5,
  doubleTapScale = 3,
  loading = false,
  onInteractionStart,
  onInteractionEnd,
  style,
  imageStyle,
}) => {
  const { width: deviceWidth } = useWindowDimensions();

  const { previewUrl, zoomUrl } = getBestS3UrlsForProgressiveZoom(
    image,
    deviceWidth,
  );

  const [zoomLoaded, setZoomLoaded] = useState(false);
  const scale = useSharedValue(1);
  const [displayScale, setDisplayScale] = useState(1);

  const [overlaysVisible, setOverlaysVisible] = useState(true);

  useAnimatedReaction(
    () => scale.value,
    (current, prev) => {
      if (current !== prev) {
        runOnJS(setDisplayScale)(current);
      }
    },
    [],
  );

  const handleZoomLoad = () => {
    setZoomLoaded(true);
  };

  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: overlaysVisible && zoomLoaded ? 1 : 0,
    }),
    [overlaysVisible, zoomLoaded],
  );

  const handleSingleTap = () => {
    setOverlaysVisible((prev) => !prev);
  };

  const hasPreview = !!previewUrl && previewUrl.length > 0;
  const hasZoom = !!zoomUrl && zoomUrl.length > 0;

  const router = useRouter();

  const handlePressAuthor = useCallback(() => {
    if (!image?.author) return;
    // Prefer DB-provided slug; fallback to canonical map via getCanonicalSlug
    let slug = (image as any).photographerSlug;
    let source = "photographerSlug";
    if (!slug) {
      const canonical = getCanonicalSlug(image.author);
      if (canonical) {
        slug = canonical;
        source = "canonicalSlugMap";
      }
    }
    if (!slug) {
      console.warn(
        `[handlePressAuthor] Missing photographerSlug for author: ${image.author}`,
      );
      showErrorToast("Photographer page unavailable.");
      return;
    }
    console.debug(
      `[handlePressAuthor] using slug: ${slug} source: ${source} author: ${image.author}`,
    );
    router.push(`/photographer/${slug}`);
  }, [image, router]);

  return (
    <View style={[styles.container, style]}>
      {!zoomLoaded && hasPreview && (
        <RNImage
          source={{ uri: previewUrl }}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
          blurRadius={1}
        />
      )}
      {hasZoom && (
        <ImageZoom
          uri={zoomUrl}
          minScale={minScale}
          maxScale={maxScale}
          doubleTapScale={doubleTapScale}
          isPanEnabled
          isPinchEnabled
          isDoubleTapEnabled
          isSingleTapEnabled
          onSingleTap={handleSingleTap}
          onInteractionStart={onInteractionStart}
          onInteractionEnd={onInteractionEnd}
          style={[
            styles.image,
            imageStyle,
            {
              position: zoomLoaded ? "relative" : "absolute",
              opacity: zoomLoaded ? 1 : 0,
            },
          ]}
          resizeMode="contain"
          onLoad={handleZoomLoad}
          scale={scale}
        />
      )}
      <Animated.View
        style={[styles.topLegendContainer, overlayStyle]}
        pointerEvents="box-none"
      >
        {(image.author || image.year) && (
          <TouchableOpacity
            onPress={handlePressAuthor}
            activeOpacity={0.75}
            accessibilityRole="link"
            disabled={!image.author}
          >
            <ThemedText style={styles.topLegendText}>
              {image.author && image.author}
              {image.year ? `, ${image.year}` : ""}
            </ThemedText>
          </TouchableOpacity>
        )}
      </Animated.View>
      <Animated.View
        style={[styles.descriptionTextContainer, overlayStyle]}
        pointerEvents="none"
      >
        {image.description ? (
          <ThemedText style={styles.descriptionText}>
            {image.description}
          </ThemedText>
        ) : null}
      </Animated.View>
      <Animated.View
        style={[styles.zoomScaleBadge, overlayStyle]}
        pointerEvents="none"
      >
        <Animated.Text>
          <ZoomScaleBadge
            scale={displayScale}
            minScale={1}
            maxScale={5}
            visible={overlaysVisible && zoomLoaded}
          />
        </Animated.Text>
      </Animated.View>
      {(loading || !zoomLoaded) && overlaysVisible && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.activityIndicator}
        />
      )}
      {!hasPreview && !hasZoom && (
        <View style={[styles.image, styles.noImageContainer]}>
          <ThemedText style={{ color: "#fff", fontSize: 12 }}>
            No image
          </ThemedText>
        </View>
      )}
    </View>
  );
};
