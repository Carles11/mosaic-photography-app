import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { MainGalleryItemProps } from "@/4-shared/types";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { createMainGalleryItemStyles } from "./MainGalleryItem.styles";

export const MainGalleryItem: React.FC<MainGalleryItemProps> = ({
  item,
  itemHeight,
  imageHeight,
  styles,
  onOpenMenu,
  onPressComments,
  onPressZoom,
}) => {
  // Use provided styles, or create them (for standalone usage/testing)
  const s = styles || createMainGalleryItemStyles(itemHeight, imageHeight);

  const hasImage = !!item.url && item.url.length > 0;

  return (
    <ThemedView style={s.itemContainer}>
      <ImageHeaderRow onOpenMenu={onOpenMenu} />
      <TouchableOpacity activeOpacity={0.92} onPress={onPressZoom}>
        {hasImage ? (
          <Image
            source={{ uri: item.url }}
            style={s.image}
            resizeMode="cover"
          />
        ) : (
          <ThemedView
            style={[
              s.image,
              {
                backgroundColor: "#333",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <ThemedText style={{ color: "#fff", fontSize: 12 }}>
              No image
            </ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>
      <ThemedText style={s.title} numberOfLines={2}>
        {item.title}
      </ThemedText>
      <ThemedView style={s.footerRowContainer}>
        <ImageFooterRow
          imageId={String(item.id)}
          onPressComments={onPressComments}
        />
      </ThemedView>
    </ThemedView>
  );
};
