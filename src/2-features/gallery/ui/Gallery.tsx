import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types";
import React from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { styles } from "./Gallery.styles";

export type GalleryProps = {
  galleryTitle?: string;
  images: GalleryImage[];
  renderItem: (item: GalleryImage, index: number) => React.ReactNode;
  scrollY: any;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
};

export const Gallery: React.FC<GalleryProps> = ({
  galleryTitle,
  images,
  renderItem,
  scrollY,
  ListHeaderComponent,
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
        ListHeaderComponent={ListHeaderComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </ThemedView>
  );
};
