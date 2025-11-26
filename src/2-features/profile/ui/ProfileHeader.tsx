import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { styles } from "./ProfileHeader.styles";

type ProfileHeaderProps = {
  name: string | null | undefined;
  size?: number;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  size = 90,
}) => {
  const { theme, mode } = useTheme();

  const getInitial = () => {
    if (!name || name.length === 0) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.background]}
        style={[
          styles.gradient,
          { borderColor: mode === "light" ? theme.accent : "#fff" },
        ]}
        start={{ x: 0.1, y: 0.3 }}
        end={{ x: 1, y: 0.8 }}
      />
      <View
        style={[
          styles.avatarContainer,
          {
            backgroundColor: theme.background,
            shadowColor: theme.primary,
            top: (size / 2) * -1.15,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: mode === "light" ? theme.accent : "#fff",
          },
        ]}
      >
        <ThemedText
          style={[
            styles.initial,
            {
              color: mode === "light" ? theme.accent : "#fff",
              fontSize: size * 0.45,
              width: size,
              height: size / 1.5,
            },
          ]}
        >
          {getInitial()}
        </ThemedText>
      </View>
    </ThemedView>
  );
};
