import type { ContributorWithFeatured } from "@/2-features/community/photography/api/fetchContributorsList";
import { fetchContributorsList } from "@/2-features/community/photography/api/fetchContributorsList";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { styles } from "./CommunitySlider.styles";
import CommunitySliderCard from "./CommunitySliderCard";

export default function CommunitySlider() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [contributors, setContributors] = useState<ContributorWithFeatured[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const CARD_WIDTH = 160;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchContributorsList();
      setContributors(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <View style={styles.section}>
      <ThemedText type="title">FROM THE COMMUNITY</ThemedText>
      <ThemedText type="subtitle">
        Contemporary photographers sharing selected work through Mosaic.
      </ThemedText>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" />
        </View>
      ) : contributors.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>More contributors coming soon.</Text>
        </View>
      ) : (
        <FlatList
          data={contributors}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CommunitySliderCard contributor={item} cardWidth={CARD_WIDTH} />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.ctaLink}
        onPress={() => router.push("/community/photography")}
      >
        <Text style={styles.ctaLinkText}>Add your piece to the mosaic {"\u2192"}</Text>
      </TouchableOpacity>
    </View>
  );
}
