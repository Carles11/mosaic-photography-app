import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useFavorites } from "@/4-shared/context/favorites";
import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

type FavoriteButtonProps = {
  imageId: string | number;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  imageId,
  size = 28,
  color = "#e53935",
  accessibilityLabel = "Toggle favorite",
}) => {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const handlePress = () => {
    if (!loading) {
      toggleFavorite(imageId);
    }
  };

  const filled = isFavorite(imageId);

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      style={{ padding: 4 }}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size={size - 10} color={color} />
      ) : (
        <IconSymbol
          type="material"
          name={filled ? "favorite" : "favorite-border"}
          size={size}
          color={color}
        />
      )}
    </TouchableOpacity>
  );
};
