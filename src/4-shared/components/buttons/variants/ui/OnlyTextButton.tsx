import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { ButtonProps } from "@/4-shared/types/buttons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./OnlyTextButton.styles";

export const OnlyTextButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: theme.buttonBorderColor,
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
          styles.text,
          {
            color: theme.buttonTextColor,
            fontFamily: theme.fontFamily,
            fontSize: theme.buttonFontSize,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
