import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { RoundMosaicLogo } from "@/4-shared/components/logo/MosaicLogoRound";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./ImageHeaderRow.styles";

export const ImageHeaderRow: React.FC<{
  onOpenMenu?: () => void;
}> = ({ onOpenMenu }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.imageHeaderRow}>
      <RoundMosaicLogo size={33} />
      <ThemedText
        type="defaultSemiBold"
        style={styles.mosaicTitle}
        numberOfLines={1}
      >
        Mosaic collection
      </ThemedText>
      <TouchableOpacity
        onPress={onOpenMenu}
        style={{ marginLeft: "auto" }}
        accessibilityLabel="More options"
      >
        <IconSymbol
          color={theme.icon}
          type="material"
          name="more-vert"
          size={26}
        />
      </TouchableOpacity>
    </View>
  );
};
