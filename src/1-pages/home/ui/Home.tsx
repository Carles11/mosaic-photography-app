import { HomeHeader } from "@/2-features/home";
import { HomeHeaderWithSlider } from "@/2-features/home/ui/HomeHeaderWithSlider";
import { MainGallery } from "@/2-features/main-gallery";
import { fetchMainGalleryImages } from "@/2-features/main-gallery/api/fetchMainGalleryImages";
import { BottomSheetComments } from "@/2-features/main-gallery/ui/BottomSheetComments";
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu";
import { BottomSheetThreeDotsMenu } from "@/2-features/main-gallery/ui/BottomSheetThreeDotsMenu";
import {
  ReportBottomSheet,
  ReportBottomSheetRef,
} from "@/2-features/reporting/ui/ReportBottomSheet";
import { ASO } from "@/4-shared/config/aso";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useComments } from "@/4-shared/context/comments";
import { useFavorites } from "@/4-shared/context/favorites";
import { logEvent } from "@/4-shared/firebase";
import {
  DownloadOption,
  getAvailableDownloadOptionsForImage,
} from "@/4-shared/lib/getAvailableDownloadOptionsForImage";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { PhotographerSlug } from "@/4-shared/types/photographers";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";

import { downloadImageToDevice } from "@/4-shared/utility/downloadImage";
import { useNavigation, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, Share } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

// Use the Filters context
import { useFilters } from "@/4-shared/context/filters/FiltersContext";

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuthSession();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [isImageMenuOpen, setImageMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([]);
  const { isUserLoggedIn, toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const navigation = useNavigation();
  const scrollY = useSharedValue(0);

  const {
    comments,
    loading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
    loadCommentsForImage,
    loadCommentCountsBatch,
  } = useComments();

  const [commentsImageId, setCommentsImageId] = useState<string | null>(null);
  const commentsSheetRef = useRef<any>(null);
  const imageMenuSheetRef = useRef<any>(null);
  const reportSheetRef = useRef<ReportBottomSheetRef>(null);

  // Get filters from context
  const { filters, setFilters, clearFilters, filtersActive } = useFilters();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");
  const [editMode, setEditMode] = useState<{
    id: string;
    content: string;
  } | null>(null);

  // --- ASO / Analytics: Set navigation title to optimal ASO string ---
  useEffect(() => {
    navigation.setOptions?.({
      title: Platform.OS === "android" ? ASO.home.title : "Home",
      subtitle: ASO.home.description,
    });
  }, [navigation]);

  // --- Analytics: home screen_view event ---
  useEffect(() => {
    logEvent("screen_view", {
      screen: "Home",
      section: "main_gallery",
    });
    const sessionStart = Date.now();
    return () => {
      const duration = (Date.now() - sessionStart) / 1000;
      logEvent("home_session", {
        duration,
      });
    };
  }, []);

  // Fetch images from server using nudity from shared filters.
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // filters.nudity expected values: "nude" | "not-nude" | "all"
        const nudityParam: "nude" | "not-nude" | "all" =
          (filters as any).nudity ?? "not-nude";

        const data = await fetchMainGalleryImages(nudityParam);
        if (!active) return;
        setImages(data);
        setError(null);
      } catch (e: any) {
        const msg = e?.message || "Error loading images";
        if (active) {
          setError(msg);
          showErrorToast(msg);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [(filters as any).nudity]);

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

      // --- text filter ---
      if (filters.text && filters.text.trim() !== "") {
        const query = filters.text.trim().toLowerCase();
        const title = (img.title ?? "").toLowerCase();
        const description = (img.description ?? "").toLowerCase();
        if (!title.includes(query) && !description.includes(query)) {
          return false;
        }
      }

      // --- Photographer (author) filter ---
      if (Array.isArray(filters.author) && filters.author.length > 0) {
        const imgAuthorNormalized = (img.author ?? "").trim().toLowerCase();
        const isAuthorSelected = filters.author.some(
          (authorName: string) =>
            imgAuthorNormalized === authorName.trim().toLowerCase(),
        );
        if (!isAuthorSelected) return false;
      }
      return true;
    });
  }, [images, filters]);

  useEffect(() => {
    if (filteredImages.length > 0) {
      const imageIds = filteredImages.map((img) =>
        typeof img.id === "string" ? img.id : String(img.id),
      );
      loadCommentCountsBatch(imageIds);
    }
  }, [filteredImages, loadCommentCountsBatch]);

  useEffect(() => {
    if (isImageMenuOpen) {
      imageMenuSheetRef.current?.present();
    } else {
      imageMenuSheetRef.current?.dismiss();
    }
  }, [isImageMenuOpen]);

  useEffect(() => {
    if (commentsImageId) {
      commentsSheetRef.current?.present();
    } else {
      commentsSheetRef.current?.dismiss();
      setCommentText("");
      setEditMode(null);
    }
  }, [commentsImageId]);

  const photographerNames = useMemo(() => {
    // Get all unique, non-empty author names
    const namesSet = new Set<string>();
    images.forEach((img) => {
      if (img.author && img.author.trim() !== "") {
        namesSet.add(img.author.trim());
      }
    });
    return Array.from(namesSet).sort(); // optional: sort alphabetically
  }, [images]);

  // TODO: Analytics: track Filter Menu opened
  const handleOpenFiltersMenu = () => {
    setFilterMenuOpen(true);
    logEvent("filters_menu_opened", {
      screen: "Home",
      context: "header",
    });
  };

  const handleOpenImageMenu = (image: GalleryImage) => {
    setSelectedImage(image);
    setDownloadOptions(getAvailableDownloadOptionsForImage(image));
    setImageMenuOpen(!isImageMenuOpen);
    logEvent("image_view", {
      imageId: image.id,
      imageTitle: image.title,
      photographer: image.author,
    });
  };

  const handleCloseImageMenu = () => {
    setImageMenuOpen(false);
    setSelectedImage(null);
  };

  const handleOpenComments = useCallback((imageId: string) => {
    setCommentsImageId(imageId);
  }, []);

  const handleCloseComments = useCallback(() => {
    setCommentsImageId(null);
  }, []);

  const handleAddToFavorites = async () => {
    if (!selectedImage) return;
    if (!isUserLoggedIn()) {
      showErrorToast("Please log in to use this feature.");
      router.push("/auth/login");
      return;
    }
    await toggleFavorite(selectedImage.id);
    logEvent("favorite_toggle", {
      imageId: selectedImage.id,
      favorited: !isFavorite(selectedImage.id),
    });
  };

  const handleShare = async () => {
    if (!selectedImage) return;
    const shareMsg = ASO.home.shareTemplate({
      imageTitle: selectedImage.title,
      photographer: selectedImage.author,
      url: selectedImage.url,
      appName: "Mosaic Photography Gallery",
    });
    try {
      await Share.share({
        message: shareMsg,
      });
      logEvent("share", {
        imageId: selectedImage.id,
      });
    } catch (error) {
      showErrorToast("Couldn't share this image.");
    }
  };

  const handleDownloadOption = async (option: DownloadOption) => {
    if (Platform.OS === "ios" && option.format === "webp") {
      showErrorToast(
        "Please choose the print option. WebP images can't be saved to Photos on iOS.",
      );
      return;
    }
    await downloadImageToDevice({
      option,
      selectedImage,
      user,
      logEvent,
      showSuccessToast,
      showErrorToast,
      onRequireLogin: () => {
        handleCloseImageMenu();
        router.push("/auth/login");
      },
      origin: "home_screen",
    });
  };

  useEffect(() => {
    if (commentsImageId) {
      loadCommentsForImage(commentsImageId);
    }
  }, [commentsImageId]);

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

  const handleReportImage = () => {
    if (!selectedImage) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    reportSheetRef.current?.open({
      imageId: selectedImage ? Number(selectedImage.id) : undefined,
    });
    logEvent("report_image", {
      imageId: selectedImage.id,
    });
  };

  interface FilterApplyEventData {
    filters: typeof filters;
  }

  const handleApplyFilter = (nextFilters: typeof filters): void => {
    setFilters(nextFilters);
    logEvent("filter_applied", {
      filters: nextFilters,
    } as FilterApplyEventData);
  };

  return (
    <SafeAreaView
      style={[{ flex: 1 }, styles.page, { backgroundColor: theme.background }]}
      edges={["bottom", "top"]}
    >
      <HomeHeader
        onOpenFilters={handleOpenFiltersMenu}
        filtersActive={filtersActive}
      />

      <MainGallery
        images={filteredImages}
        loading={loading}
        error={error}
        onOpenMenu={handleOpenImageMenu}
        onPressComments={handleOpenComments}
        scrollY={scrollY}
        ListHeaderComponent={
          <HomeHeaderWithSlider
            onPhotographerPress={(photographer: PhotographerSlug) => {
              logEvent("photographer_click", {
                id: photographer.id,
                slug: photographer.slug,
                name: photographer.name,
                surname: photographer.surname,
              });
            }}
          />
        }
      />
      <BottomSheetFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        filters={filters}
        setFilters={handleApplyFilter}
        resetFilters={() => {
          clearFilters();
          logEvent("filters_reset", {});
        }}
        photographerNames={photographerNames}
      />
      <BottomSheetThreeDotsMenu
        ref={imageMenuSheetRef}
        onClose={handleCloseImageMenu}
        selectedImage={selectedImage}
        onAddToFavorites={handleAddToFavorites}
        isFavorite={isFavorite}
        onShare={handleShare}
        downloadOptions={downloadOptions}
        onDownloadOption={handleDownloadOption}
        onReport={handleReportImage}
        user={user}
        router={router}
      />
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
        reportSheetRef={reportSheetRef}
        router={router}
      />
      <ReportBottomSheet ref={reportSheetRef} />
    </SafeAreaView>
  );
};

export default Home;
