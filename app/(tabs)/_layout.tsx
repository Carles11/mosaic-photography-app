import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { HapticTab } from "@/4-shared/components/haptic-tab";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarStyle: {
          backgroundColor: theme.background,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              type="sf"
              size={28}
              name="house.fill"
              color={color}
              accessibilityLabel="Home Tab"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              type="material"
              size={28}
              name="favorite"
              color={color}
              accessibilityLabel="Favorites Tab"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              type="material"
              size={28}
              name="collections"
              color={color}
              accessibilityLabel="Collections Tab"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              type="material"
              size={28}
              name="person"
              color={color}
              accessibilityLabel="Profile Tab"
            />
          ),
        }}
      />
    </Tabs>
  );
}
