import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { MainGalleryItemProps } from "@/4-shared/types";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { styles } from "./MainGalleryItem.styles";

const PLACEHOLDER_IMAGE = "https://placehold.co/480";

export const MainGalleryItem: React.FC<MainGalleryItemProps> = React.memo(
  ({ item, onOpenMenu, onPressComments, onPressZoom }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Use the thumbnail for mobile
    const { url: thumbnailUrl } = getBestS3FolderForWidth(item, 400);

    return (
      <ThemedView style={styles.itemContainer}>
        <ImageHeaderRow onOpenMenu={onOpenMenu} />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressZoom}
          accessibilityLabel={`View high resolution photo by ${item.author}, taken in ${item.year}`}
        >
          <Image
            source={{
              uri: imageError ? PLACEHOLDER_IMAGE : thumbnailUrl,
            }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={
              item.description
                ? item.description
                : `Vintage photo by ${item.author}, year ${item.year}`
            }
            onLoadStart={() => setImageLoaded(false)}
            onLoadEnd={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            defaultSource={{ uri: PLACEHOLDER_IMAGE }}
          />
          {!imageLoaded && (
            <ThemedView style={styles.imagePlaceholder}>
              <Image
                source={{ uri: PLACEHOLDER_IMAGE }}
                style={styles.image}
                resizeMode="cover"
              />
            </ThemedView>
          )}
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
