import { supabase } from "@/4-shared/api/supabaseClient";
import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useFavorites } from "@/4-shared/context/favorites";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import styles from "./ProfileForm.styles";

type UserType = {
  id: string;
  email: string;
};

type ProfileFormProps = {
  user?: UserType | null;
};

type ProfileData = {
  id: string;
  name: string;
  instagram: string;
  website: string;
  own_store_name: string;
  own_store_url: string;
  created_at: string;
  updated_at: string;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const { favorites } = useFavorites();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    website: "",
    own_store_name: "",
    own_store_url: "",
  });
  const [databaseError, setDatabaseError] = useState(false);

  // Defensive: Don't run any fetch if no user
  const canUseProfile = !!user && !!user.id && !!user.email;

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

      const { data, error } = await supabase
        .from("user_profiles")
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        if (error.code === "42P01") {
          setDatabaseError(true);
          setMessage({
            type: "error",
            text: "Database setup required. Please see instructions below.",
          });
        } else {
          setMessage({
            type: "error",
            text: `Failed to create profile: ${error.message}`,
          });
        }
      } else if (data) {
        setProfile(data as ProfileData);
      }
    } catch (error: any) {
      setMessage({ type: "error", text: "Failed to create initial profile" });
    }
  }, [user, canUseProfile, databaseError]);

  const loadProfile = useCallback(async () => {
    if (!canUseProfile) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        if (error.code === "42P01") {
          setDatabaseError(true);
          setMessage({
            type: "error",
            text: "Database setup required. Please see instructions below.",
          });
        } else {
          setMessage({
            type: "error",
            text: `Failed to load profile: ${error.message}`,
          });
        }
      } else if (data) {
        setProfile(data as ProfileData);
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
      setMessage({ type: "error", text: "Failed to load profile" });
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
      setMessage({ type: "error", text: "Please set up the database first." });
      return;
    }
    if (!canUseProfile) {
      setMessage({
        type: "error",
        text: "No valid user found. Please log in again.",
      });
      return;
    }
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Display name is required." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const updatedProfile = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_profiles")
        .upsert([{ id: user.id, ...updatedProfile }], { onConflict: "id" });

      if (error) {
        if (error.code === "42P01") {
          setDatabaseError(true);
          setMessage({
            type: "error",
            text: "Database setup required. Please see instructions below.",
          });
        } else {
          setMessage({
            type: "error",
            text: `Failed to update profile: ${error.message}`,
          });
        }
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await loadProfile();
      }
    } catch (error: any) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  // Loading state: show spinner
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  // Defensive: no user, no profile UI
  if (!canUseProfile) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.loadingText}>
          No user found. Please log in.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {message && (
        <ThemedView
          style={[
            styles.message,
            message.type === "error" ? styles.error : styles.success,
          ]}
        >
          <ThemedText>{message.text}</ThemedText>
        </ThemedView>
      )}

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

        <View style={styles.field}>
          <ThemedText style={styles.label}>Display Name</ThemedText>
          <TextInput
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
          <TextInput
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
          <TextInput
            style={styles.input}
            value={formData.website}
            onChangeText={(v) => handleInputChange("website", v)}
            placeholder="https://yourwebsite.com"
            editable={!databaseError && !saving}
            accessibilityLabel="Website"
          />
        </View>
        {/* Uncomment if you want to enable store fields
        <View style={styles.field}>
          <ThemedText style={styles.label}>Store Name</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.own_store_name}
            onChangeText={(v) => handleInputChange("own_store_name", v)}
            placeholder="Enter your store name"
            maxLength={100}
            editable={!databaseError && !saving}
            accessibilityLabel="Store Name"
          />
        </View>
        <View style={styles.field}>
          <ThemedText style={styles.label}>Store URL</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.own_store_url}
            onChangeText={(v) => handleInputChange("own_store_url", v)}
            placeholder="https://yourstore.com"
            editable={!databaseError && !saving}
            accessibilityLabel="Store URL"
          />
        </View>
        */}
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
          style={styles.submitButton}
        />
      </ThemedView>
    </ScrollView>
  );
}
