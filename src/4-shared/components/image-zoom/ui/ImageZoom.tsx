import { ThemedText } from "@/4-shared/components/themed-text";
import { getBestS3UrlsForProgressiveZoom } from "@/4-shared/lib/getBestS3UrlsForProgressiveZoom";
import { ZoomImageProps } from "@/4-shared/types/gallery";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
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
      {/* Top legend: author and year */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: "11%",
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 12,
            paddingHorizontal: 16,
          },
          overlayStyle,
        ]}
        pointerEvents="none"
      >
        {(image.author || image.year) && (
          <ThemedText
            style={{
              backgroundColor: "rgba(30,30,30,0.85)",
              color: "#fff",
              fontWeight: "600",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 5,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {image.author}
            {image.author && image.year ? ", " : ""}
            {image.year}
          </ThemedText>
        )}
      </Animated.View>
      {/* Bottom legend: description */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "6%",
            // leave room for scale badge
            alignItems: "center",
            zIndex: 12,
            paddingHorizontal: 16,
          },
          overlayStyle,
        ]}
        pointerEvents="none"
      >
        {image.description ? (
          <ThemedText
            style={{
              backgroundColor: "rgba(30,30,30,0.8)",
              color: "#fff",

              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 5,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {image.description}
          </ThemedText>
        ) : null}
      </Animated.View>
      {/* Zoom scale overlay */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: "13%",
            right: 16,

            paddingVertical: 4,
            paddingHorizontal: 10,
            zIndex: 10,
          },
          overlayStyle,
        ]}
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
          style={{ position: "absolute", alignSelf: "center" }}
        />
      )}
      {/* Placeholder if no preview or zoom image at all */}
      {!hasPreview && !hasZoom && (
        <View
          style={[
            styles.image,
            {
              backgroundColor: "#333",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              width: "100%",
              height: "100%",
            },
          ]}
        >
          <ThemedText style={{ color: "#fff", fontSize: 12 }}>
            No image
          </ThemedText>
        </View>
      )}
    </View>
  );
};
