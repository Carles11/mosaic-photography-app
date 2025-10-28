import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import React from "react";
import { Linking, TouchableOpacity } from "react-native";

type WebGalleryMessageProps = {
  style?: object;
  photographer: {
    name: string;
    surname: string;
  };
};

export const WebGalleryMessage: React.FC<WebGalleryMessageProps> = ({
  photographer,
  style,
}) => {
  const handlePressWeb = () => {
    Linking.openURL("https://www.mosaic.photography/").catch(() => {});
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
        We found few or no images for {photographer.name} {photographer.surname}
        . Would you like to see the complete, uncensored collection?
      </ThemedText>
      <ThemedText
        style={{
          color: "#1d1d1d",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        For legal reasons, we only show a selection of non-nude images in the
        mobile app. Visit the full gallery, including all nudes, on our website.
      </ThemedText>
      <TouchableOpacity
        onPress={handlePressWeb}
        style={{
          backgroundColor: "#d1002f",
          paddingVertical: 10,
          paddingHorizontal: 28,
          borderRadius: 20,
          marginTop: 5,
        }}
        activeOpacity={0.85}
      >
        <ThemedText
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          Go to www.mosaic.photography
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};
