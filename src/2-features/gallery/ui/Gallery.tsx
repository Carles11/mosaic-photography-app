import { GalleryProps } from '@/4-shared/types';
import { FlatList, View } from 'react-native';
import { styles } from './Gallery.styles';

/**
 * Gallery component renders a FlatList of images using a renderItem function.
 * The renderItem prop allows the parent (feature) to fully control each card's layout.
 */
export const Gallery: React.FC<GalleryProps> = ({ images, renderItem }) => {
  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      numColumns={1}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.item}>
          {renderItem(item)}
        </View>
      )}
    />
  );
};