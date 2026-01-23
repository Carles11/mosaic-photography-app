import { loginWithEmail } from "@/2-features/auth/api/loginWithEmail";
import { loginWithMagicLink } from "@/2-features/auth/api/loginWithMagicLink";
import {
  OnlyTextButton,
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedTextInput } from "@/4-shared/components/inputs/text/ui/ThemedTextInput";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "./LoginScreen.styles";

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuthSession();
  const router = useRouter();
  const navigation = useNavigation();
  const { returnTo, feature, from } = useLocalSearchParams<{
    returnTo?: string;
    feature?: string;
    from?: string;
  }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const sessionStartRef = useRef<number>(Date.now());

  // Track screen land and session duration
  useEffect(() => {
    logEvent("login_screen_view", { timestamp: Date.now() });
    navigation.setOptions({
      title: "Login",
    });
    return () => {
      logEvent("login_screen_session", {
        duration: ((Date.now() - sessionStartRef.current) / 1000).toFixed(1),
      });
    };
  }, [navigation]);

  // Redirect to appropriate screen if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (returnTo === "subscription") {
        // Redirect to subscription screen with context
        router.replace({
          pathname: "/subscription",
          params: { feature: feature || "", from: from || "login" },
        });
      } else {
        // Default redirect to home
        router.replace("/");
      }
    }
  }, [user, loading, router, returnTo, feature, from]);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError(null);

    const method = useMagicLink ? "magic_link" : "email_password";
    logEvent("login_attempt", { method, email });

    if (useMagicLink) {
      const result = await loginWithMagicLink(email);
      if (result.error) {
        setError(result.error);
        logEvent("login_failure", { method, error: result.error, email });
      } else {
        setMagicLinkSent(true);
        logEvent("magic_link_sent", { email });
      }
    } else {
      const result = await loginWithEmail(email, password);
      if (result.error) {
        setError(result.error);
        logEvent("login_failure", { method, error: result.error, email });
      } else {
        logEvent("login_success", { method, email });
      }
    }
    setIsSubmitting(false);
  };

  // If loading, you can show a spinner or return null
  if (loading) return null;

  if (magicLinkSent) {
    return (
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: theme.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>Magic Link Sent!</ThemedText>
          <ThemedText style={[styles.success, { color: theme.success }]}>
            Check your email for a magic link to sign in.
          </ThemedText>
          <OnlyTextButton
            title="Back to Login"
            onPress={() => {
              setMagicLinkSent(false);
              setUseMagicLink(false);
              logEvent("back_to_login_clicked");
            }}
          />
          <OnlyTextButton
            title="Back to Gallery"
            onPress={() => {
              logEvent("back_home_clicked", { location: "magic_link" });
              router.replace("/");
            }}
          />
        </ThemedView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.containerTop}>
        <ThemedText style={styles.title}>
          {useMagicLink ? "Sign in with Magic Link" : "Login to Mosaic"}
        </ThemedText>
        <ThemedTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        {!useMagicLink && (
          <ThemedTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
          />
        )}

        {error && (
          <ThemedText style={[styles.error, { color: theme.error }]}>
            {error}
          </ThemedText>
        )}

        <PrimaryButton
          title={
            loading || isSubmitting
              ? useMagicLink
                ? "Sending..."
                : "Logging in..."
              : useMagicLink
                ? "Send Magic Link"
                : "Login"
          }
          onPress={handleLogin}
          loading={isSubmitting || loading}
          disabled={
            isSubmitting || loading || !email || (!useMagicLink && !password)
          }
        />

        <SecondaryButton
          title={
            useMagicLink ? "Use password instead" : "Use magic link instead"
          }
          onPress={() => {
            setUseMagicLink(!useMagicLink);
            logEvent("toggle_login_method", { useMagicLink: !useMagicLink });
          }}
        />

        {!useMagicLink && (
          <OnlyTextButton
            title="Forgot Password?"
            onPress={() => {
              logEvent("forgot_password_clicked");
              router.push("/auth/forgot-password");
            }}
          />
        )}

        <OnlyTextButton
          title="Don't have an account? Register"
          onPress={() => {
            logEvent("register_clicked");
            router.push("/auth/register");
          }}
        />
      </ThemedView>
      <ThemedView style={styles.containerBottom}>
        <OnlyTextButton
          title="Back to Home Gallery"
          onPress={() => {
            logEvent("back_home_clicked", { location: "bottom" });
            router.replace("/");
          }}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
};
