import ProfileForm from "@/2-features/profile/ui/ProfileForm";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import React from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuthSession();

  if (authLoading) {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 10, fontSize: 18 }}>
          Loading...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ThemedText style={{ fontSize: 18 }}>
          Please log in to view your profile.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ProfileForm user={user} />
      </ThemedView>
    </SafeAreaView>
  );
}
