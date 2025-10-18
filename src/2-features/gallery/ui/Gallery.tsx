import { ThemedView } from '@/4-shared/components/themed-view';
import { useTheme } from '@/4-shared/theme/ThemeProvider';
import { GalleryProps } from '@/4-shared/types';
import { FlatList } from 'react-native';
import { styles } from './Gallery.styles';


/**
 * Gallery component renders a FlatList of images using a renderItem function.
 * The renderItem prop allows the parent (feature) to fully control each card's layout.
 */
export const Gallery: React.FC<GalleryProps> = ({ images, renderItem }) => {
  const { theme } = useTheme();

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      numColumns={1}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <ThemedView style={[styles.item,{ backgroundColor: theme.background}]}>
          {renderItem(item)}
        </ThemedView>
      )}
    />
  );
};