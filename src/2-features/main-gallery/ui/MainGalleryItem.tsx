import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { GalleryImage } from "@/4-shared/types/gallery";
import React from "react";
import { Image, View } from "react-native";
import { styles } from "./MainGalleryItem.styles";

type MainGalleryItemProps = {
  item: GalleryImage;
  onOpenMenu: () => void;
  onPressComments?: () => void;
};

export const MainGalleryItem: React.FC<MainGalleryItemProps> = React.memo(
  ({ item, onOpenMenu, onPressComments }) => (
    <View style={styles.itemContainer}>
      <ImageHeaderRow onOpenMenu={onOpenMenu} />
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <ThemedText style={styles.title} numberOfLines={2}>
        {item.author}, {item.year}
      </ThemedText>
      <ImageFooterRow
        imageId={item.id}
        likesCount={item.likesCount ?? 0}
        onPressComments={onPressComments}
      />
    </View>
  )
);
