import { Gallery } from '@/2-features/gallery';
import { MainGalleryProps } from '@/4-shared/types/gallery';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './MainGallery.styles';



export const MainGallery: React.FC<MainGalleryProps> = ({ images, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loading}>Loading gallery...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Gallery images={images} />
    </View>
  );
};