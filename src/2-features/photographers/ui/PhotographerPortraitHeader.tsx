import { ThemedText } from "@/4-shared/components/themed-text";
import { formatLifespan } from "@/4-shared/lib/formatLifespan";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

type Photographer = {
  name: string;
  surname: string;
  birthdate?: string | null;
  deceasedate?: string | null;
  images?: { filename: string; url: string }[];
};

type PhotographerPortraitHeaderProps = {
  photographer: Photographer;
};

export const PhotographerPortraitHeader: React.FC<
  PhotographerPortraitHeaderProps
> = ({ photographer }) => {
  // Find portrait image (filename starts with "000_aaa_")
  const portrait =
    photographer.images?.find((img) =>
      img.filename?.toLowerCase().startsWith("000_aaa_")
    ) || null;

  if (!portrait) return null;

  const HEADER_HEIGHT = deviceHeight * 0.5;
  const BLUR_HEIGHT = HEADER_HEIGHT / 3; // Bottom 1/3

  return (
    <View style={{ width: deviceWidth, height: HEADER_HEIGHT }}>
      <Image
        source={{ uri: portrait.url }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* Blur and gradient at the bottom for smooth transition */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: deviceWidth,
          height: BLUR_HEIGHT,
          overflow: "hidden",
        }}
        pointerEvents="none"
      >
        <LinearGradient
          // Fade from transparent to background color (dark for effect)
          colors={[
            "rgba(0,0,0,0)", // transparent
            "rgba(0,0,0,0.08)", // light shadow
            "rgba(0,0,0,0.18)",
            "rgba(0,0,0,0.38)",
            "rgba(0,0,0,0.6)", // strong fade at very bottom
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 1 }}
        />
        <BlurView
          intensity={38}
          style={StyleSheet.absoluteFill}
          tint="default"
        />
      </View>
      {/* Overlayed text on blurred/gradient area */}
      <View
        style={{
          position: "absolute",
          bottom: BLUR_HEIGHT * 0.4,
          width: deviceWidth,
          alignItems: "center",
        }}
        pointerEvents="box-none"
      >
        <ThemedText
          style={{
            color: "#fff",
            fontSize: 32,
            fontWeight: "bold",
            textShadowColor: "rgba(0,0,0,0.65)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }}
        >
          {photographer.name} {photographer.surname}
        </ThemedText>
        <ThemedText
          style={{
            color: "#eee",
            fontSize: 18,
            marginTop: 4,
            textShadowColor: "rgba(0,0,0,0.4)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
        >
          {formatLifespan(
            photographer.birthdate ?? undefined,
            photographer.deceasedate ?? undefined
          )}
        </ThemedText>
      </View>
    </View>
  );
};
