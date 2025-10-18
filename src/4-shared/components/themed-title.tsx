import { useThemeColor } from '@/4-shared/hooks/use-theme-color';
import { useTheme } from '@/4-shared/theme/ThemeProvider';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTitleProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
};

export function ThemedTitle({
  style,
  lightColor,
  darkColor,
  children,
  ...rest
}: ThemedTitleProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { theme } = useTheme();

  return (
    <Text
      style={[
        {
          color,
          fontFamily: theme.fontFamilyBold,
          fontSize: 32,
          lineHeight: 36,
        },
        styles.title,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    // You can adjust these as needed for your brand or UI consistency
    fontWeight: 'bold', // Optional, TradeGothic-Bold font will handle bolding
    marginBottom: 8,
  },
});