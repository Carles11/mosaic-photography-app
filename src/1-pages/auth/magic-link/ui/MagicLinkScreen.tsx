import { verifyMagicLink } from "@/2-features/auth/api/verifyMagicLink";
import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { styles } from "./MagicLinkScreen.styles";

export function MagicLinkScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { token, type } = useLocalSearchParams<{
    token: string;
    type: string;
  }>();

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string | null>(null);

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
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                fontFamily: theme.fontFamily,
                marginTop: 20,
              },
            ]}
          >
            Signing you in...
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1, backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: theme.text, fontFamily: theme.fontFamilyBold },
          ]}
        >
          Magic Link Login
        </Text>

        {status === "success" ? (
          <>
            <Text style={[styles.success, { color: theme.success }]}>
              Login successful! Redirecting to your account...
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
            <PrimaryButton
              title="Go to Login"
              onPress={() => router.push("/auth/login")}
            />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
