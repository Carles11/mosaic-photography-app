import { View, type ViewProps } from "react-native";

import { useTheme } from "../theme/ThemeProvider";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[{ backgroundColor: theme.background }, style]}
      {...otherProps}
    />
  );
}
