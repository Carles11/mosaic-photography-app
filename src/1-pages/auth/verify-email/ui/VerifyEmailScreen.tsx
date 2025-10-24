import { verifyEmail } from "@/2-features/auth/api/verifyEmail";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { styles } from "./VerifyEmailScreen.styles"; // Reuse existing styles

export function VerifyEmailScreen() {
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
      title: "Verify Email",
    });
  }, [navigation]);

  useEffect(() => {
    if (token && type) {
      handleVerification();
    } else {
      setStatus("error");
      setError(
        "Invalid verification link. Please check your email or request a new verification."
      );
    }
  }, [token, type]);

  const handleVerification = async () => {
    if (!token) return;

    const result = await verifyEmail(token, type);

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
            Verifying your email...
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
          Email Verification
        </Text>

        {status === "success" ? (
          <>
            <Text style={[styles.success, { color: theme.success }]}>
              Email verified successfully! You can now log in to your account.
            </Text>
            <PrimaryButton
              title="Go to Login"
              onPress={() => router.push("/auth/login")}
            />
          </>
        ) : (
          <>
            <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
            <PrimaryButton
              title="Request New Verification"
              onPress={() => router.push("/auth/register")}
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
