import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { PhotographerLinksProps, Store } from "@/4-shared/types";
import React, { useMemo } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  Text as RNText,
  View,
} from "react-native";
import { styles } from "./PhotographerLinks.styles";

/**
 * Mobile-safe URL opener with graceful fallback and user alert on failure.
 */
const safeOpenUrl = async (url?: string) => {
  if (!url) return;
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  try {
    const supported = await Linking.canOpenURL(normalized);
    if (supported) {
      await Linking.openURL(normalized);
      return;
    }
    // Fallback: still try to open
    await Linking.openURL(normalized);
  } catch (err) {
    const title = "Unable to open link";
    const message =
      Platform.OS === "ios"
        ? "Couldn't open the link. Please check your device settings."
        : "Couldn't open the link. Please ensure you have a browser available.";
    Alert.alert(title, message);
  }
};

const truncate = (s?: string, n = 120) => {
  if (!s) return "";
  if (s.length <= n) return s;
  return `${s.slice(0, n).trim()}…`;
};

/**
 * Normalize incoming store data:
 * - Accepts either structured objects (Store) or JSON strings (legacy).
 * - Returns array of Store objects with optional fields.
 */
const normalizeStores = (
  stores?: PhotographerLinksProps["stores"]
): Store[] => {
  if (!stores) return [];
  if (!Array.isArray(stores)) return [];

  return stores
    .map((s) => {
      if (typeof s === "string") {
        try {
          return JSON.parse(s) as Store;
        } catch {
          // fallback to treat the string as store name only
          return { store: s, website: "" } as Store;
        }
      }
      return s as Store;
    })
    .filter(Boolean);
};

const renderThumbnail = (image?: string, title?: string) => {
  if (image) {
    return (
      <Image
        source={{ uri: image }}
        style={styles.thumbnail}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  // Generate initials placeholder
  const initials = (title || "")
    .split(" ")
    .map((t) => t[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={styles.thumbnailPlaceholder}
      accessible
      accessibilityRole="image"
    >
      <RNText style={styles.thumbnailInitials}>{initials || "?"}</RNText>
    </View>
  );
};

const PhotographerLinks: React.FC<PhotographerLinksProps> = ({
  stores,
  website,
}) => {
  const parsedStores = useMemo(() => normalizeStores(stores), [stores]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          Make it Yours: Prints and Books
        </ThemedText>
        <ThemedText style={styles.sectionStoresContent}>
          Shop curated prints, books and reproductions from trusted retailers.
        </ThemedText>
      </ThemedView>

      <View style={styles.list}>
        {parsedStores.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No store links available.
          </ThemedText>
        ) : (
          parsedStores.map((storeObj, idx) => {
            const url = storeObj.website ?? "";
            const isDisabled = !url;
            const isAffiliate = !!storeObj.affiliate;
            return (
              <View
                style={styles.card}
                key={`${storeObj.store ?? "store"}-${idx}`}
                accessible
              >
                <View style={styles.left}>
                  {renderThumbnail(storeObj.image, storeObj.store)}
                </View>

                <View style={styles.center}>
                  <ThemedText style={styles.storeName} numberOfLines={1}>
                    {storeObj.store ?? "Unknown retailer"}
                    {isAffiliate ? " · affiliate" : ""}
                  </ThemedText>

                  {storeObj.item ? (
                    <ThemedText style={styles.itemLabel} numberOfLines={1}>
                      {storeObj.item}
                    </ThemedText>
                  ) : null}

                  {storeObj.description ? (
                    <ThemedText style={styles.description} numberOfLines={2}>
                      {truncate(storeObj.description, 120)}
                    </ThemedText>
                  ) : null}
                </View>

                <View style={styles.right}>
                  <Pressable
                    onPress={() => safeOpenUrl(url)}
                    disabled={isDisabled}
                    style={({ pressed }) => [
                      styles.button,
                      isDisabled && styles.buttonDisabled,
                      pressed && styles.buttonPressed,
                    ]}
                    accessibilityRole="link"
                    accessibilityLabel={
                      url
                        ? `Open ${storeObj.store ?? "store"}${
                            isAffiliate ? " (affiliate)" : ""
                          }`
                        : `No link available for ${storeObj.store ?? "store"}`
                    }
                  >
                    <ThemedText
                      style={[
                        styles.buttonText,
                        isDisabled && styles.buttonTextDisabled,
                      ]}
                    >
                      {isDisabled ? "Unavailable" : "Shop"}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </View>

      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Learn more:</ThemedText>
        {website ? (
          <Pressable
            onPress={() => safeOpenUrl(website)}
            accessibilityRole="link"
            accessibilityLabel={
              website.toLowerCase().includes("wikipedia")
                ? "Wikipedia"
                : "Official website"
            }
            style={styles.linkRow}
          >
            <ThemedText style={styles.linkText}>
              {website.toLowerCase().includes("wikipedia")
                ? "Wikipedia"
                : "Website"}
            </ThemedText>
          </Pressable>
        ) : (
          <ThemedText style={styles.emptyText}>No website listed.</ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default PhotographerLinks;
