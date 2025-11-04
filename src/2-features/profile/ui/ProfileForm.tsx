import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedTextInput } from "@/4-shared/components/inputs/text/ui/ThemedTextInput";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useFavorites } from "@/4-shared/context/favorites";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  createProfile,
  getProfile,
  ProfileData,
  updateProfile,
} from "../api/profileApi";
import styles from "./ProfileForm.styles";

type UserType = {
  id: string;
  email: string;
};

type ProfileFormProps = {
  user?: UserType | null;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const { favorites } = useFavorites();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    website: "",
    own_store_name: "",
    own_store_url: "",
  });
  const [databaseError, setDatabaseError] = useState(false);

  const canUseProfile = !!user && !!user.id && !!user.email;
  const router = useRouter();

  const createInitialProfile = useCallback(async () => {
    if (!canUseProfile || databaseError) return;
    try {
      const newProfile: ProfileData = {
        id: user.id,
        name: "",
        instagram: "",
        website: "",
        own_store_name: "",
        own_store_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const data = await createProfile(newProfile);
      setProfile(data);
    } catch (error: any) {
      showErrorToast("Failed to create initial profile");
    }
  }, [user, canUseProfile, databaseError]);

  const loadProfile = useCallback(async () => {
    if (!canUseProfile) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getProfile(user.id);
      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || "",
          instagram: data.instagram || "",
          website: data.website || "",
          own_store_name: data.own_store_name || "",
          own_store_url: data.own_store_url || "",
        });
      } else {
        await createInitialProfile();
      }
    } catch (error: any) {
      showErrorToast("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user, canUseProfile, createInitialProfile]);

  useEffect(() => {
    if (canUseProfile) loadProfile();
    else setLoading(false);
  }, [loadProfile, canUseProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (databaseError) {
      showErrorToast("Please set up the database first.");
      return;
    }
    if (!canUseProfile) {
      showErrorToast("No valid user found. Please log in again.");
      return;
    }
    if (!formData.name.trim()) {
      showErrorToast("Display name is required.");
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = {
        ...formData,
        updated_at: new Date().toISOString(),
      };
      await updateProfile(user.id, updatedProfile);
      showSuccessToast("Profile updated successfully!");
      await loadProfile();
    } catch (error: any) {
      showErrorToast("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  if (!canUseProfile) {
    return (
      <ThemedView style={styles.loadingContainer}>
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

  return (
    <KeyboardAwareScrollView
      bottomOffset={80}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {databaseError && (
        <ThemedView style={styles.databaseSetup}>
          <ThemedText style={styles.dbTitle}>
            🔧 Database Setup Required
          </ThemedText>
          <ThemedText>
            To use the profile functionality, you need to create the database
            table first.
          </ThemedText>
          <ThemedText style={styles.instructionsTitle}>
            Setup Instructions:
          </ThemedText>
          <ThemedText>
            1. Go to your Supabase Dashboard{"\n"}
            2. Navigate to the SQL Editor tab{"\n"}
            3. Copy and paste the SQL from{" "}
            <ThemedText style={styles.code}>DATABASE_SETUP.md</ThemedText>
            {"\n"}
            4. Click "Run" to execute the SQL{"\n"}
            5. Refresh this page
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Account Information
        </ThemedText>
        <View style={styles.infoItem}>
          <ThemedText style={styles.label}>Email:</ThemedText>
          <ThemedText style={styles.value}>{user.email}</ThemedText>
        </View>
        <View style={styles.infoItem}>
          <ThemedText style={styles.label}>Member since:</ThemedText>
          <ThemedText style={styles.value}>
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : "N/A"}
          </ThemedText>
        </View>
        <View style={styles.infoItem}>
          <ThemedText style={styles.label}>Favorites:</ThemedText>
          <ThemedText style={styles.value}>{favorites.size} images</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Profile Details
        </ThemedText>
        {databaseError && (
          <ThemedView style={styles.disabledForm}>
            <ThemedText>
              ⚠️ Form disabled until database setup is complete
            </ThemedText>
          </ThemedView>
        )}
        <View style={styles.container}>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Display Name</ThemedText>
            <ThemedTextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(v) => handleInputChange("name", v)}
              placeholder="Enter your display name"
              maxLength={100}
              editable={!databaseError && !saving}
              accessibilityLabel="Display Name"
            />
          </View>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Instagram</ThemedText>
            <ThemedTextInput
              style={styles.input}
              value={formData.instagram}
              onChangeText={(v) =>
                handleInputChange("instagram", v.replace("@", ""))
              }
              placeholder="your_username"
              maxLength={30}
              editable={!databaseError && !saving}
              accessibilityLabel="Instagram"
            />
          </View>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Website</ThemedText>
            <ThemedTextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(v) => handleInputChange("website", v)}
              placeholder="https://yourwebsite.com"
              editable={!databaseError && !saving}
              accessibilityLabel="Website"
            />
          </View>
          <PrimaryButton
            title={
              saving
                ? "Saving..."
                : databaseError
                ? "Database Setup Required"
                : "Update Profile"
            }
            onPress={handleSubmit}
            disabled={saving || databaseError || !formData.name.trim()}
          />
        </View>
      </ThemedView>
    </KeyboardAwareScrollView>
  );
}
