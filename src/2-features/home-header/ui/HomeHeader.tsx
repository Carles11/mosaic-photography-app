import { ThemedView } from "@/4-shared/components/themed-view";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import React from "react";
import { styles } from "./HomeHeader.styles";

// Import SVG Mosaic themed logos for light and dark modes
import MosaicLogoLight from "@/4-shared/assets/logos/mosaic-high-resolution-logo-light-transparent.svg";
import MosaicLogoDark from "@/4-shared/assets/logos/test.svg";

export const HomeHeader: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = globalTheme[colorScheme];

  // Pick logo version based on current theme
  const Logo = colorScheme === "dark" ? MosaicLogoLight : MosaicLogoDark;

  return (
    <ThemedView style={[styles.header, { backgroundColor: theme.background }]}>
      <IconSymbol type="svg" svgAsset={MosaicLogoDark} size={100} />

      <ThemedView style={styles.iconsRow}>
        <IconSymbol
          type="material"
          name="favorite-border"
          size={28}
          color={theme.favoriteIcon}
          style={styles.icon}
          accessibilityLabel="Favorites"
          onPress={() => {
            // handle favorite action
          }}
        />
        <IconSymbol
          type="material"
          name="chat-bubble-outline"
          size={28}
          color={theme.icon ?? theme.text}
          style={styles.icon}
          accessibilityLabel="Messages"
          onPress={() => {
            // handle messages action
          }}
        />
      </ThemedView>
    </ThemedView>
  );
};
