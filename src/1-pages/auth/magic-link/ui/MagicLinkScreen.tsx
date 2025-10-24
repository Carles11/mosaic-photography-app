import { verifyMagicLink } from "@/2-features/auth/api/verifyMagicLink";
import { PrimaryButton } from "@/4-shared/components/buttons/variants";
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
import { styles } from "./MagicLinkScreen.styles";

export function MagicLinkScreen() {
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
      title: "Magic Link Login",
    });
  }, [navigation]);

  useEffect(() => {
    if (token && type) {
      handleMagicLinkVerification();
    } else {
      setStatus("error");
      setError("Invalid magic link. Please request a new one.");
    }
  }, [token, type]);

  const handleMagicLinkVerification = async () => {
    if (!token) return;

    const result = await verifyMagicLink(token, type);

    if (result.error) {
      setStatus("error");
      setError(result.error);
    } else {
      setStatus("success");
      // Redirect to home after successful login
      setTimeout(() => router.replace("/"), 2000);
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
          <ThemedText style={[styles.title]}>Signing you in...</ThemedText>
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
          Magic Link Login
        </ThemedText>

        {status === "success" ? (
          <>
            <ThemedText style={[styles.success, { color: theme.success }]}>
              Login successful! Redirecting to your account...
            </ThemedText>
          </>
        ) : (
          <>
            <ThemedText style={[styles.error, { color: theme.error }]}>
              {error}
            </ThemedText>
            <PrimaryButton
              title="Go to Login"
              onPress={() => router.push("/auth/login")}
            />
          </>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
