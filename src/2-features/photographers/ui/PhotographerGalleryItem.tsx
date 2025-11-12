import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { createPhotographerGalleryItemStyles } from "./PhotographerGalleryItem.styles";

export type PhotographerGalleryItemProps = {
  item: any;
  itemHeight: number;
  imageHeight: number;
  yearHeight: number;
  descriptionHeight: number;
  footerHeight: number;
  styles?: ReturnType<typeof createPhotographerGalleryItemStyles>;
  onOpenMenu: () => void;
  onPressComments: () => void;
  onPressZoom: () => void;
};

export const PhotographerGalleryItem: React.FC<
  PhotographerGalleryItemProps
> = ({
  item,
  itemHeight,
  imageHeight,
  yearHeight,
  descriptionHeight,
  footerHeight,
  styles,
  onOpenMenu,
  onPressComments,
  onPressZoom,
}) => {
  const s =
    styles ||
    createPhotographerGalleryItemStyles(
      itemHeight,
      imageHeight,
      yearHeight,
      descriptionHeight,
      footerHeight
    );

  return (
    <ThemedView style={s.galleryImageWrapper}>
      <ImageHeaderRow onOpenMenu={onOpenMenu} />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressZoom}
        style={{
          width: "100%",
          height: imageHeight,
        }}
      >
        <Image
          source={{ uri: item.url }}
          style={s.galleryImage}
          resizeMode="cover"
        />
        {item.year ? (
          <ThemedText style={s.imageYear}>{item.year}</ThemedText>
        ) : (
          <View style={{ height: yearHeight }} />
        )}
        {item.description ? (
          <ThemedText style={s.imageDescription}>{item.description}</ThemedText>
        ) : (
          <View style={{ height: descriptionHeight }} />
        )}
        <View style={s.footerRowContainer}>
          <ImageFooterRow
            imageId={String(item.id)}
            onPressComments={onPressComments}
          />
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
};

export const MemoizedPhotographerGalleryItem = React.memo(
  PhotographerGalleryItem
);
