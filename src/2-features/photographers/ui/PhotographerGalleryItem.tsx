import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { PhotographerGalleryItemProps } from "@/4-shared/types";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { createPhotographerGalleryItemStyles } from "./PhotographerGalleryItem.styles";

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
      footerHeight,
    );

  const hasImage = !!item.url && item.url.length > 0;

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
        {hasImage ? (
          <Image
            source={{ uri: item.url }}
            style={s.galleryImage}
            resizeMode="cover"
          />
        ) : (
          <ThemedView
            style={[
              s.galleryImage,
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
        {item.year ? (
          <ThemedText style={s.imageYear}>{item.year}</ThemedText>
        ) : (
          <View style={{ height: yearHeight }} />
        )}
        {item.description ? (
          <ThemedText numberOfLines={1} style={s.imageDescription}>
            {item.description}
          </ThemedText>
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
  PhotographerGalleryItem,
);
