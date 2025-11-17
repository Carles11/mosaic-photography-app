import { Gallery } from "@/2-features/gallery/ui/Gallery";
import { BottomSheetComments } from "@/2-features/main-gallery/ui/BottomSheetComments";
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
import { PhotographerSlug } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Share,
  TouchableOpacity,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { styles } from "./PhotographerDetailScreen.styles";

const PhotographerDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();

  // Responsive dimensions for gallery items
  const {
    galleryItemHeight,
    galleryImageHeight,
    galleryYearHeight,
    galleryDescriptionHeight,
    galleryFooterHeight,
    headerHeight,
  } = useResponsivePhotographerHeader();

  // Responsive styles for each item
  const photographerGalleryItemStyles = createPhotographerGalleryItemStyles(
    galleryItemHeight,
    galleryImageHeight,
    galleryYearHeight,
    galleryDescriptionHeight,
    galleryFooterHeight
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
    null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const imageMenuSheetRef = useRef<any>(null);

  const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([]);

  const [commentsImageId, setCommentsImageId] = useState<string | null>(null);
  const commentsSheetRef = useRef<any>(null);
  const reportSheetRef = useRef<any>(null);

  const [commentText, setCommentText] = useState("");
  const [editMode, setEditMode] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    navigation.setOptions({
      title: "Photographer Details",
    });
  }, [navigation]);

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
      const slugStr = Array.isArray(slug) ? slug[0] : slug;
      if (!slugStr) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const result = await fetchPhotographerBySlug(slugStr);
      if (active) {
        if (!result) {
          setNotFound(true);
        } else {
          setPhotographer(result);
        }
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, [slug]);

  const timelineEvents = photographer
    ? getTimelineBySlug(photographer.slug) || []
    : [];

  const galleryImages = photographer?.images || [];

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
    if (!selectedImage) return;
    if (!user) {
      handleCloseImageMenu();
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
      showErrorToast("Failed to open image URL for download.");
    }
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

  const showWebMsg = photographer && (photographer.images?.length ?? 0) < 5;

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
  }, [photographer, timelineEvents, scrollY, showWebMsg]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
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

  // FlatList key for full remount/layout on rotation for Gallery
  const galleryKey = `${galleryItemHeight}_${galleryImageHeight}_${galleryYearHeight}_${galleryDescriptionHeight}_${galleryFooterHeight}`;
  console.log("hello from PhotographerDetailScreen");
  return (
    <>
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
        authLoading={authLoading}
        editMode={editMode}
        user={user}
        reportSheetRef={reportSheetRef}
        router={router}
      />
      <ZoomGalleryModal
        visible={zoomVisible}
        images={galleryImages}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </>
  );
};

export default PhotographerDetailScreen;
