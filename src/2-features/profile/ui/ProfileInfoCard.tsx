import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { styles } from "./ProfileInfoCard.styles";

type ProfileInfoCardProps = {
  name: string | null | undefined;
  email: string | null | undefined;
  createdAt: string | null | undefined; // ISO string or date (parseable)
};

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  name,
  email,
  createdAt,
}) => {
  const { theme } = useTheme();

  const getJoinedDate = () => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    // Format as DD.MM.YYYY
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
      <ThemedText style={styles.name}>{name}</ThemedText>
      <ThemedText style={styles.email}>{email}</ThemedText>
      <ThemedText style={styles.memberSince}>
        Member since {getJoinedDate()}
      </ThemedText>
    </ThemedView>
  );
};
