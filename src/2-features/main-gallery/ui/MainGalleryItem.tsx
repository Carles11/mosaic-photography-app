import { ThemedText } from "@/4-shared/components/themed-text";
import { GalleryImage } from "@/4-shared/types/gallery";
import React from "react";
import { Image } from "react-native";
import { ImageHeaderRow } from "./ImageHeaderRow";
import { styles } from "./MainGallery.styles";

// Memoized gallery item for best performance
type MainGalleryItemProps = {
  item: GalleryImage;
  onOpenMenu: () => void;
};

export const MainGalleryItem: React.FC<MainGalleryItemProps> = React.memo(
  ({ item, onOpenMenu }) => (
    <>
      <ImageHeaderRow onOpenMenu={onOpenMenu} />
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <ThemedText style={styles.title} numberOfLines={2}>
        {item.author}, {item.year}
      </ThemedText>
    </>
  )
);
