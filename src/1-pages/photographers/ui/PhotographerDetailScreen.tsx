import { fetchPhotographerBySlug } from "@/2-features/photographers/api/fetchPhotographersBySlug";
import { getTimelineBySlug } from "@/2-features/photographers/model/photographersTimelines";
import PhotographerLinks from "@/2-features/photographers/ui/PhotographerLinks";
import Timeline from "@/2-features/photographers/ui/Timeline";
import { formatLifespan } from "@/4-shared/lib/formatLifespan";
import { PhotographerImage, PhotographerSlug } from "@/4-shared/types";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { styles } from "./PhotographerDetailScreen.styles";

const { width: deviceWidth } = Dimensions.get("window");

const PhotographerDetailScreen: React.FC = () => {
  const { slug } = useLocalSearchParams();
  const [photographer, setPhotographer] = useState<PhotographerSlug | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
      <View style={styles.container}>
        <Text style={styles.title}>
          {photographer.name} {photographer.surname}
        </Text>
        <Text style={styles.lifespan}>
          {formatLifespan(photographer.birthdate, photographer.deceasedate)}
        </Text>
        <Text style={styles.sectionTitle}>A Life in Focus</Text>
        <Text style={styles.sectionSubtitle}>
          Personal & Historical Milestones in {photographer.name}{" "}
          {photographer.surname}'s life.
        </Text>
        <View style={styles.timelineContainer}>
          <Timeline events={timelineEvents} />
        </View>
        <Text style={styles.sectionTitle}>About the Photographer</Text>
        <Text style={styles.sectionLabel}>Born in:</Text>
        <Text style={styles.sectionContent}>{photographer.origin}</Text>
        <Text style={styles.sectionLabel}>Biography:</Text>
        <Text style={styles.biography}>{photographer.biography}</Text>
        <PhotographerLinks
          stores={photographer.store}
          website={photographer.website}
        />
        <Text style={styles.sectionTitle}>
          Gallery{" "}
          <Text style={styles.galleryCount}>
            ({photographer.images?.length || 0})
          </Text>
        </Text>
      </View>
    );
  }, [photographer, timelineEvents]);

  const renderImage = useCallback(
    ({ item }: { item: PhotographerImage }) => (
      <View style={styles.galleryImageWrapper}>
        <Image
          source={{ uri: item.url }}
          style={[
            styles.galleryImage,
            { width: deviceWidth, height: deviceWidth * 0.7 },
          ]}
          resizeMode="cover"
        />
        {item.title ? (
          <Text style={styles.imageTitle}>{item.title}</Text>
        ) : null}
        {item.description ? (
          <Text style={styles.imageDescription}>{item.description}</Text>
        ) : null}
      </View>
    ),
    []
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (notFound || !photographer) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Photographer not found.</Text>
      </View>
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
