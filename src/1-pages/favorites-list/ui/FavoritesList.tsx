import { FavoriteButton } from "@/3-entities/images/ui/FavoriteButton";
import { supabase } from "@/4-shared/api/supabaseClient";
import { useFavorites } from "@/4-shared/context/favorites";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./FavoritesList.styles";

export default function FavoritesList() {
  const {
    favorites,
    loading: favoritesLoading,
    isUserLoggedIn,
  } = useFavorites();
  const { theme } = useTheme();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const fetchFavoriteImages = async () => {
      if (!isUserLoggedIn() || favorites.size === 0) {
        setImages([]);
        return;
      }
      setLoadingImages(true);
      const imageIds = Array.from(favorites);
      const { data, error } = await supabase
        .from("images_resize")
        .select(
          "id, base_url, filename, author, title, description, orientation, created_at, width, height, year"
        )
        .in("id", imageIds);

      if (error) {
        setImages([]);
      } else {
        setImages(
          (data ?? []).map((img) => ({
            ...img,
            url: img.base_url ? `${img.base_url}/${img.filename}` : "",
          }))
        );
      }
      setLoadingImages(false);
    };
    fetchFavoriteImages();
  }, [favorites, isUserLoggedIn]);

  if (!isUserLoggedIn()) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Please log in to view your favorites.
        </Text>
      </View>
    );
  }

  if (favoritesLoading || loadingImages) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.favoriteIcon} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading favorites...
        </Text>
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyIcon, { color: theme.favoriteIcon }]}>♡</Text>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No favorites yet
        </Text>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Start exploring the gallery and heart the images you love!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Your Favorites ({images.length})
        </Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Images you've saved to your favorites list.
        </Text>
      </View>
      <FlatList
        data={images}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.imageCard}>
            <TouchableOpacity style={styles.imageInfo}>
              <Text style={[styles.imageAuthor, { color: theme.text }]}>
                {item.author}
              </Text>
              <Text style={[styles.imageTitle, { color: theme.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.imageDescription, { color: theme.text }]}>
                {item.description}
              </Text>
              <Text style={[styles.imageYear, { color: theme.text }]}>
                {item.year}
              </Text>
            </TouchableOpacity>
            <FavoriteButton
              imageId={item.id}
              size={24}
              color={theme.favoriteIcon}
            />
          </View>
        )}
      />
    </View>
  );
}
