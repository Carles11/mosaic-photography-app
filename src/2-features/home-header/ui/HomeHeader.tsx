import { supabase } from "@/4-shared/api/supabaseClient";
import { DropdownButton, SwitchButton } from "@/4-shared/components/buttons";
import { ThemedView } from "@/4-shared/components/themed-view";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { DropdownMenuItem } from "@/4-shared/types/menu";
import { useRouter } from "expo-router";
import React from "react";
import { styles } from "./HomeHeader.styles";

type HomeHeaderProps = {
  onOpenFilters?: () => void;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onOpenFilters }) => {
  const colorScheme = useColorScheme();
  const { mode, setMode } = useTheme();
  const theme = globalTheme[colorScheme];
  const router = useRouter();
  const { user, loading } = useAuthSession();

  // Handler for login/logout menu action
  const handleAuthAction = async () => {
    if (user) {
      // Log out
      await supabase.auth.signOut();
      router.replace("/"); // Redirect to home after logout
    } else {
      // Login
      router.push("/auth/login");
    }
  };

  // Determine icon and label for login/logout button
  const authMenuItem = {
    label: user ? "Log out" : "Login",
    icon: (
      <IconSymbol
        name={user ? "logout" : "login"}
        size={20}
        color={theme.text}
      />
    ),
    action: handleAuthAction,
  };

  const menuItems: DropdownMenuItem[] = [
    {
      label: "Filters",
      icon: <IconSymbol name="filter" size={20} color={theme.text} />,
      action: () => {
        if (onOpenFilters) onOpenFilters();
      },
    },
    authMenuItem,
    {
      label: "Toggle Theme",
      component: (
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <IconSymbol name="brightness-4" size={20} color={theme.text} />
          <SwitchButton
            value={mode === "dark"}
            onValueChange={(value) => {
              setMode(value ? "dark" : "light");
            }}
          />
        </ThemedView>
      ),
    },
  ];

  return (
    <ThemedView style={[styles.header, { backgroundColor: theme.background }]}>
      <DropdownButton menuItems={menuItems}>Menu</DropdownButton>
      <ThemedView style={styles.iconsRow}>
        <IconSymbol
          type="material"
          name="favorite-border"
          size={28}
          color={theme.favoriteIcon}
          style={styles.icon}
          accessibilityLabel="Favorites"
          onPress={() => router.push("/favorites-list")}
        />
        <IconSymbol
          type="material"
          name="chat-bubble-outline"
          size={28}
          color={theme.icon ?? theme.text}
          style={styles.icon}
          accessibilityLabel="Messages"
          onPress={() => {
            // handle messages action
          }}
        />
      </ThemedView>
    </ThemedView>
  );
};
