import { ThemedText } from "@/4-shared/components/themed-text";
import { PhotographerListItem } from "@/4-shared/types";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { styles } from "./PhotographersSliderItem.styles";

interface PhotographerSliderItemProps {
  item: PhotographerListItem;
  isExpanded: boolean;
  onPhotographerPress?: (item: PhotographerListItem) => void;
  onIntroToggle: (id: string) => void;
  onNavigateToPhotographer: (slug: string) => void;
}

export const PhotographersSliderItem: React.FC<PhotographerSliderItemProps> = ({
  item,
  isExpanded,
  onPhotographerPress,
  onIntroToggle,
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
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.introTouchable}
        onPress={() => onIntroToggle(item.id)}
        accessibilityLabel={
          isExpanded
            ? `Collapse introduction of ${item.name} ${item.surname}`
            : `Expand introduction of ${item.name} ${item.surname}`
        }
      >
        <ThemedText
          type="default"
          style={styles.intro}
          numberOfLines={isExpanded ? undefined : 2}
          ellipsizeMode="tail"
          allowFontScaling={false}
        >
          {item.intro}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};
