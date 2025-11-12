import { ThemedText } from "@/4-shared/components/themed-text";
import { useResponsivePhotographerHeader } from "@/4-shared/hooks/use-responsive-photographer-header";
import { formatLifespan } from "@/4-shared/lib/formatLifespan";
import { hexToRgba } from "@/4-shared/lib/hexToRgba";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { PhotographerPortraitHeaderProps } from "@/4-shared/types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, View } from "react-native";
import { createPhotographerPortraitHeaderStyles } from "./PhotographerPortraitHeader.styles";

export const PhotographerPortraitHeader: React.FC<
  PhotographerPortraitHeaderProps
> = ({ photographer }) => {
  const { theme } = useTheme();
  const { headerWidth, headerHeight, headerImageWidth, fadeHeight } =
    useResponsivePhotographerHeader();

  const styles = createPhotographerPortraitHeaderStyles(
    headerWidth,
    headerHeight,
    headerImageWidth,
    fadeHeight
  );

  const portrait =
    photographer.images?.find((img) =>
      img.filename?.toLowerCase().startsWith("000_aaa_")
    ) || null;

  if (!portrait) return null;

  return (
    <View style={styles.root}>
      <Image
        source={{ uri: portrait.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.gradientContainer} pointerEvents="none">
        <LinearGradient
          colors={[
            hexToRgba(theme.background, 0), // transparent
            theme.background,
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      <View style={styles.overlayContent} pointerEvents="box-none">
        <ThemedText type="title" style={styles.name}>
          {photographer.name} {photographer.surname}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.lifespan}>
          {formatLifespan(
            photographer.birthdate ?? undefined,
            photographer.deceasedate ?? undefined
          )}
        </ThemedText>
      </View>
    </View>
  );
};
