import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { GALLERY_ITEM_HEIGHT } from "@/4-shared/constants";
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
  itemHeight?: number;
};

export const Gallery: React.FC<GalleryProps> = ({
  galleryTitle,
  images,
  renderItem,
  scrollY,
  ListHeaderComponent,
  itemHeight,
}) => {
  const listRef = useRef<Animated.FlatList<GalleryImage>>(null);
  const computedItemHeight = itemHeight || GALLERY_ITEM_HEIGHT;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    "worklet";
    scrollY.value = event.contentOffset.y;
  });

  const getItemLayout = (
    _data: ArrayLike<GalleryImage> | null | undefined,
    index: number
  ) => ({
    length: computedItemHeight,
    offset: computedItemHeight * index,
    index,
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
        initialNumToRender={6}
        windowSize={10}
        contentContainerStyle={styles.container}
        renderItem={({ item, index }) => (
          <ThemedView style={styles.item}>{renderItem(item, index)}</ThemedView>
        )}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        ListHeaderComponent={ListHeaderComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={32}
        showsVerticalScrollIndicator={false}
        extraData={images}
      />
    </ThemedView>
  );
};
