import ProfileForm from "@/2-features/profile/ui/ProfileForm";
import { SwitchButton } from "@/4-shared/components/buttons";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ProfileScreen.styles";

export default function ProfileScreen() {
  const { user, loading: authLoading, signOut } = useAuthSession();
  const { mode, setMode } = useTheme();
  const colorScheme = useColorScheme();
  const theme = globalTheme[colorScheme];
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      router.push("/auth/login");
    }
  };

  if (authLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { flex: 1 }]} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.centered}>
          {user ? (
            <ProfileForm user={user} />
          ) : (
            <ThemedText style={styles.loadingText}>
              Please log in to view your profile.
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.profileMenuSection}>
          <ThemedView style={styles.menuItem}>
            <IconSymbol name="brightness-4" size={20} color={theme.text} />
            <ThemedView
              style={[
                styles.menuItemSlider,
                { backgroundColor: "transparent" },
              ]}
            >
              <SwitchButton
                value={mode === "dark"}
                onValueChange={(value) => setMode(value ? "dark" : "light")}
              />
              <ThemedText style={styles.menuItemLabel}>Toggle Theme</ThemedText>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleAuthAction}
            disabled={authLoading}
          >
            <IconSymbol name="logout" size={20} color={theme.text} />
            <ThemedText style={styles.menuItemLabel}>Log out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
