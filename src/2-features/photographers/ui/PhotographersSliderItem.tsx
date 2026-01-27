import { ThemedText } from "@/4-shared/components/themed-text";
import { PhotographerListItem } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { Image as ExpoImage } from "expo-image";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./PhotographersSliderItem.styles";

interface PhotographerSliderItemProps {
  item: PhotographerListItem;
  onPhotographerPress?: (item: PhotographerListItem) => void;
  onNavigateToPhotographer: (slug: string) => void;
}

export const PhotographersSliderItem: React.FC<PhotographerSliderItemProps> = ({
  item,
  onPhotographerPress,
  onNavigateToPhotographer,
}) => {
  // mount timestamp to measure overall time since mount
  const mountTsRef = useRef<number | null>(null);
  // per-component reference to record onLoadStart time (accurate download+decode window)
  const imageLoadStartRef = useRef<number | null>(null);

  useEffect(() => {
    mountTsRef.current = Date.now();
  }, [item?.id]);

  const hasPortrait = !!item.portrait && item.portrait.length > 0;

  const handlePress = async () => {
    // Defensive: ensure slug exists before navigating
    const slug = item?.slug;
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      console.warn(
        `[PhotographersSliderItem] Missing slug for photographer id=${item?.id} name=${item?.name} ${item?.surname}`,
      );
      showErrorToast("Photographer page unavailable.");
      return;
    }

    try {
      // Allow the parent navigation handler to run (may be synchronous or async).
      // Use Promise.resolve to support both sync and async handlers.
      await Promise.resolve(onNavigateToPhotographer(slug));
    } catch (err) {
      console.warn(
        `[PhotographersSliderItem] Navigation to photographer failed slug=${slug}`,
        err,
      );
    }

    // Call onPhotographerPress after navigation so parent telemetry/side-effects
    // happen once navigation attempt finished.
    if (onPhotographerPress) {
      try {
        onPhotographerPress(item);
      } catch (err) {
        console.warn(
          "[PhotographersSliderItem] onPhotographerPress handler error",
          err,
        );
      }
    }
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ alignItems: "center" }}
        activeOpacity={0.7}
        onPress={handlePress}
        accessibilityLabel={`Discover vintage photography by ${item.name} ${item.surname}`}
      >
        <View style={styles.portraitWrapper}>
          {hasPortrait ? (
            <ExpoImage
              source={item.portrait}
              style={styles.portrait}
              contentFit="cover"
              priority="high"
              onLoadStart={() => {
                imageLoadStartRef.current = Date.now();
              }}
              onLoad={() => {
                const now = Date.now();
                const start =
                  imageLoadStartRef.current ?? mountTsRef.current ?? now;
                const tookStartToLoad = now - start;
                const tookSinceMount = now - (mountTsRef.current ?? now);
                // kept for future telemetry (no debug logs here)
                void tookStartToLoad;
                void tookSinceMount;
              }}
              onError={(e) =>
                console.warn(
                  `[PhotographersSliderItem] image:error id=${
                    item?.id ?? "unknown"
                  } uri=${item.portrait}`,
                  e,
                )
              }
            />
          ) : (
            <View style={styles.placeholderPortrait}>
              <ThemedText style={styles.placeholderInitial}>
                {item.name[0]}
              </ThemedText>
            </View>
          )}
        </View>
        <ThemedText
          type="defaultSemiBold"
          style={styles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
          allowFontScaling={false}
        >
          {item.surname}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};
