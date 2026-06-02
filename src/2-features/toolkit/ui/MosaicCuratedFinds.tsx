import { fetchAffiliateResources } from "@/2-features/toolkit/api/fetchAffiliateResources";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import {
  AffiliateProductWithAdvertiser,
  AffiliateResourceFilter,
} from "@/4-shared/types";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { CuratedFindsCard } from "./CuratedFindsCard";
import { styles } from "./MosaicCuratedFinds.styles";

const FILTERS: { label: string; value: AffiliateResourceFilter }[] = [
  { label: "All", value: "all" },
  { label: "Books", value: "book" },
  { label: "Prints", value: "print" },
  { label: "Framing", value: "framing" },
  { label: "Tools", value: "tool" },
];

export function MosaicCuratedFinds() {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] =
    useState<AffiliateResourceFilter>("all");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string | null>(
    null,
  );
  const [resources, setResources] = useState<AffiliateProductWithAdvertiser[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const data = await fetchAffiliateResources();
      if (!active) return;
      setResources(data);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const filteredResources = useMemo(() => {
    const withoutExcludedAdvertiser = resources.filter((resource) => {
      const advertiserName = resource.affiliate_advertisers?.name ?? "";
      // temporary disabled until awin program joining confirms
      return advertiserName.trim().toLowerCase() !== "fine art america";
    });

    const byType =
      selectedType === "all"
        ? withoutExcludedAdvertiser
        : withoutExcludedAdvertiser.filter(
            (resource) => resource.type?.toLowerCase() === selectedType,
          );

    if (selectedAdvertiser === null) {
      return byType;
    }

    return byType.filter(
      (resource) => resource.affiliate_advertisers?.name === selectedAdvertiser,
    );
  }, [resources, selectedType, selectedAdvertiser]);

  return (
    <ThemedView style={styles.section}>
      <ThemedText type="title">Mosaic's Curated Finds</ThemedText>
      <ThemedText type="subtitle">
        The gear, books, and prints Mosaic actually uses and believes in.
      </ThemedText>

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(item) => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersList}
        renderItem={({ item }) => {
          const isActive = selectedType === item.value;
          return (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                setSelectedAdvertiser(null);
                setSelectedType(item.value);
              }}
              style={[
                styles.pill,
                {
                  borderColor: isActive ? theme.accent : theme.border,
                  backgroundColor: isActive ? theme.primary : theme.background,
                },
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.pillText,
                  { color: isActive ? "#fff" : theme.text },
                ]}
              >
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />

      {loading ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="small" color={theme.accent} />
        </ThemedView>
      ) : filteredResources.length ? (
        <FlatList
          horizontal
          data={filteredResources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CuratedFindsCard product={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={4}
          windowSize={5}
          removeClippedSubviews
        />
      ) : (
        <ThemedView style={styles.centered}>
          <ThemedText>No curated resources found.</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}
