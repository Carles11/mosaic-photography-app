// @/2-features/auth/screens/PasswordResetScreen.styles.tsx
import { passwordReset } from "@/2-features/auth/api/passwordReset";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedTextInput } from "@/4-shared/components/inputs/text/ui/ThemedTextInput";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { logEvent } from "@/4-shared/firebase";
import { parseHashParams } from "@/4-shared/lib/parseHashParams";
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

  const searchParams = useLocalSearchParams<{
    access_token?: string; // This is what you're actually getting
    refresh_token?: string;
    type?: string;
    "#"?: string;
  }>();

  // Extract parameters from hash fragment (Supabase style)
  let hashParams: Record<string, string> = {};
  if ("#" in searchParams && typeof searchParams["#"] === "string") {
    hashParams = parseHashParams(searchParams["#"]);
  }

  const accessToken = hashParams.access_token || searchParams.access_token;
  const refreshToken = hashParams.refresh_token || searchParams.refresh_token;
  const tokenType = hashParams.type || searchParams.type;

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

  // Analytics: track screen view on mount
  useEffect(() => {
    logEvent("password_reset_screen_view", {
      hasAccessToken: Boolean(accessToken),
      hasTokenType: Boolean(tokenType),
      tokenType: tokenType,
    });
    console.log("[PasswordResetScreen] URL parameters:", {
      searchParams,
      hashParams,
      accessToken,
      tokenType,
    });
  }, [accessToken, tokenType]);

  const handlePasswordReset = async () => {
    setError(null);
    setSuccess(false);

    // Analytics: reset attempt
    logEvent("password_reset_attempt", {
      hasAccessToken: Boolean(accessToken),
      tokenType: tokenType,
    });

    if (!password || !repeatPassword) {
      setError("Please fill out both fields.");
      logEvent("password_reset_failure", {
        reason: "empty_fields",
      });
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      logEvent("password_reset_failure", {
        reason: "passwords_do_not_match",
      });
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, including a letter and a number."
      );
      logEvent("password_reset_failure", {
        reason: "weak_password",
      });
      return;
    }
    console.log("[PasswordResetScreen] ACCESSSSSSS token and type:", {
      accessToken,
      tokenType,
    });

    if (!accessToken) {
      setError(
        "Invalid or expired password reset link. Please request a new one."
      );
      logEvent("password_reset_failure", {
        reason: "missing_access_token",
      });
      return;
    }
    if (tokenType !== "recovery") {
      setError("Invalid reset link type. Please request a new password reset.");
      logEvent("password_reset_failure", {
        reason: "invalid_token_type",
        tokenType: tokenType,
      });
      return;
    }

    setIsSubmitting(true);

    const result = await passwordReset(password, accessToken, refreshToken);

    if (result.error) {
      setError(result.error);
      setSuccess(false);
      logEvent("password_reset_failure", {
        tokenType: tokenType,
        error: result.error,
      });
    } else {
      setSuccess(true);
      logEvent("password_reset_success", {
        tokenType: tokenType,
      });
      // Auto-redirect to login after success
      setTimeout(() => router.push("/auth/login"), 3000);
    }
    setIsSubmitting(false);
  };

  const handleGoToLogin = () => {
    logEvent("password_reset_goto_login_clicked");
    router.push("/auth/login");
  };

  const handleRequestNewLink = () => {
    logEvent("password_reset_request_new_link");
    router.push("/auth/forgot-password");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Reset Password</ThemedText>

        {!accessToken ? (
          <>
            <ThemedText
              style={[
                styles.error,
                { color: theme.error, textAlign: "center", marginBottom: 16 },
              ]}
            >
              Invalid or expired reset link.
            </ThemedText>
            <PrimaryButton
              title="Request New Reset Link"
              onPress={handleRequestNewLink}
            />
          </>
        ) : tokenType !== "recovery" ? (
          <>
            <ThemedText
              style={[
                styles.error,
                { color: theme.error, textAlign: "center", marginBottom: 16 },
              ]}
            >
              This link is not for password reset.
            </ThemedText>
            <PrimaryButton
              title="Go to Password Reset"
              onPress={handleRequestNewLink}
            />
          </>
        ) : (
          <>
            <ThemedText type="subtitle">
              Enter your new password below
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
            />

            {error ? (
              <ThemedText style={[styles.error, { color: theme.error }]}>
                {error}
              </ThemedText>
            ) : null}

            {success ? (
              <ThemedText style={[styles.success, { color: theme.success }]}>
                Password reset successful! Redirecting to login...
              </ThemedText>
            ) : null}

            <PrimaryButton
              title="Reset Password"
              onPress={handlePasswordReset}
              loading={isSubmitting}
              disabled={isSubmitting || !password || !repeatPassword}
            />
          </>
        )}

        <OnlyTextButton title="Back to Login" onPress={handleGoToLogin} />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
