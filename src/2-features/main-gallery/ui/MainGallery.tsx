import { ThemedText } from "@/4-shared/components/themed-text";
import { GalleryImage } from "@/4-shared/types/gallery";
import React from "react";
import { FlatList, View } from "react-native";
import { styles } from "./MainGallery.styles";
import { MainGalleryItem } from "./MainGalleryItem";

type MainGalleryProps = {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  onOpenMenu: (image: GalleryImage) => void;
  onPressComments?: (imageId: string) => void;
};

export const MainGallery: React.FC<MainGalleryProps> = ({
  images,
  loading,
  error,
  onOpenMenu,
  onPressComments,
}) => {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.error}>{error}</ThemedText>
      </View>
    );
  }
  if (!images.length) {
    return (
      <View style={styles.centered}>
        <ThemedText>No images found.</ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MainGalleryItem
          item={item}
          onOpenMenu={() => onOpenMenu(item)}
          onPressComments={
            onPressComments ? () => onPressComments(item.id) : undefined
          }
        />
      )}
      contentContainerStyle={styles.galleryList}
    />
  );
};
