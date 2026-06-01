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
  { label: "Prints", value: "print" },
  { label: "Tools", value: "tool" },
  { label: "Framing", value: "framing" },
  { label: "Books", value: "book" },
];

export function MosaicCuratedFinds() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<AffiliateResourceFilter>("all");
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
    if (selected === "all") {
      return [...resources].sort((a, b) => {
        const aIsPrint = a.type?.toLowerCase() === "print";
        const bIsPrint = b.type?.toLowerCase() === "print";

        if (aIsPrint === bIsPrint) return 0;
        return aIsPrint ? -1 : 1;
      });
    }

    return resources.filter(
      (resource) => resource.type?.toLowerCase() === selected,
    );
  }, [resources, selected]);

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
          const isActive = selected === item.value;
          return (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setSelected(item.value)}
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
