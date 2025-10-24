import { passwordReset } from "@/2-features/auth/api/passwordReset";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "./PasswordResetScreen.styles";

function validatePassword(password: string): boolean {
  // Minimum 8 characters, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

export function PasswordResetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: theme.text, fontFamily: theme.fontFamilyBold },
          ]}
        >
          Reset Password
        </Text>
        <TextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
            setSuccess(false);
          }}
          placeholder="New Password"
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
              fontFamily: theme.fontFamily,
              backgroundColor: theme.buttonBackgroundColor,
            },
          ]}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          placeholderTextColor={theme.text}
        />
        <TextInput
          value={repeatPassword}
          onChangeText={(text) => {
            setRepeatPassword(text);
            setError(null);
            setSuccess(false);
          }}
          placeholder="Repeat New Password"
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
              fontFamily: theme.fontFamily,
              backgroundColor: theme.buttonBackgroundColor,
            },
          ]}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          placeholderTextColor={theme.text}
        />

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}
        {success ? (
          <Text style={[styles.success, { color: theme.success }]}>
            Password reset successful! You can now log in with your new
            password.
          </Text>
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
      </View>
    </KeyboardAvoidingView>
  );
}
