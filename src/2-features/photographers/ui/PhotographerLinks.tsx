import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
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
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Where to find prints and books</Text>
        <Text style={styles.sectionStoresContent}>
          Shop stunning prints and books at these trusted retailers, carefully
          curated by the team of mosaic.photography:
        </Text>
      </View>
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
            <Text style={[styles.link, !item.website && styles.noLink]}>
              {item.store}
              {item.affiliate ? " (affiliate)" : ""}
            </Text>
          </TouchableOpacity>
        ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Learn more:</Text>
        {website ? (
          <TouchableOpacity
            onPress={() => handlePress(website)}
            accessibilityRole="link"
            accessibilityLabel={
              website.toLowerCase().includes("wikipedia")
                ? "Wikipedia"
                : "Official website"
            }
          >
            <Text style={styles.sectionStoresContent}>
              {website.toLowerCase().includes("wikipedia")
                ? "Wikipedia"
                : "Website"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default PhotographerLinks;
