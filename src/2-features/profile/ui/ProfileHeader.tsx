import { uploadAvatar } from "@/2-features/profile/api/avatarApi";
import { updateProfile } from "@/2-features/profile/api/profileApi";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { styles } from "./ProfileHeader.styles";

type ProfileHeaderProps = {
  name: string | null | undefined;
  avatarUrl?: string | null;
  onAvatarChange?: (newUrl: string) => void;
  size?: number;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  avatarUrl,
  onAvatarChange,
  size = 90,
}) => {
  const { theme, mode } = useTheme();
  const { user } = useAuthSession();
  const [uploading, setUploading] = useState(false);

  const getInitial = () => {
    if (!name || name.length === 0) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  const handlePickImage = async () => {
    if (!user?.id) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showErrorToast("Permission to access photos is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    setUploading(true);
    try {
      const publicUrl = await uploadAvatar(user.id, result.assets[0].uri);
      await updateProfile(user.id, {
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      });
      onAvatarChange?.(publicUrl);
      showSuccessToast("Avatar updated.");
    } catch {
      showErrorToast("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  const borderColor = mode === "light" ? theme.accent : "#fff";

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.background]}
        style={[styles.gradient, { borderColor }]}
        start={{ x: 0.1, y: 0.3 }}
        end={{ x: 1, y: 0.8 }}
      />

      <TouchableOpacity
        onPress={handlePickImage}
        disabled={uploading}
        activeOpacity={0.8}
        style={[
          styles.avatarContainer,
          {
            backgroundColor: theme.background,
            shadowColor: theme.primary,
            top: (size / 2) * -1.15,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor,
          },
        ]}
      >
        {uploading ? (
          <ActivityIndicator size="small" color={borderColor} />
        ) : avatarUrl ? (
          <ExpoImage
            source={{ uri: avatarUrl }}
            style={{
              width: size - 8,
              height: size - 8,
              borderRadius: (size - 8) / 2,
            }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <ThemedText
            style={[
              styles.initial,
              {
                color: borderColor,
                fontSize: size * 0.45,
                width: size,
                height: size / 1.5,
              },
            ]}
          >
            {getInitial()}
          </ThemedText>
        )}

        {/* Camera badge */}
        {!uploading && (
          <View style={[styles.cameraBadge, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.cameraBadgeText}>📷</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
};
