import { forgotPassword } from "@/2-features/auth/api/forgotPassword";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "./ForgotPasswordScreen.styles";

function validateEmail(email: string): boolean {
  // Simple email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email);
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
          Forgot Password
        </Text>

        <TextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
            setSuccess(false);
          }}
          placeholder="Email"
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
              fontFamily: theme.fontFamily,
              backgroundColor: theme.buttonBackgroundColor,
            },
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          placeholderTextColor={theme.text}
          autoCorrect={false}
          returnKeyType="done"
          accessible
          accessibilityLabel="Enter your email address"
        />

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        {success ? (
          <Text style={[styles.success, { color: theme.success }]}>
            If this email is registered, you will receive instructions to reset
            your password.
          </Text>
        ) : null}

        <PrimaryButton
          title="Send Reset Email"
          onPress={handleForgotPassword}
          loading={isSubmitting}
          disabled={isSubmitting || !email}
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
