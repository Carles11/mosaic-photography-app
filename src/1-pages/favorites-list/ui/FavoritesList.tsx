import { fetchFavoriteImages } from "@/2-features/favorites-list/api/fetchFavoritesImages";
import { FavoriteButton } from "@/3-entities/images/ui/FavoriteButton";
import { AddToCollectionModal } from "@/4-shared/components/modals/collections/ui/AddToCollectionModal";
import { useFavorites } from "@/4-shared/context/favorites";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
    toggleFavorite,
    isFavorite,
    loading,
  } = useFavorites();
  const { theme } = useTheme();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // State for AddToCollectionModal
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<
    string | number | null
  >(null);

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
    setSelectedImageId(imageId);
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
    setSelectedImageId(null);
  };

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
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.imageInfo}>
              <Text style={[styles.imageAuthor, { color: theme.text }]}>
                {item.author}
              </Text>
              <Text style={[styles.imageDescription, { color: theme.text }]}>
                {item.description}
              </Text>
              <Text style={[styles.imageYear, { color: theme.text }]}>
                {item.year}
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            </View>
          </View>
        )}
      />
      <AddToCollectionModal
        imageId={selectedImageId}
        visible={addModalVisible}
        onClose={handleCloseAddModal}
      />
    </View>
  );
}
