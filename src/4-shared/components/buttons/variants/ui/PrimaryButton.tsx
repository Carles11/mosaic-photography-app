import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { styles } from "./PrimaryButton.styles";

import { ThemedText } from "@/4-shared/components/themed-text";
import { ButtonProps } from "@/4-shared/types";

type PrimaryButtonProps = ButtonProps & {
  textStyles?: StyleProp<TextStyle>;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyles,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.buttonBackgroundColor,
          borderColor: theme.buttonBorderColor,
          borderWidth: theme.buttonBorderWidth,
          borderRadius: theme.buttonBorderRadius,
        },
        disabled && { opacity: 0.5 },
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.buttonTextColor} />
      ) : (
        <ThemedText
          type="defaultSemiBold"
          style={[
            {
              color: "#fff",
              textAlign: "center",
            },
            textStyles,
          ]}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};
