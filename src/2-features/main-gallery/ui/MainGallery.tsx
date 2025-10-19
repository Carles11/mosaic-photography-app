import { Gallery } from "@/2-features/gallery";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedTitle } from "@/4-shared/components/themed-title";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { fetchMainGalleryImages } from "../api/fetchMainGalleryImages";
import { ImageHeaderRow } from "./ImageHeaderRow";
import { styles } from "./MainGallery.styles";

export const MainGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // BottomSheet logic
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { theme } = useTheme();

  const snapPoints = ["40%"];

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

  // Show/hide bottom sheet modal in response to state
  useEffect(() => {
    if (bottomSheetOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [bottomSheetOpen]);

  const handleBottomSheetClose = useCallback(() => {
    setBottomSheetOpen(false);
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
      <ImageHeaderRow onOpenMenu={() => setBottomSheetOpen(!bottomSheetOpen)} />
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

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={handleBottomSheetClose}
        handleIndicatorStyle={{ backgroundColor: theme.text }}
        backgroundStyle={{ backgroundColor: theme.background }}
      >
        <BottomSheetView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text> AÖSKOFASODIFHASDLIÖFIJASDÖLIF</Text>
          <ThemedTitle style={{ marginBottom: 12 }}>Menu</ThemedTitle>
          <ThemedText>
            This is the bottom sheet menu. Add your content here.
          </ThemedText>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
