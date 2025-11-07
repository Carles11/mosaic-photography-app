import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types";
import React, { useRef } from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { styles } from "./Gallery.styles";

export type GalleryProps = {
  galleryTitle?: string;
  images: GalleryImage[];
  renderItem: (item: GalleryImage, index: number) => React.ReactNode;
  scrollY: any;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  onGalleryScroll?: (y: number) => void;
};

export const Gallery: React.FC<GalleryProps> = ({
  galleryTitle,
  images,
  renderItem,
  scrollY,
  ListHeaderComponent,
  onGalleryScroll,
}) => {
  const { theme } = useTheme();
  const listRef = useRef<Animated.FlatList<GalleryImage>>(null);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (onGalleryScroll) {
        onGalleryScroll(event.contentOffset.y);
      }
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
        ref={listRef}
        data={images}
        keyExtractor={(item) => String(item.id)}
        numColumns={1}
        initialNumToRender={5}
        windowSize={7}
        contentContainerStyle={styles.container}
        renderItem={({ item, index }) => (
          <ThemedView style={styles.item}>{renderItem(item, index)}</ThemedView>
        )}
        ListHeaderComponent={ListHeaderComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={32}
        showsVerticalScrollIndicator={false}
        extraData={images}
      />
    </ThemedView>
  );
};
