import { ThemedText } from "@/4-shared/components/themed-text";
import { slugify } from "@/4-shared/lib/authorSlug";
import { getBestS3UrlsForProgressiveZoom } from "@/4-shared/lib/getBestS3UrlsForProgressiveZoom";
import { ZoomImageProps } from "@/4-shared/types/gallery";
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

  // Overlay visibility state (legends, scale, spinner)
  const [overlaysVisible, setOverlaysVisible] = useState(true);

  // Sync reanimated scale value to react state for smooth UI update
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

  // Animated style for overlay fade
  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: overlaysVisible && zoomLoaded ? 1 : 0,
    }),
    [overlaysVisible, zoomLoaded],
  );

  // Handler: single tap toggles overlays
  const handleSingleTap = () => {
    setOverlaysVisible((prev) => !prev);
  };

  // Defensive: Only show preview if URL exists and is not empty.
  const hasPreview = !!previewUrl && previewUrl.length > 0;
  // Defensive: Only use zoomUrl if not empty
  const hasZoom = !!zoomUrl && zoomUrl.length > 0;

  const router = useRouter();

  const handlePressAuthor = useCallback(() => {
    if (!image?.author) return;
    // Prefer DB-provided slug if present, else fallback to slugify
    const slug = (image as any).photographerSlug || slugify(image.author);
    router.push(`/photographer/${slug}`);
  }, [image, router]);

  return (
    <View style={[styles.container, style]}>
      {/* Preview image (always shown until zoom image is loaded) */}
      {!zoomLoaded && hasPreview && (
        <RNImage
          source={{ uri: previewUrl }}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
          blurRadius={1}
        />
      )}
      {/* Zoom image (progressively loaded) */}
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
      {/* Top legend: author and year
          Use pointerEvents="box-none" so touches reach the TouchableOpacity inside.
          The TouchableOpacity itself is the actionable element for navigation. */}
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
      {/* Bottom legend: description */}
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
      {/* Zoom scale overlay */}
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
      {/* Show spinner while loading high-res zoom image */}
      {(loading || !zoomLoaded) && overlaysVisible && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.activityIndicator}
        />
      )}
      {/* Placeholder if no preview or zoom image at all */}
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
