import { Gallery } from "@/2-features/gallery";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import React, { useCallback } from "react";
import { View } from "react-native";
import { styles } from "./MainGallery.styles";
import { MainGalleryItem } from "./MainGalleryItem";

type MainGalleryProps = {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  onOpenMenu: () => void;
};

export const MainGallery: React.FC<MainGalleryProps> = ({
  images,
  loading,
  error,
  onOpenMenu,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.loading}>Loading gallery...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.error}>Error: {error}</ThemedText>
      </View>
    );
  }

  // Memoized renderItem for FlatList (passed to Gallery)
  const renderItem = useCallback(
    (item: GalleryImage) => (
      <MainGalleryItem item={item} onOpenMenu={onOpenMenu} />
    ),
    [onOpenMenu]
  );

  return (
    <View style={styles.container}>
      <Gallery images={images} renderItem={renderItem} />
    </View>
  );
};
