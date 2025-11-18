import { ThemedText } from "@/4-shared/components/themed-text";
import { PhotographerListItem } from "@/4-shared/types";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
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
            <Image
              source={{ uri: item.portrait }}
              style={styles.portrait}
              resizeMode="cover"
              accessibilityLabel={`${item.name} ${item.surname} portrait`}
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
