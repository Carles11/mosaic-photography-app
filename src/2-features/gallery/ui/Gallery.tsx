import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useResponsiveGalleryDimensions } from "@/4-shared/hooks/use-responsive-gallery-dimensions";
import { GalleryImage, GalleryProps } from "@/4-shared/types";
import React, { useRef } from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { styles } from "./Gallery.styles";

export const Gallery: React.FC<GalleryProps> = ({
  galleryTitle,
  images,
  renderItem,
  scrollY,
  ListHeaderComponent,
  itemHeight,
}) => {
  const listRef = useRef<Animated.FlatList<GalleryImage>>(null);

  const { galleryItemHeight, imageHeight } = useResponsiveGalleryDimensions();
  const computedItemHeight = itemHeight || galleryItemHeight;
  const galleryStyles = styles(computedItemHeight);

  // Compose a key to force FlatList full remount/layout on orientation change
  const flatListKey = `${galleryItemHeight}_${imageHeight}`;

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

  const extraData = { images, galleryItemHeight, imageHeight };

  return (
    <ThemedView>
      {galleryTitle && (
        <ThemedText type="subtitle" style={galleryStyles.title}>
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
        contentContainerStyle={galleryStyles.container}
        renderItem={({ item, index }) => (
          <ThemedView
            style={[galleryStyles.item, { height: computedItemHeight }]}
          >
            {renderItem(item, index)}
          </ThemedView>
        )}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        ListHeaderComponent={ListHeaderComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={32}
        showsVerticalScrollIndicator={false}
        extraData={extraData ?? images}
        key={flatListKey}
      />
    </ThemedView>
  );
};
