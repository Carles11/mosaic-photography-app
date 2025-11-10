import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import {
  PHOTOGRAPHER_DETAILS_GALLERY_DESCRIPTION_HEIGHT,
  PHOTOGRAPHER_DETAILS_GALLERY_IMAGE_HEIGHT,
  PHOTOGRAPHER_DETAILS_GALLERY_YEAR_HEIGHT,
} from "@/4-shared/constants";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { styles } from "./PhotographerGalleryItem.styles";

export type PhotographerGalleryItemProps = {
  item: any;
  onOpenMenu: () => void;
  onPressComments: () => void;
  onPressZoom: () => void;
};

export const PhotographerGalleryItem: React.FC<
  PhotographerGalleryItemProps
> = ({ item, onOpenMenu, onPressComments, onPressZoom }) => (
  <ThemedView style={styles.galleryImageWrapper}>
    <ImageHeaderRow onOpenMenu={onOpenMenu} />
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPressZoom}
      style={{
        width: "100%",
        height: PHOTOGRAPHER_DETAILS_GALLERY_IMAGE_HEIGHT,
      }}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.galleryImage}
        resizeMode="cover"
      />
      {item.year ? (
        <ThemedText style={styles.imageYear}>{item.year}</ThemedText>
      ) : (
        <View style={{ height: PHOTOGRAPHER_DETAILS_GALLERY_YEAR_HEIGHT }} />
      )}
      {item.description ? (
        <ThemedText style={styles.imageDescription}>
          {item.description}
        </ThemedText>
      ) : (
        <View
          style={{ height: PHOTOGRAPHER_DETAILS_GALLERY_DESCRIPTION_HEIGHT }}
        />
      )}
      <View style={styles.footerRowContainer}>
        <ImageFooterRow
          imageId={String(item.id)}
          onPressComments={onPressComments}
        />
      </View>
    </TouchableOpacity>
  </ThemedView>
);

export const MemoizedPhotographerGalleryItem = React.memo(
  PhotographerGalleryItem
);
