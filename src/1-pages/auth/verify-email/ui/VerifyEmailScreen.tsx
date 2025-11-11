import { verifyEmail } from "@/2-features/auth/api/verifyEmail";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants/index";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

  // Analytics: track screen view on mount
  useEffect(() => {
    logEvent("verify_email_screen_view", {
      token: Boolean(token),
      type: type || null,
    });
  }, [token, type]);

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
      // Analytics: Invalid link attempted
      logEvent("verify_email_failure", {
        reason: "missing_token_or_type",
        tokenPresent: Boolean(token),
        typePresent: Boolean(type),
      });
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, type]);

  const handleVerification = async () => {
    if (!token) return;
    // Analytics: Verification attempt
    logEvent("verify_email_attempt", { token, type });

    const result = await verifyEmail(token, type);

    if (result.error) {
      setStatus("error");
      setError(result.error);
      // Analytics: Verification failed
      logEvent("verify_email_failure", {
        token,
        type,
        error: result.error,
      });
    } else {
      setStatus("success");
      // Analytics: Verification succeeded
      logEvent("verify_email_success", {
        token,
        type,
      });
    }
  };

  const handleGoToLogin = () => {
    logEvent("verify_email_goto_login_clicked");
    router.push("/auth/login");
  };

  const handleRequestNewVerification = () => {
    logEvent("verify_email_request_new_verification");
    router.push("/auth/register");
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
            <PrimaryButton title="Go to Login" onPress={handleGoToLogin} />
          </>
        ) : (
          <>
            <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
            <PrimaryButton
              title="Request New Verification"
              onPress={handleRequestNewVerification}
            />
            <OnlyTextButton title="Back to Login" onPress={handleGoToLogin} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
