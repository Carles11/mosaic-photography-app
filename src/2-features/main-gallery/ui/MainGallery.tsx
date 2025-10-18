import { Gallery } from "@/2-features/gallery";
import { ThemedText } from "@/4-shared/components/themed-text";
import { GalleryImage } from "@/4-shared/types/gallery";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { fetchMainGalleryImages } from "../api/fetchMainGalleryImages";
import { styles } from "./MainGallery.styles";

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
        setError(e.message || "Error loading images");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.loading}>Loading gallery...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.error}>Error: {error}</ThemedText>
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
      <ThemedText style={styles.title} numberOfLines={2}>
        {item.author}, {item.year}
      </ThemedText>
    </>
  );

  return (
    <View style={styles.container}>
      <Gallery images={images} renderItem={renderMainGalleryItem} />
    </View>
  );
};
