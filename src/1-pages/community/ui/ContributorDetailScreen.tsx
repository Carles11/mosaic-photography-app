import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  useWindowDimensions,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchContributorBySlug } from "@/2-features/community/photography/api/fetchContributorBySlug";
import type { ContributorWithImages } from "@/2-features/community/photography/api/fetchContributorBySlug";
import { getBestUrlForWidth } from "@/4-shared/lib/getAllS3Urls";
import { ZoomGalleryModal } from "@/4-shared/components/image-zoom/ui/ZoomGalleryModal";
import type { GalleryImage } from "@/4-shared/types/gallery";
import ContributorGallery from "@/2-features/community/photography/ui/ContributorGallery";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { styles } from "./ContributorDetailScreen.styles";

export default function ContributorDetailScreen() {
  const { theme } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [contributor, setContributor] =
    useState<ContributorWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryNudityFilter, setGalleryNudityFilter] = useState<
    "all" | "nude" | "not-nude"
  >("all");

  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const isMixed = contributor?.nudity === "mixed";

  const galleryImages = useMemo(() => {
    if (!contributor) return [];
    if (!isMixed || galleryNudityFilter === "all")
      return contributor.images ?? [];
    return (contributor.images ?? []).filter(
      (img) =>
        galleryNudityFilter === "nude" ? img.nudity : !img.nudity,
    );
  }, [contributor, isMixed, galleryNudityFilter]);

  const zoomGalleryImages: GalleryImage[] = useMemo(
    () =>
      galleryImages.map((img) => ({
        id: Number(img.image_id ?? img.id),
        base_url: img.base_url ?? "",
        filename: img.filename ?? "",
        author: img.author ?? "",
        title: img.title ?? "",
        description: img.description ?? "",
        created_at: "",
        orientation: img.orientation ?? "",
        width: img.width ?? 0,
        height: img.height ?? 0,
        url: img.url ?? "",
        print_quality: img.print_quality,
        year: img.year ?? undefined,
        nudity: img.nudity != null ? String(img.nudity) : undefined,
      })),
    [galleryImages],
  );

  useEffect(() => {
    if (!slug) return;

    async function load() {
      setLoading(true);
      setError(null);
      const data = await fetchContributorBySlug(slug);
      if (data) {
        setContributor(data);
      } else {
        setError("Contributor not found.");
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !contributor) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.icon }]}>Contributor not found.</Text>
      </View>
    );
  }

  const heroUrl = contributor.featuredImage?.s3Progressive
    ? getBestUrlForWidth(contributor.featuredImage.s3Progressive, width)
    : contributor.featuredImage?.url ?? null;

  const handleShare = async () => {
    await Share.share({
      message: `${contributor.name} on Mosaic Photography`,
      url: `https://www.mosaic.photography/community/photography/${slug}`,
    });
  };

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {heroUrl && (
        <View style={[styles.heroWrapper, { height: width * 0.65 }]}>
          <Image
            source={{ uri: heroUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
        </View>
      )}

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.push("/community/photography")}
      >
        <Text style={[styles.backLinkText, { color: theme.icon }]}>
          {"\u2190"} Back to Photography Community
        </Text>
      </TouchableOpacity>

      <Text style={[styles.pageTitle, { color: theme.text }]}>{contributor.name}</Text>
      <View style={styles.metaRow}>
        {contributor.country && (
          <View style={[styles.metaPill, { backgroundColor: theme.border }]}>
            <Text style={[styles.metaPillText, { color: theme.icon }]}>{contributor.country}</Text>
          </View>
        )}
        {contributor.license_default && (
          <View style={[styles.metaPill, { backgroundColor: theme.border }]}>
            <Text style={[styles.metaPillText, { color: theme.icon }]}>
              {contributor.license_default}
            </Text>
          </View>
        )}
        <View style={[styles.metaPill, { backgroundColor: theme.border }]}>
          <Text style={[styles.metaPillText, { color: theme.icon }]}>
            {contributor.images?.length ?? 0} photographs
          </Text>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderLeftColor: theme.icon }]}>About the collection</Text>
        <TouchableOpacity style={[styles.shareButton, { borderColor: theme.border }]} onPress={handleShare}>
          <Text style={[styles.shareButtonText, { color: theme.icon }]}>Share</Text>
        </TouchableOpacity>

        {contributor.description && (
          <Text style={[styles.bio, { color: theme.text }]}>{contributor.description}</Text>
        )}
        {contributor.bio && (
          <Text style={[styles.bio, { color: theme.text }]}>{contributor.bio}</Text>
        )}

        <View style={styles.links}>
          {contributor.website && (
            <TouchableOpacity
              onPress={() => Linking.openURL(contributor.website!)}
            >
              <Text style={[styles.externalLink, { color: theme.accent }]}>Website {"\u2192"}</Text>
            </TouchableOpacity>
          )}
          {contributor.instagram && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  contributor.instagram!.startsWith("http")
                    ? contributor.instagram!
                    : `https://instagram.com/${contributor.instagram!.replace(/^@/, "")}`,
                )
              }
            >
              <Text style={[styles.externalLink, { color: theme.accent }]}>Instagram {"\u2192"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.gallerySection}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderLeftColor: theme.icon }]}>
          Gallery ({galleryImages.length})
        </Text>
        {isMixed && (
          <View style={styles.galleryFiltersRow}>
            {(["all", "not-nude", "nude"] as const).map((v) => {
              const label = v === "all" ? "All" : v === "nude" ? "Nude" : "Not Nude";
              const isActive = galleryNudityFilter === v;
              return (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.galleryPill,
                    isActive && styles.galleryPillActive,
                    {
                      borderColor: isActive ? theme.text : theme.border,
                      backgroundColor: isActive ? theme.text : "transparent",
                    },
                  ]}
                  onPress={() => setGalleryNudityFilter(v)}
                >
                  <Text
                    style={[
                      styles.galleryPillText,
                      isActive && styles.galleryPillTextActive,
                      { color: isActive ? theme.background : theme.icon },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <ContributorGallery
          images={galleryImages}
          onPressImage={(i) => {
            setZoomIndex(i);
            setZoomVisible(true);
          }}
        />
      </View>

      <ZoomGalleryModal
        images={zoomGalleryImages}
        visible={zoomVisible}
        initialIndex={zoomIndex}
        onClose={() => setZoomVisible(false)}
      />
    </ScrollView>
  );
}
