import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./DangerZoneCard.styles";

type DangerZoneCardProps = {
  onDelete: () => void;
  loading?: boolean;
};

export const DangerZoneCard: React.FC<DangerZoneCardProps> = ({
  onDelete,
  loading,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedView
      style={[
        styles.card,
        {
          borderColor: theme.error,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <IconSymbol
          name="warning"
          type="material"
          size={24}
          color={theme.error}
        />
        <ThemedText style={styles.sectionHeaderText}>Danger zone</ThemedText>
      </View>
      <ThemedText style={styles.hint}>
        Deleting your account is{" "}
        <ThemedText style={styles.bold}>irreversible.</ThemedText> Your data,
        including all your favorites and collections, will be permanently lost.
      </ThemedText>

      <TouchableOpacity
        style={styles.button}
        onPress={onDelete}
        disabled={loading}
        activeOpacity={0.75}
      >
        <IconSymbol
          name="delete-forever"
          type="material"
          size={20}
          color={theme.error}
        />
        <ThemedText style={styles.buttonText}>
          {loading ? "Deleting account..." : "Delete account"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};
