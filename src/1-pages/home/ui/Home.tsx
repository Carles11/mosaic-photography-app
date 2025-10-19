import { HomeHeader } from "@/2-features/home-header";
import { MainGallery } from "@/2-features/main-gallery";
import { fetchMainGalleryImages } from "@/2-features/main-gallery/api/fetchMainGalleryImages";
import { useGalleryFilters } from "@/2-features/main-gallery/filters/useGalleryFilters";
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu ";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [isImageMenuOpen, setImageMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Ref for image menu bottom sheet
  const imageMenuSheetRef = useRef<BottomSheetModal>(null);

  // Filters state lifted to Home
  const { filters, setFilters, resetFilters } = useGalleryFilters();

  // MainGallery image loading logic moved here
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

  // Filtering logic
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (filters.gender && img.gender !== filters.gender) return false;
      if (filters.orientation && img.orientation !== filters.orientation)
        return false;
      if (filters.color && img.color !== filters.color) return false;
      if (filters.print_quality && img.print_quality !== filters.print_quality)
        return false;
      if (
        filters.year &&
        ((filters.year.from &&
          (img.year === undefined || img.year < filters.year.from)) ||
          (filters.year.to &&
            (img.year === undefined || img.year > filters.year.to)))
      )
        return false;
      return true;
    });
  }, [images, filters]);

  // Present/dismiss image menu bottom sheet
  useEffect(() => {
    if (isImageMenuOpen) {
      imageMenuSheetRef.current?.present();
    } else {
      imageMenuSheetRef.current?.dismiss();
    }
  }, [isImageMenuOpen]);

  // Handler for opening the image menu sheet
  const handleOpenImageMenu = (image: GalleryImage) => {
    setSelectedImage(image);
    setImageMenuOpen(!isImageMenuOpen);
  };

  // Handler for closing the image menu sheet
  const handleCloseImageMenu = () => {
    setImageMenuOpen(false);
    setSelectedImage(null);
  };

  return (
    <SafeAreaView
      style={[{ flex: 1 }, styles.page, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <HomeHeader onOpenFilters={() => setFilterMenuOpen(true)} />

      {/* Filters Bottom Sheet */}
      <BottomSheetFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      {/* Image Actions Bottom Sheet */}
      <BottomSheetModal
        ref={imageMenuSheetRef}
        snapPoints={["30%"]}
        onDismiss={handleCloseImageMenu}
        handleIndicatorStyle={{ backgroundColor: theme.text }}
        backgroundStyle={{ backgroundColor: theme.background }}
      >
        <BottomSheetView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {selectedImage && (
            <>
              <ThemedText style={{ marginBottom: 8, fontWeight: "bold" }}>
                {selectedImage.author}, {selectedImage.year}
              </ThemedText>
              <ThemedText style={{ marginBottom: 16 }}>
                Actions for this image:
              </ThemedText>
              {/* Add favorite button and other actions here */}
              <ThemedText style={{ color: theme.text, marginBottom: 8 }}>
                ⭐ Add to Favorites
              </ThemedText>
              {/* You can add more action buttons here */}
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>

      <MainGallery
        images={filteredImages}
        loading={loading}
        error={error}
        onOpenMenu={handleOpenImageMenu}
      />
    </SafeAreaView>
  );
};
