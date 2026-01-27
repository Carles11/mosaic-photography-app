import { Gallery } from "@/2-features/gallery/ui/Gallery";
import { BottomSheetThreeDotsMenu } from "@/2-features/main-gallery/ui/BottomSheetThreeDotsMenu";
import { fetchPhotographerBySlug } from "@/2-features/photographers/api/fetchPhotographersBySlug";
import { getTimelineBySlug } from "@/2-features/photographers/model/photographersTimelines";
import { MemoizedPhotographerGalleryItem } from "@/2-features/photographers/ui/PhotographerGalleryItem";
import { createPhotographerGalleryItemStyles } from "@/2-features/photographers/ui/PhotographerGalleryItem.styles";
import PhotographerLinks from "@/2-features/photographers/ui/PhotographerLinks";
import { PhotographerPortraitHeader } from "@/2-features/photographers/ui/PhotographerPortraitHeader";
import { PhotographerTimeline } from "@/2-features/photographers/ui/Timeline";
import { WebGalleryMessage } from "@/2-features/photographers/ui/WebGalleryMessage";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { RevealOnScroll } from "@/4-shared/components/reveal-on-scroll/ui/RevealOnScroll";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { ASO } from "@/4-shared/config/aso";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useComments } from "@/4-shared/context/comments";
import { useFavorites } from "@/4-shared/context/favorites";
import { logEvent } from "@/4-shared/firebase";
import { useResponsivePhotographerHeader } from "@/4-shared/hooks/use-responsive-photographer-header";
import {
  DownloadOption,
  getAvailableDownloadOptionsForImage,
} from "@/4-shared/lib/getAvailableDownloadOptionsForImage";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { PhotographerSlug } from "@/4-shared/types";
import { downloadImageToDevice } from "@/4-shared/utility/downloadImage";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import * as Sentry from "@sentry/react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./PhotographerDetailScreen.styles";

import BottomSheetComments from "@/2-features/main-gallery/ui/BottomSheetComments";
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { useFilters } from "@/4-shared/context/filters/FiltersContext";

// ADDED: Report bottom sheet so report actions can open the reporting UI.
import {
  ReportBottomSheet,
  ReportBottomSheetRef,
} from "@/2-features/reporting/ui/ReportBottomSheet";

const PhotographerDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const {
    galleryItemHeight,
    galleryImageHeight,
    galleryYearHeight,
    galleryDescriptionHeight,
    galleryFooterHeight,
    headerHeight,
  } = useResponsivePhotographerHeader();

  const photographerGalleryItemStyles = createPhotographerGalleryItemStyles(
    galleryItemHeight,
    galleryImageHeight,
    galleryYearHeight,
    galleryDescriptionHeight,
    galleryFooterHeight,
  );

  const { user, loading: authLoading } = useAuthSession();
  const { isFavorite, toggleFavorite, isUserLoggedIn } = useFavorites();
  const {
    comments,
    loading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
    loadCommentsForImage,
    loadCommentCountsBatch,
  } = useComments();

  const { slug } = useLocalSearchParams();

  const [photographer, setPhotographer] = useState<PhotographerSlug | null>(
    null,
  );
  // Track any error that should be shown in the loading screen
  const [screenError, setScreenError] = useState<string | null>(null);

  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const imageMenuSheetRef = useRef<any>(null);

  const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([]);

  const [commentsImageId, setCommentsImageId] = useState<string | null>(null);
  const commentsSheetRef = useRef<any>(null);

  // Use specific typed ref for the report sheet
  const reportSheetRef = useRef<ReportBottomSheetRef | null>(null);

  const [commentText, setCommentText] = useState("");
  const [editMode, setEditMode] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const scrollY = useSharedValue(0);

  // Use shared filters (context)
  const { filters, setFilters, clearFilters, filtersActive } = useFilters();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);

  // For collecting debug logs to print on screen
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  function addDebugLog(msg: string) {
    setDebugLogs((prev) => [...prev, msg]);
    console.debug(msg);
  }

  useEffect(() => {
    navigation.setOptions({
      title: "Photographer Details",
      headerRight: () => {
        return (
          <ThemedView>
            <IconSymbol
              type="ion"
              name="filter"
              size={28}
              color={theme.icon ?? theme.text}
              style={styles.icon}
              accessibilityLabel="Open filter menu"
              onPress={() => setFilterMenuOpen(true)}
            />
            {filtersActive ? (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 10,
                  height: 10,
                  borderRadius: 6,
                  backgroundColor: "#FF3B30",
                  borderWidth: 1,
                  borderColor: theme.background,
                }}
              />
            ) : null}
          </ThemedView>
        );
      },
    });
  }, [navigation, filtersActive]);

  useEffect(() => {
    if (photographer) {
      navigation.setOptions({
        title: ASO.photographer.title({
          name: photographer.name,
          surname: photographer.surname,
          origin: photographer.origin,
        }),
        subtitle: ASO.photographer.description({
          name: photographer.name,
          surname: photographer.surname,
          origin: photographer.origin,
          galleryCount: photographer.images?.length ?? 0,
        }),
      });
    }
  }, [photographer, navigation]);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      setLoading(true);
      setNotFound(false);
      setScreenError(null);
      setDebugLogs([]);
      const slugStr = Array.isArray(slug) ? slug[0] : slug;
      addDebugLog(`[fetchData] Start for slug: ${slugStr}`);
      if (!slugStr) {
        setNotFound(true);
        setLoading(false);
        setScreenError("No slug provided");
        addDebugLog(`[fetchData] No slug provided`);
        return;
      }

      // Use nudity from shared filters (context).
      const nudityParam: "nude" | "not-nude" | "all" = (filters as any)?.nudity;

      // Add a timeout to catch hanging fetches
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout fetching photographer")),
          10000,
        ),
      );
      try {
        addDebugLog(
          `[fetchData] Fetching photographer with slug: ${slugStr}, nudity: ${nudityParam}`,
        );

        // breadcrumb: fetch start
        Sentry.addBreadcrumb({
          message: "fetchPhotographerBySlug:start",
          level: "info",
          data: { slug: slugStr, nudity: nudityParam },
        });

        const result = await Promise.race([
          fetchPhotographerBySlug(slugStr, nudityParam),
          timeoutPromise,
        ]);
        if (active) {
          if (!result) {
            setNotFound(true);
            setLoading(false);
            setScreenError("No photographer found for slug: " + slugStr);
            addDebugLog(
              `[fetchData] No photographer found for slug: ${slugStr}`,
            );

            Sentry.addBreadcrumb({
              message: "fetchPhotographerBySlug:no-result",
              level: "warning",
              data: { slug: slugStr, nudity: nudityParam },
            });
          } else if (
            result &&
            typeof result === "object" &&
            "id" in result &&
            "slug" in result
          ) {
            setPhotographer(result as PhotographerSlug);
            setLoading(false);
            setScreenError(null);
            addDebugLog(
              `[fetchData] Photographer loaded: ${JSON.stringify(result)}`,
            );

            Sentry.addBreadcrumb({
              message: "fetchPhotographerBySlug:success",
              level: "info",
              data: {
                slug: slugStr,
                nudity: nudityParam,
                photographerId: (result as PhotographerSlug).id,
                imageCount: (result as PhotographerSlug).images?.length,
              },
            });
          } else {
            setNotFound(true);
            setLoading(false);
            setScreenError("No photographer found for slug: " + slugStr);
            addDebugLog(
              `[fetchData] Invalid photographer object returned for slug: ${slugStr}`,
            );

            Sentry.addBreadcrumb({
              message: "fetchPhotographerBySlug:invalid-result",
              level: "warning",
              data: {
                slug: slugStr,
                nudity: nudityParam,
                result,
              },
            });
          }
        }
      } catch (err) {
        setScreenError(
          "Error loading photographer: " +
            (err instanceof Error ? err.message : String(err)),
        );
        setLoading(false);
        setNotFound(true);
        addDebugLog(
          `[fetchData] Error: ${err instanceof Error ? err.message : String(err)}`,
        );

        // Capture the real exception
        Sentry.captureException(err);

        // Also add a breadcrumb for context
        Sentry.addBreadcrumb({
          message: "fetchPhotographerBySlug:error",
          level: "error",
          data: {
            slug: Array.isArray(slug) ? slug[0] : slug,
            error: String(err),
          },
        });
      }
    }
    fetchData();
    return () => {
      active = false;
    };
    // Re-run when slug or shared nudity filter changes
  }, [slug, (filters as any)?.nudity]);

  const timelineEvents = photographer
    ? getTimelineBySlug(photographer.slug) || []
    : [];

  const galleryImages = photographer?.images || [];

  // Diagnostic: warn if any returned image lacks a DB-provided photographerSlug.
  // Keep as debug + breadcrumb (no noisy Sentry event).
  if (galleryImages.length > 0) {
    const missing = galleryImages.filter(
      (img) => !(img as any).photographerSlug,
    );
    if (missing.length > 0) {
      console.debug(
        `[PhotographerDetailScreen] ${missing.length} images missing photographerSlug for photographer=${photographer?.slug}`,
      );
      Sentry.addBreadcrumb({
        message: "images:missing-photographerSlug",
        level: "warning",
        data: {
          photographer: photographer?.slug,
          missingCount: missing.length,
        },
      });
    }
  }

  useEffect(() => {
    if (galleryImages.length > 0) {
      const imageIds = galleryImages.map((img) => String(img.id));
      loadCommentCountsBatch(imageIds);
    }
  }, [galleryImages, loadCommentCountsBatch]);

  useEffect(() => {
    if (commentsImageId) {
      commentsSheetRef.current?.present();
    } else {
      commentsSheetRef.current?.dismiss();
      setCommentText("");
      setEditMode(null);
    }
  }, [commentsImageId]);

  useEffect(() => {
    if (commentsImageId) {
      loadCommentsForImage(commentsImageId);
    }
  }, [commentsImageId, loadCommentsForImage]);

  const handleOpenImageMenu = useCallback((image: any) => {
    setSelectedImage(image);
    setDownloadOptions(getAvailableDownloadOptionsForImage(image));
    setTimeout(() => {
      imageMenuSheetRef.current?.present?.();
    }, 0);
    logEvent("image_view", {
      imageId: image.id,
      imageTitle: image.title,
      photographer: image.author,
    });
  }, []);

  const handleCloseImageMenu = () => {
    imageMenuSheetRef.current?.dismiss?.();
    setSelectedImage(null);
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
      origin: "photographer_detail_screen",
    });
  };

  const handleShareImage = async () => {
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

  const handleAddToFavorites = async () => {
    if (!selectedImage) return;
    if (!isUserLoggedIn()) {
      showErrorToast("Please log in to use this feature.");
      return;
    }
    await toggleFavorite(selectedImage.id);
    logEvent("favorite_toggle", {
      imageId: selectedImage.id,
      favorited: !isFavorite(selectedImage.id),
    });
  };

  const handleOpenComments = useCallback((imageId: string) => {
    setCommentsImageId(imageId);
  }, []);

  const handleCloseComments = useCallback(() => {
    setCommentsImageId(null);
    setCommentText("");
    setEditMode(null);
  }, []);

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

  // ADDED: report handler equivalent to Home's implementation so the three-dots menu can open the report sheet.
  const handleReportImage = useCallback(() => {
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
  }, [selectedImage, user, router]);

  const imageCount = Array.isArray(photographer?.images)
    ? photographer!.images.length
    : 0;
  const showWebMsg = !!photographer && imageCount < 5;

  const ListHeaderComponent = useCallback(() => {
    if (!photographer) return null;

    return (
      <>
        <RevealOnScroll scrollY={scrollY} height={headerHeight} threshold={32}>
          <PhotographerPortraitHeader photographer={photographer} />
        </RevealOnScroll>
        {showWebMsg && (
          <WebGalleryMessage
            name={photographer.name}
            surname={photographer.surname}
            slug={Array.isArray(slug) ? slug[0] : slug}
          />
        )}
        <ThemedView style={styles.container}>
          <ThemedText style={styles.sectionTitle}>A Life in Focus</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Personal & Historical Milestones in {photographer.name}{" "}
            {photographer.surname}'s life.
          </ThemedText>
          <ThemedView style={styles.timelineContainer}>
            <PhotographerTimeline events={timelineEvents} />
          </ThemedView>
          <ThemedText style={styles.sectionTitle}>
            About the Photographer
          </ThemedText>
          <ThemedText style={styles.sectionLabel}>Born in:</ThemedText>
          <ThemedText style={styles.sectionContent}>
            {photographer.origin}
          </ThemedText>
          <ThemedText style={styles.sectionLabel}>Biography:</ThemedText>
          <ThemedText style={styles.biography}>
            {photographer.biography}
          </ThemedText>
          <PhotographerLinks
            stores={photographer.store}
            website={photographer.website}
          />
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              if (!photographer) return;
              const msg = ASO.photographer.shareTemplate({
                name: photographer.name,
                surname: photographer.surname,
                galleryCount: photographer.images?.length ?? 0,
                url: `https://www.mosaic.photography/photographers/${photographer.slug}`,
              });
              Share.share({ message: msg });
            }}
          >
            <ThemedText style={styles.shareButtonText}>
              Share Photographer
            </ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.sectionTitle}>
            {photographer.surname}'s Gallery{" "}
            <ThemedText style={styles.galleryCount}>
              ({photographer.images?.length || 0})
            </ThemedText>
          </ThemedText>
        </ThemedView>
      </>
    );
  }, [photographer, timelineEvents, scrollY, showWebMsg, slug, headerHeight]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        {/* Debug: show slug being used for fetch */}
        <ThemedText style={{ marginTop: 16, color: "#888", fontSize: 12 }}>
          Loading photographer: {Array.isArray(slug) ? slug[0] : slug}
        </ThemedText>
      </ThemedView>
    );
  }

  if (notFound || !photographer) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.notFoundText}>
          Photographer not found.
        </ThemedText>
      </ThemedView>
    );
  }

  const imageComments = commentsImageId ? comments[commentsImageId] || [] : [];
  const isCommentsLoading = commentsImageId
    ? commentsLoading[commentsImageId]
    : false;

  const galleryKey = `${galleryItemHeight}_${galleryImageHeight}_${galleryYearHeight}_${galleryDescriptionHeight}_${galleryFooterHeight}`;

  return (
    <SafeAreaView
      style={[{ flex: 1 }, styles.page, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <Gallery
        key={galleryKey}
        galleryTitle={undefined}
        images={galleryImages}
        scrollY={scrollY}
        itemHeight={galleryItemHeight}
        extraData={{
          galleryItemHeight,
          galleryImageHeight,
          galleryYearHeight,
          galleryDescriptionHeight,
          galleryFooterHeight,
        }}
        renderItem={(item, index) => (
          <MemoizedPhotographerGalleryItem
            item={item}
            itemHeight={galleryItemHeight}
            imageHeight={galleryImageHeight}
            yearHeight={galleryYearHeight}
            descriptionHeight={galleryDescriptionHeight}
            footerHeight={galleryFooterHeight}
            styles={photographerGalleryItemStyles}
            onOpenMenu={() => handleOpenImageMenu(item)}
            onPressComments={() => handleOpenComments(String(item.id))}
            onPressZoom={() => {
              setZoomIndex(index);
              setZoomVisible(true);
            }}
          />
        )}
        ListHeaderComponent={ListHeaderComponent}
      />
      <BottomSheetThreeDotsMenu
        ref={imageMenuSheetRef}
        onClose={handleCloseImageMenu}
        selectedImage={selectedImage}
        onAddToFavorites={handleAddToFavorites}
        isFavorite={isFavorite}
        onShare={handleShareImage}
        onReport={handleReportImage} // <-- ensure report action is wired
        downloadOptions={downloadOptions}
        onDownloadOption={handleDownloadOption}
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
      <BottomSheetFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resetFilters={() => {
          clearFilters();
        }}
        photographerNames={[]}
        showAuthorFilter={false}
      />
      <ZoomGalleryModal
        visible={zoomVisible}
        images={galleryImages}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />

      {/* ADDED: Report bottom sheet so the report flow works from this screen */}
      <ReportBottomSheet ref={reportSheetRef} />
    </SafeAreaView>
  );
};

export default PhotographerDetailScreen;
