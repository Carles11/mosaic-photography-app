import { GoToTopButton } from "@/4-shared/components/buttons/go-to-top/ui/GoToTopButton";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useResponsiveGalleryDimensions } from "@/4-shared/hooks/use-responsive-gallery-dimensions";
import { GalleryImage, GalleryProps } from "@/4-shared/types";
import React, { useRef, useState } from "react";
import Animated from "react-native-reanimated";
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
  const [showGoTop, setShowGoTop] = useState(false);

  const { galleryItemHeight, imageHeight } = useResponsiveGalleryDimensions();
  const computedItemHeight = itemHeight || galleryItemHeight;
  const galleryStyles = styles(computedItemHeight);

  const flatListKey = `${galleryItemHeight}_${imageHeight}`;

  const handleOnScroll = (event: any) => {
    if (scrollY) {
      scrollY.value = event.nativeEvent.contentOffset.y;
    }
    if (event.nativeEvent.contentOffset.y > 150) {
      setShowGoTop(true);
    } else {
      setShowGoTop(false);
    }
  };

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
        onScroll={handleOnScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        extraData={extraData ?? images}
        key={flatListKey}
      />
      <GoToTopButton
        visible={showGoTop}
        onPress={() =>
          listRef.current?.scrollToOffset({ offset: 0, animated: true })
        }
      />
    </ThemedView>
  );
};
