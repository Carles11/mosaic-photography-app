import { confirmEmailChange } from "@/2-features/auth/api/confirmEmailChange";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./ConfirmEmailChangeScreen.styles";

export function ConfirmEmailChangeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const { token, type } = useLocalSearchParams<{
    token: string;
    type: string;
  }>();

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Confirm Email Change",
    });
  }, [navigation]);

  useEffect(() => {
    if (token && type) {
      handleEmailChangeConfirmation();
    } else {
      setStatus("error");
      setError("Invalid email change confirmation link.");
    }
  }, [token, type]);

  const handleEmailChangeConfirmation = async () => {
    if (!token) return;

    const result = await confirmEmailChange(token, type);

    if (result.error) {
      setStatus("error");
      setError(result.error);
    } else {
      setStatus("success");
    }
  };

  if (status === "verifying") {
    return (
      <KeyboardAvoidingView
        style={[{ flex: 1, backgroundColor: theme.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedView style={[styles.container]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={[styles.title]}>
            Confirming email change...
          </ThemedText>
        </ThemedView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1, backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={[styles.title]}>
          Email Change Confirmation
        </ThemedText>

        {status === "success" ? (
          <>
            <ThemedText style={[styles.success, { color: theme.success }]}>
              Email change confirmed successfully! Your new email is now active.
            </ThemedText>
            <PrimaryButton
              title="Go to Profile"
              onPress={() => router.push("/profile")}
            />
          </>
        ) : (
          <>
            <ThemedText style={[styles.error, { color: theme.error }]}>
              {error}
            </ThemedText>
            <PrimaryButton
              title="Go to Profile"
              onPress={() => router.push("/profile")}
            />
            <OnlyTextButton
              title="Back to Login"
              onPress={() => router.push("/auth/login")}
            />
          </>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
