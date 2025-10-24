import { loginWithEmail } from "@/2-features/auth/api/loginWithEmail";
import { loginWithMagicLink } from "@/2-features/auth/api/loginWithMagicLink";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "./LoginScreen.styles";

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuthSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

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
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontFamily: theme.fontFamilyBold },
            ]}
          >
            Magic Link Sent!
          </Text>
          <Text style={[styles.success, { color: theme.success }]}>
            Check your email for a magic link to sign in.
          </Text>
          <OnlyTextButton
            title="Back to Login"
            onPress={() => {
              setMagicLinkSent(false);
              setUseMagicLink(false);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

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
          {useMagicLink ? "Sign in with Magic Link" : "Login to Mosaic"}
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
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
          autoComplete="email"
          placeholderTextColor={theme.text}
        />

        {!useMagicLink && (
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            style={[
              styles.input,
              {
                borderColor: theme.border,
                color: theme.text,
                fontFamily: theme.fontFamily,
                backgroundColor: theme.buttonBackgroundColor,
              },
            ]}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor={theme.text}
          />
        )}

        {error && (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
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

        <OnlyTextButton
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
      </View>
    </KeyboardAvoidingView>
  );
};
