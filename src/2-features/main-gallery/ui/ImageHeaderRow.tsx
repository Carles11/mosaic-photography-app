import { RoundMosaicLogo } from "@/4-shared/components/logo/MosaicLogoRound";
import { ThemedTitle } from "@/4-shared/components/themed-title";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./ImageHeaderRow.styles";

export const ImageHeaderRow: React.FC<{
  onOpenMenu?: () => void;
}> = ({ onOpenMenu }) => (
  <View style={styles.imageHeaderRow}>
    <RoundMosaicLogo size={33} />
    <ThemedTitle style={styles.mosaicTitle} numberOfLines={1}>
      Mosaic collection
    </ThemedTitle>
    <TouchableOpacity
      onPress={onOpenMenu}
      style={{ marginLeft: "auto" }}
      accessibilityLabel="More options"
    >
      <IconSymbol type="material" name="more-vert" size={26} />
    </TouchableOpacity>
  </View>
);
