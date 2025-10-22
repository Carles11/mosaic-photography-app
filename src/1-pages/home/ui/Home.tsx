import { HomeHeader } from "@/2-features/home-header";
import { MainGallery } from "@/2-features/main-gallery";
import { fetchMainGalleryImages } from "@/2-features/main-gallery/api/fetchMainGalleryImages";
import { useGalleryFilters } from "@/2-features/main-gallery/filters/useGalleryFilters";
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu ";
import { PhotographersSlider } from "@/2-features/photographers/ui/PhotographersSlider";
import { CommentsModal } from "@/4-shared/components/modals/comments/ui/CommentsModal";
import { ThemedText } from "@/4-shared/components/themed-text";
import { HrLine } from "@/4-shared/components/ui/horizontal-line-hr";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useComments } from "@/4-shared/context/comments"; // <-- Add this import!
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [isImageMenuOpen, setImageMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Comments modal state
  const [commentsImageId, setCommentsImageId] = useState<string | null>(null);

  // Ref for image menu bottom sheet
  const imageMenuSheetRef = useRef<BottomSheetModal>(null);

  // Filters state lifted to Home
  // Filtering options are set in BottomSheetFilterMenu
  const { filters, setFilters, resetFilters } = useGalleryFilters();

  // MainGallery image loading logic moved here
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtain batch loader for comment counts
  const { loadCommentCountsBatch } = useComments();

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

  // Batch load comment counts for all visible images
  useEffect(() => {
    if (filteredImages.length > 0) {
      const imageIds = filteredImages.map((img) =>
        typeof img.id === "string" ? img.id : String(img.id)
      );
      loadCommentCountsBatch(imageIds);
    }
  }, [filteredImages, loadCommentCountsBatch]);

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

  // Handler for opening comments modal
  const handleOpenComments = useCallback((imageId: string) => {
    setCommentsImageId(imageId);
  }, []);

  // Handler for closing comments modal
  const handleCloseComments = useCallback(() => {
    setCommentsImageId(null);
  }, []);

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
        snapPoints={["40%"]}
        onDismiss={handleCloseImageMenu}
        handleIndicatorStyle={{ backgroundColor: theme.text }}
        backgroundStyle={{ backgroundColor: theme.background }}
      >
        <BottomSheetView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {selectedImage && (
            <>
              <ThemedText
                style={{
                  marginBottom: 8,
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                {selectedImage.author}, {selectedImage.year}
              </ThemedText>
              <ThemedText style={{ marginBottom: 8, color: theme.text }}>
                {selectedImage.description}
              </ThemedText>
              {/* Horizontal Line */}
              <HrLine />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginVertical: 8,
                  width: "33%",
                }}
              >
                <IconSymbol
                  type="material"
                  name="favorite-border"
                  size={17}
                  color={theme.favoriteIcon}
                  accessibilityLabel="Favorites"
                />
                <ThemedText style={{ color: theme.text }}>
                  Add to Favorites
                </ThemedText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 8,
                  width: "33%",
                }}
              >
                <IconSymbol
                  type="material"
                  name="share"
                  size={17}
                  color={theme.shareIcon}
                  accessibilityLabel="Share"
                />
                <ThemedText style={{ color: theme.text }}>
                  Share this image
                </ThemedText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 18,
                  width: "33%",
                }}
              >
                <IconSymbol
                  type="material"
                  name="download"
                  color={theme.icon}
                  size={17}
                  accessibilityLabel="Download"
                />
                <ThemedText style={{ color: theme.text }}>
                  Download image
                </ThemedText>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>

      <PhotographersSlider />
      <MainGallery
        images={filteredImages}
        loading={loading}
        error={error}
        onOpenMenu={handleOpenImageMenu}
        onPressComments={handleOpenComments}
      />

      <CommentsModal
        visible={!!commentsImageId}
        imageId={commentsImageId ?? ""}
        onClose={handleCloseComments}
      />
    </SafeAreaView>
  );
};
