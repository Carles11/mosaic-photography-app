import { ThemedText } from "@/4-shared/components/themed-text";
import { PhotographerListItem } from "@/4-shared/types";
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
  // non-hook render logging (temporary for debugging)
  console.count(`[PhotographersSliderItem] render id=${item?.id ?? "unknown"}`);

  // mount timestamp to measure image load time
  const mountTsRef = useRef<number | null>(null);

  useEffect(() => {
    mountTsRef.current = Date.now();
    console.log(`[PhotographersSliderItem] mount id=${item?.id ?? "unknown"}`);
  }, [item?.id]);

  const hasPortrait = !!item.portrait && item.portrait.length > 0;

  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ alignItems: "center" }}
        activeOpacity={0.7}
        onPress={() => {
          onNavigateToPhotographer(item.slug);
          if (onPhotographerPress) onPhotographerPress(item);
        }}
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
                console.log(
                  `[PhotographersSliderItem] image:onLoadStart id=${item.id} uri=${item.portrait}`
                );
              }}
              onLoad={() => {
                const start = mountTsRef.current ?? Date.now();
                const took = Date.now() - start;
                console.log(
                  `[PhotographersSliderItem] image:loaded id=${
                    item?.id ?? "unknown"
                  } time=${took}ms uri=${item.portrait}`
                );
              }}
              onError={(e) =>
                console.warn(
                  `[PhotographersSliderItem] image:error id=${
                    item?.id ?? "unknown"
                  } uri=${item.portrait}`,
                  e
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
