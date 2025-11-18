import { SwitchButton } from "@/4-shared/components/buttons";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./SettingsCard.styles";

type SettingsCardProps = {
  mode: "light" | "dark";
  setMode: (m: "light" | "dark") => void;
  name?: string;
  email?: string;
  instagram?: string;
  website?: string;
  onNameChange?: (v: string) => void;
  onEmailChange?: (v: string) => void;
  onInstagramChange?: (v: string) => void;
  onWebsiteChange?: (v: string) => void;
  onLogout: () => void;
};

export const SettingsCard: React.FC<SettingsCardProps> = ({
  mode,
  setMode,
  name,
  email,
  instagram,
  website,
  onNameChange,
  onEmailChange,
  onInstagramChange,
  onWebsiteChange,
  onLogout,
}) => {
  const { theme } = useTheme();
  const [showNameInput, setShowNameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showInstaInput, setShowInstaInput] = useState(false);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
      {/* Title */}
      <View style={styles.sectionHeader}>
        <IconSymbol
          name="settings"
          type="material"
          size={22}
          color={theme.icon}
        />
        <ThemedText style={styles.sectionHeaderText}>Settings</ThemedText>
      </View>

      {/* Theme toggle row */}
      <View style={styles.row}>
        <View style={styles.rowIconLabel}>
          <IconSymbol
            name="brightness-4"
            type="material"
            size={22}
            color={theme.icon}
          />
          <ThemedText style={styles.rowLabel}>Theme</ThemedText>
        </View>
        <SwitchButton
          value={mode === "dark"}
          onValueChange={(v) => setMode(v ? "dark" : "light")}
        />
      </View>
      <View style={styles.divider} />

      {/* Name row */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowNameInput((v) => !v)}
      >
        <View style={styles.rowIconLabel}>
          <IconSymbol
            name="person"
            type="material"
            size={22}
            color={theme.icon}
          />
          <ThemedText style={styles.rowLabel}>Name</ThemedText>
        </View>
        <IconSymbol
          name="chevron-right"
          type="material"
          size={24}
          color={theme.icon}
        />
      </TouchableOpacity>
      {showNameInput && (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackgroundColor,
              color: theme.inputTextColor,
            },
          ]}
          value={name}
          placeholder="Update name..."
          placeholderTextColor={theme.inputPlaceholderColor}
          onChangeText={onNameChange}
          autoCapitalize="words"
          autoCorrect={false}
        />
      )}

      <View style={styles.divider} />

      {/* Email row */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowEmailInput((v) => !v)}
      >
        <View style={styles.rowIconLabel}>
          <IconSymbol
            name="alternate-email"
            type="material"
            size={22}
            color={theme.icon}
          />
          <ThemedText style={styles.rowLabel}>Email</ThemedText>
        </View>
        <IconSymbol
          name="chevron-right"
          type="material"
          size={24}
          color={theme.icon}
        />
      </TouchableOpacity>
      {showEmailInput && (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackgroundColor,
              color: theme.inputTextColor,
            },
          ]}
          value={email}
          placeholder="Update email..."
          placeholderTextColor={theme.inputPlaceholderColor}
          onChangeText={onEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
      )}

      <View style={styles.divider} />

      {/* Instagram row */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowInstaInput((v) => !v)}
      >
        <View style={styles.rowIconLabel}>
          <IconSymbol
            name="instagram"
            type="fontawesome"
            size={22}
            color="#E1306C"
          />
          <ThemedText style={styles.rowLabel}>Instagram</ThemedText>
        </View>
        <IconSymbol
          name="chevron-right"
          type="material"
          size={24}
          color={theme.icon}
        />
      </TouchableOpacity>
      {showInstaInput && (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackgroundColor,
              color: theme.inputTextColor,
            },
          ]}
          value={instagram}
          placeholder="Add Instagram..."
          placeholderTextColor={theme.inputPlaceholderColor}
          onChangeText={onInstagramChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      <View style={styles.divider} />

      {/* Website row */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowWebsiteInput((v) => !v)}
      >
        <View style={styles.rowIconLabel}>
          <IconSymbol
            name="link"
            type="material"
            size={22}
            color={theme.icon}
          />
          <ThemedText style={styles.rowLabel}>Website</ThemedText>
        </View>
        <IconSymbol
          name="chevron-right"
          type="material"
          size={24}
          color={theme.icon}
        />
      </TouchableOpacity>
      {showWebsiteInput && (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackgroundColor,
              color: theme.inputTextColor,
            },
          ]}
          value={website}
          placeholder="Add Website..."
          placeholderTextColor={theme.inputPlaceholderColor}
          onChangeText={onWebsiteChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      )}

      <View style={styles.divider} />

      {/* Logout row */}
      <TouchableOpacity style={styles.row} onPress={onLogout}>
        <View style={styles.rowIconLabel}>
          <IconSymbol
            name="logout"
            type="material"
            size={22}
            color={theme.icon}
          />
          <ThemedText style={styles.rowLabel}>Log out</ThemedText>
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
};
