import { fetchPhotographerBySlug } from "@/2-features/photographers/api/fetchPhotographersBySlug";
import { getTimelineBySlug } from "@/2-features/photographers/model/photographersTimelines";
import PhotographerLinks from "@/2-features/photographers/ui/PhotographerLinks";
import { PhotographerTimeline } from "@/2-features/photographers/ui/Timeline";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { formatLifespan } from "@/4-shared/lib/formatLifespan";
import { PhotographerImage, PhotographerSlug } from "@/4-shared/types";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image } from "react-native";
import { styles } from "./PhotographerDetailScreen.styles";

const { width: deviceWidth } = Dimensions.get("window");

const PhotographerDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams();
  const [photographer, setPhotographer] = useState<PhotographerSlug | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  const renderHeader = useCallback(() => {
    if (!photographer) return null;
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>
          {photographer.name} {photographer.surname}
        </ThemedText>
        <ThemedText style={styles.lifespan}>
          {formatLifespan(photographer.birthdate, photographer.deceasedate)}
        </ThemedText>
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
    );
  }, [photographer, timelineEvents]);

  const renderImage = useCallback(
    ({ item }: { item: PhotographerImage }) => (
      <ThemedView style={styles.galleryImageWrapper}>
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
      </ThemedView>
    ),
    []
  );

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
    <FlatList
      data={photographer.images || []}
      keyExtractor={(item, idx) => `${item.id}-${idx}`}
      renderItem={renderImage}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.flatListContent}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={15}
      removeClippedSubviews
    />
  );
};

export default PhotographerDetailScreen;
