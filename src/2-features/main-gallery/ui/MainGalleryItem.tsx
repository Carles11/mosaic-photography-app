import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { GalleryImage } from "@/4-shared/types";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { createMainGalleryItemStyles } from "./MainGalleryItem.styles";

type MainGalleryItemProps = {
  item: GalleryImage;
  itemHeight: number;
  imageHeight: number;
  styles?: ReturnType<typeof createMainGalleryItemStyles>;
  onOpenMenu?: () => void;
  onPressComments?: () => void;
  onPressZoom?: () => void;
};

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

  return (
    <View style={s.itemContainer}>
      <ImageHeaderRow onOpenMenu={onOpenMenu} />
      <TouchableOpacity activeOpacity={0.92} onPress={onPressZoom}>
        <Image source={{ uri: item.url }} style={s.image} resizeMode="cover" />
      </TouchableOpacity>
      <ThemedText style={s.title} numberOfLines={2}>
        {item.title}
      </ThemedText>
      <View style={s.footerRowContainer}>
        <ImageFooterRow
          imageId={String(item.id)}
          onPressComments={onPressComments}
        />
      </View>
    </View>
  );
};
