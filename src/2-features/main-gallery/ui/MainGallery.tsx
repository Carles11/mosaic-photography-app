import { Gallery } from '@/2-features/gallery';
import { GalleryImage } from '@/4-shared/types/gallery';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { fetchMainGalleryImages } from '../api/fetchMainGalleryImages';
import { styles } from './MainGallery.styles';

export const MainGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchMainGalleryImages();
        setImages(data);
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Error loading images');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  // Custom card layout for MainGallery (author, year below image)
  const renderMainGalleryItem = (item: GalleryImage) => (
    <>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.author}, {item.year}
      </Text>
    </>
  );

  return (
    <View style={styles.container}>
      <Gallery images={images} renderItem={renderMainGalleryItem} />
    </View>
  );
};