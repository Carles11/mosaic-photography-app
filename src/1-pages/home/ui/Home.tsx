import { HomeHeader } from "@/2-features/home";
import { MainGallery } from "@/2-features/main-gallery";
import { fetchMainGalleryImages } from "@/2-features/main-gallery/api/fetchMainGalleryImages";
import { useGalleryFilters } from "@/2-features/main-gallery/filters/useGalleryFilters";
import { BottomSheetComments } from "@/2-features/main-gallery/ui/BottomSheetComments";
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu";
import { BottomSheetThreeDotsMenu } from "@/2-features/main-gallery/ui/BottomSheetThreeDotsMenu";
import { PhotographersSlider } from "@/2-features/photographers/ui/PhotographersSlider";
import {
  ReportBottomSheet,
  ReportBottomSheetRef,
} from "@/2-features/reporting/ui/ReportBottomSheet";
import { RevealOnScroll } from "@/4-shared/components/reveal-on-scroll/ui/RevealOnScroll";
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
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Linking, Share } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

// const SCROLL_THRESHOLDS = [0.25, 0.5, 0.75, 1];

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

  const { filters, setFilters, resetFilters } = useGalleryFilters();

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
      title: ASO.home.title,
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchMainGalleryImages();
        setImages(data);
        setError(null);
      } catch (e: any) {
        const msg = e.message || "Error loading images";
        setError(msg);
        showErrorToast(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  useEffect(() => {
    if (filteredImages.length > 0) {
      const imageIds = filteredImages.map((img) =>
        typeof img.id === "string" ? img.id : String(img.id)
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

  // TODO: Analytics: track scroll thresholds CRASHES THE APP ON SCROLL - FIX

  // const lastScrollLogged = useRef<number>(0);

  // const handleScroll = useCallback(
  //   (y: number, listHeight: number = 1) => {
  //     if (!filteredImages.length || !listHeight) return;
  //     const scrollPositionRatio = y / listHeight;
  //     for (let i = SCROLL_THRESHOLDS.length - 1; i >= 0; i--) {
  //       const threshold = SCROLL_THRESHOLDS[i];
  //       if (
  //         scrollPositionRatio >= threshold &&
  //         lastScrollLogged.current < threshold
  //       ) {
  //         lastScrollLogged.current = threshold;
  //         logEvent("scroll_threshold_reached", {
  //           screen: "Home",
  //           threshold: threshold * 100,
  //         });
  //         break;
  //       }
  //     }
  //   },
  //   [filteredImages.length]
  // );

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

  // --- Download main button ---
  const handleDownload = async () => {
    if (!selectedImage) return;
    if (!user) {
      setImageMenuOpen(false); // close sheet in app state
      imageMenuSheetRef.current?.dismiss?.(); // direct ref close if available
      showErrorToast("Please log in to download images.");
      router.push("/auth/login");
      return;
    }
    const options = getAvailableDownloadOptionsForImage(selectedImage);
    let defaultOption =
      options.find((opt) => opt.folder === "originalsWEBP") ||
      options
        .filter((opt) => !opt.isOriginal)
        .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] ||
      options.find((opt) => opt.isOriginal);

    if (defaultOption) {
      try {
        await Linking.openURL(defaultOption.url);
        logEvent("image_download", {
          imageId: selectedImage.id,
          option: defaultOption.folder,
        });
      } catch (error) {
        showErrorToast("Failed to open image URL for download.");
      }
    }
  };

  // --- Download option buttons ---
  const handleDownloadOption = async (option: DownloadOption) => {
    if (!selectedImage) return;
    if (!user) {
      setImageMenuOpen(false); // close menu
      imageMenuSheetRef.current?.dismiss?.();
      showErrorToast("Please log in to download images.");
      router.push("/auth/login");
      return;
    }
    try {
      await Linking.openURL(option.url);
      logEvent("image_download", {
        imageId: selectedImage.id,
        option: option.folder,
      });
    } catch (error) {
      console.log("Error downloading image:", error);
    }
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

  // Analytics: track Filter Menu opened
  const handleOpenFiltersMenu = () => {
    setFilterMenuOpen(true);
    logEvent("filters_menu_opened", {
      screen: "Home",
      context: "header",
    });
  };

  // Gallery scroll height (estimated, for scroll tracking)
  const GALLERY_ITEM_HEIGHT = 380; // approximate

  return (
    <SafeAreaView
      style={[{ flex: 1 }, styles.page, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <HomeHeader onOpenFilters={handleOpenFiltersMenu} />

      <RevealOnScroll scrollY={scrollY} height={160} threshold={32}>
        <PhotographersSlider
          onPhotographerPress={(photographer) => {
            logEvent("photographer_click", {
              id: photographer.id,
              slug: photographer.slug,
              name: photographer.name,
              surname: photographer.surname,
            });
          }}
        />
      </RevealOnScroll>

      <MainGallery
        images={filteredImages}
        loading={loading}
        error={error}
        onOpenMenu={handleOpenImageMenu}
        onPressComments={handleOpenComments}
        scrollY={scrollY}
        // onGalleryScroll={(y) =>
        //   handleScroll(y, filteredImages.length * GALLERY_ITEM_HEIGHT)
        // }
      />
      <BottomSheetFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        filters={filters}
        setFilters={handleApplyFilter}
        resetFilters={() => {
          resetFilters();
          logEvent("filters_reset", {});
        }}
      />
      <BottomSheetThreeDotsMenu
        ref={imageMenuSheetRef}
        isOpen={isImageMenuOpen}
        onClose={handleCloseImageMenu}
        selectedImage={selectedImage}
        onAddToFavorites={handleAddToFavorites}
        isFavorite={isFavorite}
        onShare={handleShare}
        onDownload={handleDownload}
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
