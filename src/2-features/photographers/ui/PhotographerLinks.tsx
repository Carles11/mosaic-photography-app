import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import React from "react";
import { Linking, TouchableOpacity } from "react-native";
import { styles } from "./PhotographerLinks.styles";

interface Store {
  store: string;
  website: string;
  affiliate?: boolean;
}

interface PhotographerLinksProps {
  stores?: Store[] | string[];
  website?: string;
}

const PhotographerLinks: React.FC<PhotographerLinksProps> = ({
  stores,
  website,
}) => {
  const parsedStores: Store[] = Array.isArray(stores)
    ? stores.map((store) => {
        if (typeof store === "string") {
          try {
            return JSON.parse(store);
          } catch {
            return { store, website: "" };
          }
        }
        return store as Store;
      })
    : [];

  const handlePress = (url: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <ThemedView>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          Make it Yours: Prints and Books
        </ThemedText>
        <ThemedText style={styles.sectionStoresContent}>
          Shop stunning prints and books at these trusted retailers, carefully
          curated by the team of mosaic.photography:
        </ThemedText>
      </ThemedView>
      {parsedStores.length > 0 &&
        parsedStores.map((item, idx) => (
          <TouchableOpacity
            key={item.store ? item.store : idx}
            onPress={() => handlePress(item.website)}
            disabled={!item.website}
            style={styles.linkItem}
            accessibilityRole="link"
            accessibilityLabel={`Shop at ${item.store}`}
          >
            <ThemedText style={[styles.link, !item.website && styles.noLink]}>
              {item.store}
              {item.affiliate ? " (affiliate)" : ""}
            </ThemedText>
          </TouchableOpacity>
        ))}

      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Learn more:</ThemedText>
        {website ? (
          <TouchableOpacity
            onPress={() => handlePress(website)}
            accessibilityRole="link"
            accessibilityLabel={
              website.toLowerCase().includes("wikipedia")
                ? "Wikipedia"
                : "Official website"
            }
            style={styles.linkItem}
          >
            <ThemedText style={styles.link}>
              {website.toLowerCase().includes("wikipedia")
                ? "Wikipedia"
                : "Website"}
            </ThemedText>
          </TouchableOpacity>
        ) : null}
      </ThemedView>
    </ThemedView>
  );
};

export default PhotographerLinks;
