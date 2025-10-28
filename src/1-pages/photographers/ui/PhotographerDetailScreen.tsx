import { Gallery } from "@/2-features/gallery/ui/Gallery";
import { fetchPhotographerBySlug } from "@/2-features/photographers/api/fetchPhotographersBySlug";
import { getTimelineBySlug } from "@/2-features/photographers/model/photographersTimelines";
import PhotographerLinks from "@/2-features/photographers/ui/PhotographerLinks";
import { PhotographerPortraitHeader } from "@/2-features/photographers/ui/PhotographerPortraitHeader";
import { PhotographerTimeline } from "@/2-features/photographers/ui/Timeline";
import { WebGalleryMessage } from "@/2-features/photographers/ui/WebGalleryMessage";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import { RevealOnScroll } from "@/4-shared/components/reveal-on-scroll/ui/RevealOnScroll";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { mapPhotographerImagesToGalleryImages } from "@/4-shared/lib/mapPhotographerImageToGalleryImage";
import { PhotographerSlug } from "@/4-shared/types";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { styles } from "./PhotographerDetailScreen.styles";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const HEADER_HEIGHT = deviceHeight * 0.5;

const PhotographerDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams();
  const [photographer, setPhotographer] = useState<PhotographerSlug | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  // ScrollY for RevealOnScroll and Gallery scroll tracking
  const scrollY = useSharedValue(0);

  useEffect(() => {
    navigation.setOptions({
      title: "Photographer Details",
    });
  }, [navigation]);

  useEffect(() => {
    if (photographer) {
      navigation.setOptions({
        title: `${photographer.surname}'s Details`,
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

  const galleryImages = useMemo(
    () =>
      mapPhotographerImagesToGalleryImages(
        photographer?.images || [],
        photographer?.slug || ""
      ),
    [photographer]
  );

  const handlePressZoom = useCallback((index: number) => {
    setZoomIndex(index);
    setZoomVisible(true);
  }, []);

  // Appealing web version message if few images
  const showWebMsg = photographer && (photographer.images?.length ?? 0) < 5;

  const ListHeaderComponent = useCallback(() => {
    if (!photographer) return null;
    return (
      <>
        <RevealOnScroll scrollY={scrollY} height={HEADER_HEIGHT} threshold={32}>
          <PhotographerPortraitHeader photographer={photographer} />
        </RevealOnScroll>
        {showWebMsg && <WebGalleryMessage photographer={photographer} />}
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

  return (
    <>
      <Gallery
        galleryTitle={undefined}
        images={galleryImages}
        scrollY={scrollY}
        renderItem={(item, index) => (
          <ThemedView style={styles.galleryImageWrapper}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handlePressZoom(index)}
            >
              <Image
                source={{ uri: item.url }}
                style={[
                  styles.galleryImage,
                  { width: deviceWidth, height: deviceWidth * 0.7 },
                ]}
                resizeMode="cover"
              />
              {item.year ? (
                <ThemedText style={styles.imageYear}>{item.year}</ThemedText>
              ) : null}
              {item.description ? (
                <ThemedText style={styles.imageDescription}>
                  {item.description}
                </ThemedText>
              ) : null}
            </TouchableOpacity>
          </ThemedView>
        )}
        ListHeaderComponent={ListHeaderComponent}
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
