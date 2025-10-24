import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { styles } from "./ThemedTextInput.styles";

interface ThemedInputProps extends Omit<TextInputProps, "style"> {
  style?: any;
}

export const ThemedTextInput: React.FC<ThemedInputProps> = ({
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <TextInput
      style={[styles.input(theme), style]}
      placeholderTextColor={theme.inputPlaceholderColor}
      {...props}
    />
  );
};
