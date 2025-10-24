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
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.border + "20", // with 20 transparency
        },
        headerTintColor: theme.text,
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
          title: "Favorites List",
          headerShown: true,
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
          title: "Collections List",
          headerShown: true,
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
          headerShown: true,
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
