import { fetchFavoriteImages } from "@/2-features/favorites-list/api/fetchFavoritesImages";
import AddToCollectionSheet, {
  AddToCollectionSheetRef,
} from "@/2-features/favorites-list/ui/AddToCollectionSheet";
import { FavoriteButton } from "@/3-entities/images/ui/FavoriteButton";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useFavorites } from "@/4-shared/context/favorites";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./FavoritesList.styles";

export default function FavoritesList() {
  const {
    favorites,
    loading: favoritesLoading,
    isUserLoggedIn,
    toggleFavorite,
    isFavorite,
    loading,
  } = useFavorites();
  const { theme } = useTheme();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const addCollectionSheetRef = useRef<AddToCollectionSheetRef>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      const imgs = await fetchFavoriteImages(favorites, isUserLoggedIn());
      setImages(imgs);
      setLoadingImages(false);
    };
    fetchImages();
  }, [favorites, isUserLoggedIn]);

  const handleFavoritePress = (imageId: string | number) => {
    if (!isUserLoggedIn()) {
      router.push("/auth/login");
      return;
    }
    toggleFavorite(imageId);
  };

  const handleAddToCollectionPress = (imageId: string | number) => {
    addCollectionSheetRef.current?.open(imageId);
  };

  if (!isUserLoggedIn()) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ThemedText style={[styles.emptyText]}>
          Please log in to view your favorites.
        </ThemedText>
      </View>
    );
  }

  if (favoritesLoading || loadingImages) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.favoriteIcon} />
        <ThemedText style={[styles.loadingText]}>
          Loading favorites...
        </ThemedText>
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ThemedText style={[styles.emptyIcon, { color: theme.favoriteIcon }]}>
          ♡
        </ThemedText>
        <ThemedText style={[styles.emptyTitle]}>No favorites yet</ThemedText>
        <ThemedText style={[styles.emptyText]}>
          Start exploring the gallery and heart the images you love!
        </ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={[styles.container]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.title]}>
          Your Favorites ({images.length})
        </ThemedText>
        <ThemedText style={[styles.subtitle]}>
          Images you've saved to your favorites list.
        </ThemedText>
      </ThemedView>
      <FlatList
        data={images}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ThemedView style={styles.imageCard}>
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.imageInfo}>
              <ThemedText style={[styles.imageAuthor]}>
                {item.author}
              </ThemedText>
              <ThemedText style={[styles.imageDescription]}>
                {item.description}
              </ThemedText>
              <ThemedText style={[styles.imageYear]}>{item.year}</ThemedText>
            </TouchableOpacity>
            <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
              <FavoriteButton
                imageId={item.id}
                size={24}
                color={theme.favoriteIcon}
                onPressFavoriteIcon={() => handleFavoritePress(item.id)}
                isFavorite={isFavorite}
                loading={loading}
              />
              <TouchableOpacity
                style={{ marginLeft: 12 }}
                onPress={() => handleAddToCollectionPress(item.id)}
                accessibilityLabel="Add to Collection"
              >
                <Ionicons
                  name="add-circle-outline"
                  size={26}
                  color={theme.favoriteIcon}
                />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}
      />
      <AddToCollectionSheet ref={addCollectionSheetRef} />
    </ThemedView>
  );
}
