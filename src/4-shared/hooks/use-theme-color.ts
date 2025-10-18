import { useTheme } from '@/4-shared/theme/ThemeProvider';

/**
 * Returns the correct color from the current theme, or an override if provided.
 * @param props - Optional overrides for light/dark color.
 * @param colorName - The key of the color in your theme object.
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof useTheme>['theme']
) {
  const { theme, mode } = useTheme();
  const colorFromProps = props[mode];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme[colorName];
  }
}