import { ThemedText } from "@/4-shared/components/themed-text";
import { getBestS3UrlsForProgressiveZoom } from "@/4-shared/lib/getBestS3UrlsForProgressiveZoom";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { styles } from "./ImageZoom.styles";

type ZoomImageProps = {
  image: {
    width?: number;
    filename: string;
    base_url: string;
    author?: string;
    year?: string | number;
    description?: string;
  };
  minScale?: number;
  maxScale?: number;
  doubleTapScale?: number;
  loading?: boolean;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: any;
};

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
    deviceWidth
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
    []
  );

  const handleZoomLoad = () => {
    setZoomLoaded(true);
  };

  // Animated style for overlay fade
  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: overlaysVisible && zoomLoaded ? 1 : 0,
    }),
    [overlaysVisible, zoomLoaded]
  );

  // Handler: single tap toggles overlays
  const handleSingleTap = () => {
    setOverlaysVisible((prev) => !prev);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Preview image (always shown until zoom image is loaded) */}
      {!zoomLoaded && (
        <RNImage
          source={{ uri: previewUrl }}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
          blurRadius={1}
        />
      )}
      {/* Zoom image (progressively loaded) */}
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
              fontSize: 16,
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
              fontSize: 15,
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
            backgroundColor: "rgba(30,30,30,0.70)",
            borderRadius: 16,
            paddingVertical: 4,
            paddingHorizontal: 10,
            zIndex: 10,
          },
          overlayStyle,
        ]}
        pointerEvents="none"
      >
        <Animated.Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: 1,
          }}
        >
          {displayScale.toFixed(2)}x
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
    </View>
  );
};
