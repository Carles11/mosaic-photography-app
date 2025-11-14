import { forgotPassword } from "@/2-features/auth/api/forgotPassword";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedTextInput } from "@/4-shared/components/inputs/text/ui/ThemedTextInput";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "./ForgotPasswordScreen.styles";

function validateEmail(email: string): boolean {
  // Simple email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Forgot Password",
    });
  }, [navigation]);

  // Analytics: track screen view on mount
  useEffect(() => {
    logEvent("forgot_password_screen_view");
  }, []);

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(false);

    // Analytics: attempt
    logEvent("forgot_password_attempt", {
      emailFilled: !!email,
    });

    if (!email) {
      setError("Please enter your email address.");
      logEvent("forgot_password_failure", {
        reason: "empty_email",
      });
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      logEvent("forgot_password_failure", {
        reason: "invalid_email",
        email,
      });
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    if (result.error) {
      setError(result.error);
      setSuccess(false);
      logEvent("forgot_password_failure", {
        error: result.error,
        email,
      });
    } else {
      setSuccess(true);
      logEvent("forgot_password_success", {
        email,
      });
    }
    setIsSubmitting(false);
  };

  const handleGoToLogin = () => {
    logEvent("forgot_password_goto_login_clicked");
    router.push("/auth/login");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={[styles.title]}>
          Forgot Password
        </ThemedText>

        <ThemedTextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
            setSuccess(false);
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          autoCorrect={false}
          returnKeyType="done"
          accessible
          accessibilityLabel="Enter your email address"
        />

        {error ? (
          <ThemedText style={[styles.error, { color: theme.error }]}>
            {error}
          </ThemedText>
        ) : null}

        {success ? (
          <ThemedText style={[styles.success, { color: theme.success }]}>
            If this email is registered, you will receive instructions to reset
            your password.
          </ThemedText>
        ) : null}

        <PrimaryButton
          title="Send Reset Email"
          onPress={handleForgotPassword}
          loading={isSubmitting}
          disabled={isSubmitting || !email}
        />

        <OnlyTextButton title="Back to Login" onPress={handleGoToLogin} />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
