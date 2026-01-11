import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { WebGalleryMessageProps } from "@/4-shared/types";
import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";

/**
 * WebGalleryMessage
 *
 * Updated to account for the new nudity / other filters:
 * - Explains that filters (including the nudity filter) may hide images.
 * - Offers two actions:
 *   1) "Open filters" — calls optional onOpenFilters() prop if provided (recommended for mobile UX).
 *   2) "View full gallery on web" — redirects to the website (keeps potential traffic).
 *
 * Props:
 * - name, surname, slug, style (from WebGalleryMessageProps)
 * - onOpenFilters?: () => void  (optional — if provided, the "Open filters" button is shown)
 *
 * Rationale:
 * - Keep the web redirect to drive traffic if you want it.
 * - Also give users an immediate way to adjust filters in-app so they don't need to switch to the website.
 */

type Props = WebGalleryMessageProps & {
  onOpenFilters?: () => void;
};

export const WebGalleryMessage: React.FC<Props> = ({
  name,
  surname,
  slug,
  style,
  onOpenFilters,
}) => {
  const handlePressWeb = () => {
    Linking.openURL(
      `https://www.mosaic.photography/photographers/${slug}`
    ).catch(() => {});
  };

  const handlePressFilters = () => {
    if (onOpenFilters) onOpenFilters();
  };

  return (
    <ThemedView
      style={[
        {
          backgroundColor: "#dedede",
          borderRadius: 18,
          margin: 18,
          padding: 18,
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.13,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          elevation: 3,
        },
        style,
      ]}
    >
      <ThemedText
        style={{
          color: "#1d1d1d",
          fontSize: 19,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        We found few or no images for {name} {surname}.
      </ThemedText>

      <ThemedText
        style={{
          color: "#1d1d1d",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        This may be because you have filters enabled (for example the nudity
        filter). Try adjusting or clearing filters to see more images in the
        app. You can also view the complete, uncensored collection on our
        website.
      </ThemedText>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        {onOpenFilters ? (
          <TouchableOpacity
            onPress={handlePressFilters}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 10,
              paddingHorizontal: 18,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#ccc",
              marginRight: 8,
            }}
            activeOpacity={0.85}
          >
            <ThemedText
              style={{
                color: "#1d1d1d",
                fontWeight: "700",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Open filters
            </ThemedText>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={handlePressWeb}
          style={{
            backgroundColor: "#2c106a",
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 20,
            marginTop: 0,
          }}
          activeOpacity={0.85}
        >
          <ThemedText
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 15,
              textAlign: "center",
              letterSpacing: 0.4,
              height: 44,
            }}
          >
            View full gallery on mosaic.photography
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default WebGalleryMessage;
