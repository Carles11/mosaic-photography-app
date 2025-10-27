import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryProps } from "@/4-shared/types";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { styles } from "./Gallery.styles";

/**
 * Gallery component renders a FlatList of images using a renderItem function.
 * The renderItem prop allows the parent (feature) to fully control each card's layout.
 */
export const Gallery: React.FC<GalleryProps> = ({
  galleryTitle,
  images,
  renderItem,
  scrollY,
}) => {
  const { theme } = useTheme();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <ThemedView>
      {galleryTitle && (
        <ThemedText type="subtitle" style={styles.title}>
          {galleryTitle}
        </ThemedText>
      )}
      <Animated.FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.container}
        renderItem={({ item, index }) => (
          <ThemedView
            style={[styles.item, { backgroundColor: theme.background }]}
          >
            {renderItem(item, index)}
          </ThemedView>
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </ThemedView>
  );
};
