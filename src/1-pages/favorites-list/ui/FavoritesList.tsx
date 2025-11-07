import { fetchFavoriteImages } from "@/2-features/favorites-list/api/fetchFavoritesImages";
import AddToCollectionSheet, {
  AddToCollectionSheetRef,
} from "@/2-features/favorites-list/ui/AddToCollectionSheet";
import { FavoriteButton } from "@/3-entities/images/ui/FavoriteButton";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import SwipeableCard from "@/4-shared/components/swipeable-card/ui/SwipeableCard";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { ASO } from "@/4-shared/config/aso";
import { useFavorites } from "@/4-shared/context/favorites";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
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

  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const addCollectionSheetRef = useRef<AddToCollectionSheetRef>(null);
  const router = useRouter();
  const navigation = useNavigation();

  // Inject ASO screen meta on mount/update
  useEffect(() => {
    navigation.setOptions({
      title: ASO.favorites.title,
      subtitle: ASO.favorites.description,
    });
  }, [navigation]);

  // Analytics: track screen view on mount
  useEffect(() => {
    logEvent("favorites_screen_view", {
      screen: "Favorites",
      favoritesCount: favorites.size,
    });
  }, [favorites.size]);

  useFocusEffect(
    useCallback(() => {
      if (!isUserLoggedIn()) {
        showErrorToast("Please log in to view your favorites.");
        router.replace("/auth/login");
      }
    }, [isUserLoggedIn, router])
  );

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
      showErrorToast("Please log in to favorite images.");
      router.push("/auth/login");
      return;
    }
    toggleFavorite(imageId);
    logEvent("favorite_toggled", {
      imageId,
      favorited: !isFavorite(imageId),
      screen: "Favorites",
    });
  };

  const handleAddToCollectionPress = (imageId: string | number) => {
    addCollectionSheetRef.current?.open(imageId);
    logEvent("add_to_collection_from_favorites", {
      imageId,
      screen: "Favorites",
    });
  };

  const handlePressZoom = (index: number) => {
    setZoomIndex(index);
    setZoomVisible(true);
    if (images[index]) {
      logEvent("favorites_image_zoom", {
        imageId: images[index].id,
        index,
        screen: "Favorites",
      });
    }
  };

  if (!isUserLoggedIn()) {
    return null;
  }

  if (favoritesLoading || loadingImages) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.favoriteIcon} />
        <ThemedText style={[styles.loadingText]}>
          Loading favorites...
        </ThemedText>
      </ThemedView>
    );
  }

  if (images.length === 0) {
    logEvent("favorites_empty_state", {
      screen: "Favorites",
    });
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={[styles.emptyIcon, { color: theme.favoriteIcon }]}>
          ♡
        </ThemedText>
        <ThemedText style={[styles.emptyTitle]}>
          {ASO.favorites.title}
        </ThemedText>
        <ThemedText style={[styles.emptyText]}>
          Start exploring the gallery and heart the images you love!
        </ThemedText>
      </ThemedView>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: GalleryImage;
    index: number;
  }) => (
    <SwipeableCard
      imageUrl={item.thumbnailUrl ?? ""}
      onImagePress={() => handlePressZoom(index)}
      title={item.author}
      subtitle={item.description}
      year={item.year}
      rightActions={[
        {
          icon: (
            <FavoriteButton
              imageId={item.id}
              size={24}
              color={theme.favoriteIcon}
              onPressFavoriteIcon={() => handleFavoritePress(item.id)}
              isFavorite={isFavorite}
              loading={loading}
            />
          ),
          onPress: () => handleFavoritePress(item.id),
          accessibilityLabel: "Toggle Favorite",
          backgroundColor: "#fff",
        },
        {
          icon: (
            <Ionicons
              name="add-circle-outline"
              size={26}
              color={theme.favoriteIcon}
            />
          ),
          onPress: () => handleAddToCollectionPress(item.id),
          accessibilityLabel: "Add to Collection",
          backgroundColor: "#f5f5f5",
        },
      ]}
      containerStyle={{ marginBottom: 12 }}
    />
  );

  return (
    <ThemedView style={[styles.container]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.title]}>
          {ASO.favorites.title} ({images.length})
        </ThemedText>
        <ThemedText style={[styles.subtitle]}>
          {ASO.favorites.description}
        </ThemedText>
      </ThemedView>
      <FlatList
        data={images}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
      />
      <AddToCollectionSheet ref={addCollectionSheetRef} />
      <ZoomGalleryModal
        visible={zoomVisible}
        images={images}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </ThemedView>
  );
}
