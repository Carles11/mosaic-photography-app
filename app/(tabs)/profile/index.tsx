import ProfileScreen from "@/1-pages/profile/ui/ProfileScreen";
import { ThemedView } from "@/4-shared/components/themed-view";
import React from "react";

export default function ProfileScreenScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ProfileScreen />
    </ThemedView>
  );
}
