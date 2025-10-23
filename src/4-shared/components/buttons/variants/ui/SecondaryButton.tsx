import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { StyleProp, Text, TextStyle, TouchableOpacity } from "react-native";
import { styles } from "./SecondaryButton.styles";

import { ButtonProps } from "@/4-shared/types/buttons";

type SecondaryButtonProps = ButtonProps & {
  textStyles?: StyleProp<TextStyle>;
};

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyles,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: "transparent",
          borderColor: theme.buttonBorderColor,
          borderWidth: theme.buttonBorderWidth,
          borderRadius: theme.buttonBorderRadius,
        },
        disabled && { opacity: 0.5 },
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          {
            color: theme.buttonTextColor,
            fontFamily: theme.fontFamily,
            fontSize: theme.buttonFontSize,
            textAlign: "center",
          },
          textStyles,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
