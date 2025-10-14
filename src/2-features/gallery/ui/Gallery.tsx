import { GalleryProps } from '@/4-shared/types';
import { FlatList, Image, Text, View } from 'react-native';
import { styles } from './Gallery.styles';


export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image
            source={{ uri: item.url }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      )}
    />
  );
};