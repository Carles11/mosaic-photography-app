import { FavoriteButton } from "@/3-entities/images/ui/FavoriteButton";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useComments } from "@/4-shared/context/comments";
import { useFavorites } from "@/4-shared/context/favorites";
import { getCanonicalSlug } from "@/4-shared/lib/authorSlug";
import { getBestS3UrlsForProgressiveZoom } from "@/4-shared/lib/getBestS3UrlsForProgressiveZoom";
import { ZoomImageProps } from "@/4-shared/types/gallery";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { Ionicons } from "@expo/vector-icons";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
  onPressAuthor,
  onPressComments,
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

  const { isFavorite, toggleFavorite, isUserLoggedIn, loading: favLoading } =
    useFavorites();
  const { getCommentCount } = useComments();

  const handleFavoritePress = () => {
    if (!isUserLoggedIn()) {
      showErrorToast("Please log in to add favorites.");
      return;
    }
    if (image.id != null) toggleFavorite(image.id);
  };

  const handleCommentPress = () => {
    if (image.id != null) onPressComments?.(image.id);
  };

  const hasPreview = !!previewUrl && previewUrl.length > 0;
  const hasZoom = !!zoomUrl && zoomUrl.length > 0;

  const router = useRouter();

  // Local stable values
  const author = image?.author ? String(image.author).trim() : "";
  const dbSlug = (image as any)?.photographerSlug as string | undefined;
  const canonical = author ? getCanonicalSlug(author) : undefined;
  const navSlug = dbSlug ?? canonical;

  // Dedupe missing-slug warnings per author during this session
  const warnedAuthorsRef = useRef<Set<string>>(new Set());

  const handlePressAuthor = useCallback(() => {
    if (!author) return;

    if (!navSlug) {
      // Warn only once per author to avoid log spam
      if (!warnedAuthorsRef.current.has(author)) {
        warnedAuthorsRef.current.add(author);
      }
      showErrorToast("Photographer page unavailable.");
      return;
    }

    // Give parent a chance to handle navigation (close modal first on iOS)
    if (onPressAuthor) {
      try {
        onPressAuthor(navSlug);
        return;
      } catch (e) {
        console.warn("onPressAuthor handler threw:", e);
      }
    }

    router.push(`/photographers/${navSlug}`);
  }, [author, navSlug, dbSlug, router, onPressAuthor]);

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
        {(author || image?.year) &&
          (navSlug ? (
            <TouchableOpacity
              onPress={handlePressAuthor}
              activeOpacity={0.75}
              accessibilityRole="link"
              accessibilityLabel={`Open photographer ${author}`}
            >
              <ThemedText style={styles.topLegendText}>
                {author && author}
                {image.year ? `, ${image.year}` : ""}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <View pointerEvents="none">
              <ThemedText
                style={styles.topLegendText}
                accessibilityLabel={`${author ? author : "Unknown author"} (photographer page unavailable)`}
              >
                {author && author}
                {image.year ? `, ${image.year}` : ""}
              </ThemedText>
            </View>
          ))}
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

      {/* Bottom-right action bar: favorites + comments */}
      {image.id != null && (
        <Animated.View style={[styles.actionBar, overlayStyle]} pointerEvents="box-none">
          <View style={styles.actionBarPill}>
            <FavoriteButton
              imageId={image.id}
              size={18}
              accessibilityLabel="Toggle favorite"
              onPressFavoriteIcon={handleFavoritePress}
              isFavorite={isFavorite}
              loading={favLoading}
            />
          </View>
          <TouchableOpacity
            style={styles.actionBarPill}
            onPress={handleCommentPress}
            accessibilityLabel="Comments"
          >
            <Ionicons name="chatbubble-outline" size={18} color="#f0f0f0" />
            <ThemedText style={styles.actionBarText}>
              {getCommentCount(String(image.id))}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      )}
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
