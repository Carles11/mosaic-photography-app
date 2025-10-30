import { HomeHeader } from "@/2-features/home";
import { MainGallery } from "@/2-features/main-gallery";
import { fetchMainGalleryImages } from "@/2-features/main-gallery/api/fetchMainGalleryImages";
import { useGalleryFilters } from "@/2-features/main-gallery/filters/useGalleryFilters";
import { BottomSheetComments } from "@/2-features/main-gallery/ui/BottomSheetComments";
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu ";
import { BottomSheetThreeDotsMenu } from "@/2-features/main-gallery/ui/BottomSheetThreeDotsMenu";
import { PhotographersSlider } from "@/2-features/photographers/ui/PhotographersSlider";
import { RevealOnScroll } from "@/4-shared/components/reveal-on-scroll/ui/RevealOnScroll";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useComments } from "@/4-shared/context/comments";
import { useFavorites } from "@/4-shared/context/favorites";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Linking, Share } from "react-native";
import { useSharedValue } from "react-native-reanimated"; // Add this import
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuthSession();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [isImageMenuOpen, setImageMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { isUserLoggedIn, toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  // Handle RevealOnScroll for header
  const scrollY = useSharedValue(0);

  // Comments logic
  const {
    comments,
    loading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
    loadCommentsForImage,
    loadCommentCountsBatch,
  } = useComments();

  // Comments bottom sheet state
  const [commentsImageId, setCommentsImageId] = useState<string | null>(null);
  const commentsSheetRef = useRef<any>(null);

  // Ref for image menu bottom sheet
  const imageMenuSheetRef = useRef<any>(null);

  // Filters state lifted to Home
  // Filtering options are set in BottomSheetFilterMenu
  const { filters, setFilters, resetFilters } = useGalleryFilters();

  // MainGallery image loading logic moved here
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comments UI state
  const [commentText, setCommentText] = useState("");
  const [editMode, setEditMode] = useState<{
    id: string;
    content: string;
  } | null>(null);

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
      loadCommentCountsBatch(imageIds); // ✅
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

  // Present/dismiss comments bottom sheet
  useEffect(() => {
    if (commentsImageId) {
      commentsSheetRef.current?.present();
    } else {
      commentsSheetRef.current?.dismiss();
      setCommentText("");
      setEditMode(null);
    }
  }, [commentsImageId]);

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

  // Handler for opening comments bottom sheet
  const handleOpenComments = useCallback((imageId: string) => {
    setCommentsImageId(imageId);
  }, []);

  // Handler for closing comments bottom sheet
  const handleCloseComments = useCallback(() => {
    setCommentsImageId(null);
  }, []);

  const handleAddToFavorites = async () => {
    if (!selectedImage) return;
    if (!isUserLoggedIn()) {
      router.push("/auth/login");
      return;
    }
    await toggleFavorite(selectedImage.id);
  };

  const handleShare = async () => {
    if (!selectedImage) return;
    try {
      await Share.share({
        message: selectedImage.title
          ? `${selectedImage.title}\n${selectedImage.url}`
          : selectedImage.url,
      });
    } catch (error) {
      console.log("Error sharing image:", error);
    }
  };

  const handleDownload = async () => {
    if (!selectedImage) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    try {
      if (selectedImage.base_url) {
        await Linking.openURL(selectedImage.base_url);
      }
    } catch (error) {
      console.log("Error opening image URL:", error);
    }
  };

  // Load comments for the image when the bottom sheet opens
  useEffect(() => {
    if (commentsImageId) {
      loadCommentsForImage(commentsImageId);
    }
    // We intentionally do not include loadCommentsForImage in deps to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsImageId]);

  // Comments logic
  const imageComments = commentsImageId ? comments[commentsImageId] || [] : [];
  const isCommentsLoading = commentsImageId
    ? commentsLoading[commentsImageId]
    : false;

  const handleSaveComment = () => {
    if (!user || !commentsImageId) return;
    if (editMode) {
      updateComment(commentsImageId, editMode.id, user.id, commentText);
      setEditMode(null);
    } else {
      addComment(commentsImageId, user.id, commentText);
    }
    setCommentText("");
  };

  const handleEdit = (commentId: string, content: string) => {
    setEditMode({ id: commentId, content });
    setCommentText(content);
  };

  const handleDelete = (commentId: string) => {
    if (!user || !commentsImageId) return;
    deleteComment(commentsImageId, commentId, user.id);
  };

  return (
    <SafeAreaView
      style={[{ flex: 1 }, styles.page, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <HomeHeader onOpenFilters={() => setFilterMenuOpen(true)} />

      <RevealOnScroll scrollY={scrollY} height={160} threshold={32}>
        <PhotographersSlider />
      </RevealOnScroll>

      <MainGallery
        images={filteredImages}
        loading={loading}
        error={error}
        onOpenMenu={handleOpenImageMenu}
        onPressComments={handleOpenComments}
        scrollY={scrollY}
      />
      {/* Filters Bottom Sheet */}
      <BottomSheetFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      {/* Image Actions Bottom Sheet */}
      <BottomSheetThreeDotsMenu
        ref={imageMenuSheetRef}
        isOpen={isImageMenuOpen}
        onClose={handleCloseImageMenu}
        selectedImage={selectedImage}
        onAddToFavorites={handleAddToFavorites}
        isFavorite={isFavorite}
        onShare={handleShare}
        onDownload={handleDownload}
      />

      {/* Comments Bottom Sheet */}
      <BottomSheetComments
        ref={commentsSheetRef}
        isOpen={!!commentsImageId}
        onClose={handleCloseComments}
        comments={imageComments}
        isLoading={isCommentsLoading}
        commentText={commentText}
        setCommentText={setCommentText}
        handleSaveComment={handleSaveComment}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        editMode={editMode}
        user={user}
        authLoading={authLoading}
      />
    </SafeAreaView>
  );
};
