import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { styles } from "./MainGalleryItem.styles";

type MainGalleryItemProps = {
  item: GalleryImage;
  onOpenMenu: () => void;
  onPressComments?: () => void;
  onPressZoom?: () => void;
};

export const MainGalleryItem: React.FC<MainGalleryItemProps> = React.memo(
  ({ item, onOpenMenu, onPressComments, onPressZoom }) => {
    const { theme } = useTheme();

    return (
      <ThemedView style={styles.itemContainer}>
        <ImageHeaderRow onOpenMenu={onOpenMenu} />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressZoom}
          accessibilityLabel={`View high resolution photo by ${item.author}, taken in ${item.year}`}
        >
          <Image
            source={{ uri: item.url }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`Vintage photo by ${item.author}, year ${item.year}`}
          />
        </TouchableOpacity>
        <ThemedText style={styles.title} numberOfLines={2}>
          {item.author}, {item.year}
        </ThemedText>
        <ImageFooterRow
          imageId={String(item.id)}
          onPressComments={onPressComments}
        />
      </ThemedView>
    );
  }
);
