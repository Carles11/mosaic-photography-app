import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ActivityIndicator, TouchableOpacity } from "react-native";

type FavoriteButtonProps = {
  imageId: string | number;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
  onPressFavoriteIcon: () => void;
  isFavorite: (imageId: string | number) => boolean;
  loading: boolean;
};

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  imageId,
  size = 28,
  color = "#e53935",
  accessibilityLabel = "Toggle favorite",
  onPressFavoriteIcon,
  isFavorite,
  loading,
}) => {
  const filled = isFavorite(imageId);

  return (
    <TouchableOpacity
      onPress={onPressFavoriteIcon}
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
