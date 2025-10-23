import ProfileForm from "@/2-features/profile/ui/ProfileForm";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import React from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ProfileScreen.styles";

export default function ProfileScreen() {
  const { user, loading: authLoading } = useAuthSession();

  if (authLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.notLoggedInText}>
          Please log in to view your profile.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.centered}>
        <ProfileForm user={user} />
      </ThemedView>
    </SafeAreaView>
  );
}
