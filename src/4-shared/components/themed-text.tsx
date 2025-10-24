import { useThemeColor } from "@/4-shared/hooks/use-theme-color";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const rawColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const color =
    typeof rawColor === "number" ? `#${rawColor.toString(16)}` : rawColor;
  const { theme } = useTheme();

  // Font family mapping for each type
  const fontFamily =
    type === "title" || type === "subtitle" || type === "defaultSemiBold"
      ? theme.fontFamilyBold
      : theme.fontFamily;

  // Style mapping for each type
  const textStyle =
    type === "default"
      ? styles.default
      : type === "title"
      ? styles.title
      : type === "defaultSemiBold"
      ? styles.defaultSemiBold
      : type === "subtitle"
      ? styles.subtitle
      : type === "link"
      ? styles.link
      : undefined;

  return <Text style={[{ color, fontFamily }, textStyle, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    // fontWeight removed, handled by fontFamily
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    // fontWeight removed, handled by fontFamily
  },
  subtitle: {
    fontSize: 20,
    // fontWeight removed, handled by fontFamily
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    // fontWeight removed, handled by fontFamily
  },
});
