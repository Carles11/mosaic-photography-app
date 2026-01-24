import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { StyleProp, TextStyle, TouchableOpacity } from "react-native";
import { styles } from "./SecondaryButton.styles";

import { ThemedText } from "@/4-shared/components/themed-text";
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
          backgroundColor: theme.accent,
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
      <ThemedText
        type="defaultSemiBold"
        style={[
          {
            color: theme.surface,
            textAlign: "center",
          },
          textStyles,
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};
