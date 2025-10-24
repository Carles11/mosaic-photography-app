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
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text } from "react-native";
import { styles } from "./LoginScreen.styles";

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuthSession();
  const router = useRouter();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Login",
    });
  }, [navigation]);

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError(null);

    if (useMagicLink) {
      const result = await loginWithMagicLink(email);
      if (result.error) {
        setError(result.error);
      } else {
        setMagicLinkSent(true);
      }
    } else {
      const result = await loginWithEmail(email, password);
      if (result.error) {
        setError(result.error);
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
          <ThemedText
            style={[
              styles.title,
              { color: theme.text, fontFamily: theme.fontFamilyBold },
            ]}
          >
            Magic Link Sent!
          </ThemedText>
          <ThemedText style={[styles.success, { color: theme.success }]}>
            Check your email for a magic link to sign in.
          </ThemedText>
          <OnlyTextButton
            title="Back to Login"
            onPress={() => {
              setMagicLinkSent(false);
              setUseMagicLink(false);
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
      <ThemedView style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: theme.text, fontFamily: theme.fontFamilyBold },
          ]}
        >
          {useMagicLink ? "Sign in with Magic Link" : "Login to Mosaic"}
        </Text>

        <ThemedTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholderTextColor={theme.text}
        />

        {!useMagicLink && (
          <ThemedTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor={theme.text}
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
          onPress={() => setUseMagicLink(!useMagicLink)}
        />

        {!useMagicLink && (
          <OnlyTextButton
            title="Forgot Password?"
            onPress={() => {
              router.push("/auth/forgot-password");
            }}
          />
        )}

        <OnlyTextButton
          title="Don't have an account? Register"
          onPress={() => {
            router.push("/auth/register");
          }}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
};
