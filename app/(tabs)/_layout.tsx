import { Tabs } from 'expo-router';

import { HapticTab } from '@/4-shared/components/haptic-tab';
import { IconSymbol } from '@/4-shared/components/ui/icon-symbol';
import { Colors } from '@/4-shared/constants/theme';
import { useTheme } from '@/4-shared/theme/ThemeProvider';

export default function TabLayout() {
  const { mode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[mode ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}