import MosaicLogo from "@/4-shared/assets/logos/test.svg";
import React from "react";
import { View } from "react-native";
import { styles } from "./MosaicLogoRound.styles";

export const RoundMosaicLogo: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <View
    style={[
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#202030",
      },
    ]}
  >
    <MosaicLogo width={size * 0.75} height={size * 0.75} />
  </View>
);
