import { HomeHeader } from "@/2-features/home-header";
import { MainGallery } from "@/2-features/main-gallery";
import { fetchMainGalleryImages } from "@/2-features/main-gallery/api/fetchMainGalleryImages";
import { useGalleryFilters } from "@/2-features/main-gallery/filters/useGalleryFilters";
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu ";
import { PhotographersSlider } from "@/2-features/photographers/ui/PhotographersSlider";
import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { HrLine } from "@/4-shared/components/ui/horizontal-line-hr";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useComments } from "@/4-shared/context/comments";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuthSession();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [isImageMenuOpen, setImageMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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

      {/* Filters Bottom Sheet */}
      <BottomSheetFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      {/* Image Actions Bottom Sheet */}
      <ReusableBottomSheetModal
        ref={imageMenuSheetRef}
        snapPoints={["40%"]}
        onDismiss={handleCloseImageMenu}
        enablePanDownToClose
      >
        <BottomSheetView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <SafeAreaView
            edges={["bottom"]}
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
          </SafeAreaView>
        </BottomSheetView>
      </ReusableBottomSheetModal>

      {/* Comments Bottom Sheet */}
      <ReusableBottomSheetModal
        ref={commentsSheetRef}
        snapPoints={["80%"]}
        onDismiss={handleCloseComments}
        enablePanDownToClose
      >
        <BottomSheetView style={{ flex: 1 }}>
          <SafeAreaView edges={["bottom"]} style={{ flex: 1, padding: 16 }}>
            <ThemedText
              type="subtitle"
              style={{ marginBottom: 8, color: theme.text }}
            >
              Comments
            </ThemedText>
            {isCommentsLoading ? (
              <ActivityIndicator size="small" style={{ marginTop: 16 }} />
            ) : (
              <FlatList
                data={imageComments}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <ThemedText style={{ marginTop: 16 }}>
                    No comments yet.
                  </ThemedText>
                }
                renderItem={({ item }) => (
                  <ThemedView
                    style={{
                      paddingVertical: 8,
                      borderBottomColor: "#eee",
                      borderBottomWidth: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: theme.background,
                    }}
                  >
                    <ThemedView
                      style={{
                        flex: 1,
                        width: "100%",
                        backgroundColor: theme.background,
                      }}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: theme.text }}
                      >
                        {item.user_id === user?.id
                          ? "You"
                          : item.user_id || "Anonymous"}
                      </ThemedText>
                      <ThemedText style={{ color: theme.text }}>
                        {item.content}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 10, color: theme.text }}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : ""}
                      </ThemedText>
                    </ThemedView>
                    {user && user.id === item.user_id && (
                      <ThemedView
                        style={{
                          flexDirection: "row",
                          backgroundColor: theme.background,
                        }}
                      >
                        <PrimaryButton
                          title="Edit"
                          onPress={() => handleEdit(item.id, item.content)}
                          style={{
                            marginRight: 8,
                            paddingVertical: 2,
                            paddingHorizontal: 8,
                          }}
                        />
                        <SecondaryButton
                          title="Delete"
                          onPress={() => handleDelete(item.id)}
                          style={{
                            paddingVertical: 2,
                            paddingHorizontal: 8,
                          }}
                        />
                      </ThemedView>
                    )}
                  </ThemedView>
                )}
              />
            )}
            {user ? (
              <ThemedView
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  backgroundColor: theme.background,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    padding: 8,
                    borderRadius: 4,
                    marginRight: 8,
                    backgroundColor: "#fff",
                  }}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <PrimaryButton
                  title={editMode ? "Update" : "Send"}
                  onPress={handleSaveComment}
                  disabled={authLoading || !commentText.trim()}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 16,
                  }}
                />
              </ThemedView>
            ) : (
              <ThemedText style={{ marginTop: 16, color: "#999" }}>
                Log in to write and manage your comments.
              </ThemedText>
            )}
            <PrimaryButton
              title="Close"
              onPress={handleCloseComments}
              style={{ marginTop: 24 }}
            />
          </SafeAreaView>
        </BottomSheetView>
      </ReusableBottomSheetModal>

      <PhotographersSlider />
      <MainGallery
        images={filteredImages}
        loading={loading}
        error={error}
        onOpenMenu={handleOpenImageMenu}
        onPressComments={handleOpenComments}
      />
    </SafeAreaView>
  );
};
