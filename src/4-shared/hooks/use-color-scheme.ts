import { useTheme } from '@/4-shared/theme/ThemeProvider';

export function useColorScheme(): 'light' | 'dark' {
  const { mode } = useTheme();
  return mode ?? 'dark';
}