import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "@/2-features/profile/api/profileApi";
import { DangerZoneCard } from "@/2-features/profile/ui/DangerZoneCard";
import { ProfileHeader } from "@/2-features/profile/ui/ProfileHeader";
import { ProfileInfoCard } from "@/2-features/profile/ui/ProfileInfoCard";
import { ProfileStatCard } from "@/2-features/profile/ui/ProfileStatCard";
import { SettingsCard } from "@/2-features/profile/ui/SettingsCard";
import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useCollections } from "@/4-shared/context/collections/CollectionsContext";
import { useFavorites } from "@/4-shared/context/favorites";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { useSubscription } from "@/4-shared/subscription";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { ProfileData } from "@/4-shared/types";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ProfileScreen.styles";

export default function ProfileScreen() {
  const { user, loading: authLoading, signOut } = useAuthSession();
  const { mode, setMode } = useTheme();
  const colorScheme = useColorScheme();
  const theme = globalTheme[colorScheme];
  const router = useRouter();
  const { favorites } = useFavorites();
  const { collections } = useCollections();

  const [deleting, setDeleting] = useState(false);
  // 1. Profile fields state for editing/updating
  const [profileFields, setProfileFields] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // 2. Auth/Favorites/etc hooks/logic omitted for brevity

  useFocusEffect(
    useCallback(() => {
      if (!authLoading && !user) {
        showErrorToast("Please login to access your profile");
        router.replace("/auth/login");
      }
    }, [authLoading, user, router]),
  );

  // Fetch profile data on mount or when user changes
  useEffect(() => {
    const fetchAndSetProfile = async () => {
      if (!user?.id) {
        setProfileFields(null);
        setProfileLoading(false);
        return;
      }
      setProfileLoading(true);
      try {
        let data = await getProfile(user.id);
        if (!data) {
          // No profile yet, create one
          const newProfile: ProfileData = {
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            instagram: "",
            website: "",
            own_store_name: "",
            own_store_url: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          data = await createProfile(newProfile);
        }
        setProfileFields(data);
      } catch (e) {
        showErrorToast("Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    };
    if (user) fetchAndSetProfile();
  }, [user]);

  // 3. Multi-purpose profile update handler
  const handleProfileFieldChange = (
    field: keyof ProfileData,
    value: string,
  ) => {
    setProfileFields((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // 4. Save handler (e.g. from a Save button)
  const handleSaveProfile = async () => {
    if (!user || !profileFields) return;
    setProfileSaving(true);
    try {
      await updateProfile(user.id, {
        ...profileFields,
        updated_at: new Date().toISOString(),
      });
      showSuccessToast("Profile updated successfully!");
    } catch (e) {
      showErrorToast("Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  // 5. Logout and Delete as in your code
  const handleLogout = async () => {
    if (user) {
      await signOut();
      router.replace("/");
    } else {
      router.push("/auth/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            Alert.alert(
              "Confirm Deletion",
              "This will delete your account and all associated data. Are you absolutely sure?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Forever",
                  style: "destructive",
                  onPress: async () => {
                    setDeleting(true);
                    try {
                      await deleteProfile();
                      await signOut();
                      router.replace("/");
                    } catch (error: any) {
                      Alert.alert(
                        "Error",
                        "Failed to delete account: " +
                          (error?.message || "Unknown error"),
                      );
                    } finally {
                      setDeleting(false);
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  // ————————————————————————————————————————
  // RENDER PHASE
  // ————————————————————————————————————————
  if (authLoading || profileLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!user || !profileFields) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.loadingText}>
          No user found. Please log in.
        </ThemedText>
        <PrimaryButton
          title="Go to Login"
          onPress={() => router.push("/auth/login")}
        />
      </ThemedView>
    );
  }

  const TestRevenueCat = () => {
    const { isInitializing, hasProSubscription, availablePackages, error } =
      useSubscription();

    if (isInitializing) {
      return <ThemedText>Loading RevenueCat...</ThemedText>;
    }

    return (
      <ThemedView style={{ padding: 20, margin: 10 }}>
        <ThemedText>🧪 RevenueCat Test</ThemedText>
        <ThemedText>
          Pro Status: {hasProSubscription ? "✅ Pro User" : "❌ Free User"}
        </ThemedText>
        <ThemedText>Available Packages: {availablePackages.length}</ThemedText>
        <ThemedText>Error: {error || "None"}</ThemedText>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader name={profileFields.name} />
        <ProfileInfoCard
          name={profileFields.name}
          email={profileFields.email}
          createdAt={profileFields.created_at}
        />
        <ProfileStatCard
          favoritesCount={favorites.size}
          collectionsCount={collections.length}
        />
        <SettingsCard
          mode={mode}
          setMode={setMode}
          name={profileFields.name}
          email={profileFields.email}
          instagram={profileFields.instagram}
          website={profileFields.website}
          onNameChange={(value) => handleProfileFieldChange("name", value)}
          onEmailChange={(value) => handleProfileFieldChange("email", value)}
          onInstagramChange={(value) =>
            handleProfileFieldChange("instagram", value)
          }
          onWebsiteChange={(value) =>
            handleProfileFieldChange("website", value)
          }
          onLogout={handleLogout}
        />

        <PrimaryButton
          title={profileSaving ? "Saving..." : "Save profile"}
          onPress={handleSaveProfile}
          disabled={profileSaving}
          style={{ marginVertical: 12, alignSelf: "center" }}
        />

        <TestRevenueCat />

        <DangerZoneCard onDelete={handleDeleteAccount} loading={deleting} />
      </ScrollView>
    </SafeAreaView>
  );
}
