import { confirmEmailChange } from "@/2-features/auth/api/confirmEmailChange";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
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
import { styles } from "./ConfirmEmailChangeScreen.styles";

export function ConfirmEmailChangeScreen() {
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
            Confirming email change...
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
          Email Change Confirmation
        </Text>

        {status === "success" ? (
          <>
            <Text style={[styles.success, { color: theme.success }]}>
              Email change confirmed successfully! Your new email is now active.
            </Text>
            <PrimaryButton
              title="Go to Profile"
              onPress={() => router.push("/profile")}
            />
          </>
        ) : (
          <>
            <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
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
      </View>
    </KeyboardAvoidingView>
  );
}
