import { ThemedText } from "@/4-shared/components/themed-text";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useComments } from "@/4-shared/context/comments";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
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

  return (
    <View style={styles.container}>
      <View style={styles.iconGroup}>
        <FavoriteButton
          imageId={imageId}
          size={18}
          color={theme.favoriteIcon ?? theme.text}
          accessibilityLabel="Toggle favorite"
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
        <ThemedText style={[{ color: theme.text }, styles.text]}>
          {commentsCount}
        </ThemedText>
      </View>
    </View>
  );
};
