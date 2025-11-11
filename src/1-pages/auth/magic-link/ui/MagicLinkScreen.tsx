import { verifyMagicLink } from "@/2-features/auth/api/verifyMagicLink";
import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { logEvent } from "@/4-shared/firebase";
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

  // Analytics: track screen view on mount
  useEffect(() => {
    logEvent("magic_link_screen_view", {
      token: Boolean(token),
      type: type || null,
    });
  }, [token, type]);

  useEffect(() => {
    if (token && type) {
      handleMagicLinkVerification();
    } else {
      setStatus("error");
      setError("Invalid magic link. Please request a new one.");
      logEvent("magic_link_verification_failure", {
        reason: "missing_token_or_type",
        tokenPresent: Boolean(token),
        typePresent: Boolean(type),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, type]);

  const handleMagicLinkVerification = async () => {
    if (!token) return;

    logEvent("magic_link_verification_attempt", { token, type });

    const result = await verifyMagicLink(token, type);

    if (result.error) {
      setStatus("error");
      setError(result.error);
      logEvent("magic_link_verification_failure", {
        token,
        type,
        error: result.error,
      });
    } else {
      setStatus("success");
      logEvent("magic_link_verification_success", {
        token,
        type,
      });
      // Redirect to home after successful login
      setTimeout(() => router.replace("/"), 2000);
    }
  };

  const handleGoToLogin = () => {
    logEvent("magic_link_goto_login_clicked");
    router.push("/auth/login");
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1, backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        {status === "verifying" ? (
          <>
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText style={[styles.title]}>Signing you in...</ThemedText>
          </>
        ) : (
          <>
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
                <PrimaryButton title="Go to Login" onPress={handleGoToLogin} />
              </>
            )}
          </>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
