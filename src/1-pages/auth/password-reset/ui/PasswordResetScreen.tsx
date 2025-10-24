import { passwordReset } from "@/2-features/auth/api/passwordReset";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedTextInput } from "@/4-shared/components/inputs/text/ui/ThemedTextInput";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "./PasswordResetScreen.styles";

function validatePassword(password: string): boolean {
  // Minimum 8 characters, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

export function PasswordResetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const { token } = useLocalSearchParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Password Reset",
    });
  }, [navigation]);

  const handlePasswordReset = async () => {
    setError(null);
    setSuccess(false);

    if (!password || !repeatPassword) {
      setError("Please fill out both fields.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, including a letter and a number."
      );
      return;
    }
    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    setIsSubmitting(true);
    const result = await passwordReset(token, password);
    if (result.error) {
      setError(result.error);
      setSuccess(false);
    } else {
      setSuccess(true);
    }
    setIsSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={[styles.title]}>
          Reset Password
        </ThemedText>
        <ThemedTextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
            setSuccess(false);
          }}
          placeholder="New Password"
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          placeholderTextColor={theme.text}
        />
        <ThemedTextInput
          value={repeatPassword}
          onChangeText={(text) => {
            setRepeatPassword(text);
            setError(null);
            setSuccess(false);
          }}
          placeholder="Repeat New Password"
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          placeholderTextColor={theme.text}
        />

        {error ? (
          <ThemedText style={[styles.error, { color: theme.error }]}>
            {error}
          </ThemedText>
        ) : null}
        {success ? (
          <ThemedText style={[styles.success, { color: theme.success }]}>
            Password reset successful! You can now log in with your new
            password.
          </ThemedText>
        ) : null}

        <PrimaryButton
          title="Reset Password"
          onPress={handlePasswordReset}
          loading={isSubmitting}
          disabled={isSubmitting || !password || !repeatPassword}
        />

        <OnlyTextButton
          title="Back to Login"
          onPress={() => {
            router.push("/auth/login");
          }}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
