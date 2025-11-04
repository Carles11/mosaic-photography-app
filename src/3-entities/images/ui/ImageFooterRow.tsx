import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useComments } from "@/4-shared/context/comments";
import { useFavorites } from "@/4-shared/context/favorites";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { FavoriteButton } from "./FavoriteButton";
import { styles } from "./ImageFooterRow.styles";

type ImageFooterRowProps = {
  imageId: string;
  onPressComments?: () => void;
};

export const ImageFooterRow: React.FC<ImageFooterRowProps> = ({
  imageId,
  onPressComments,
}) => {
  const { theme } = useTheme();
  const { getCommentCount } = useComments();
  const commentsCount = getCommentCount(imageId);
  const router = useRouter();

  const { loading, toggleFavorite, isFavorite, isUserLoggedIn } =
    useFavorites();

  const handleFavoritePress = (imageId: string | number) => {
    if (!isUserLoggedIn()) {
      router.push("/auth/login");
      return;
    }
    toggleFavorite(imageId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconGroup}>
        <FavoriteButton
          imageId={imageId}
          size={18}
          color={theme.favoriteIcon ?? theme.text}
          accessibilityLabel="Toggle favorite"
          onPressFavoriteIcon={() => handleFavoritePress(imageId)}
          isFavorite={isFavorite}
          loading={loading}
        />
      </View>
      <View style={styles.iconGroup}>
        <IconSymbol
          type="material"
          name="chat-bubble-outline"
          size={18}
          color={theme.commentIcon ?? theme.text}
          accessibilityLabel="Comments"
          style={styles.icon}
          onPress={onPressComments}
        />
        <ThemedText style={styles.text}>{commentsCount}</ThemedText>
      </View>
    </View>
  );
};
