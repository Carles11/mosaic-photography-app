import { Tabs } from 'expo-router';

import { HapticTab } from '@/4-shared/components/haptic-tab';
import { IconSymbol } from '@/4-shared/components/ui/icon-symbol';
import { useColorScheme } from '@/4-shared/hooks/use-color-scheme';
import { useTheme } from '@/4-shared/theme/ThemeProvider';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { mode, theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent, 
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol type="sf" size={28} name="house.fill" color={color} accessibilityLabel="Home Tab" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol type="sf" size={28} name="paperplane.fill" color={color} accessibilityLabel="Explore Tab" />
          ),
        }}
      />
    </Tabs>
  );
}