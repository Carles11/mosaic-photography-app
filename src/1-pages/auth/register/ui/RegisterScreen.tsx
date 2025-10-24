import { registerWithEmail } from "@/2-features/auth/api/registerWithEmail";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedTextInput } from "@/4-shared/components/inputs/text/ui/ThemedTextInput";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "./RegisterScreen.styles";

export const RegisterScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuthSession();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      title: "Register",
    });
  }, [navigation]);

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleRegister = async () => {
    setError(null);

    if (!email || !password || !repeatPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await registerWithEmail(email, password);

    if (result.error) {
      setError(result.error);
      setSuccess(false);
    } else {
      setSuccess(true);
      setError(null);
    }
    setIsSubmitting(false);
  };

  // If loading, you can show a spinner or return null
  if (loading) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={[styles.title]}>
          Register
        </ThemedText>

        <ThemedTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholderTextColor={theme.text}
        />
        <ThemedTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor={theme.text}
        />
        <ThemedTextInput
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          placeholder="Repeat Password"
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor={theme.text}
        />

        {error && (
          <ThemedText style={[styles.error, { color: theme.error }]}>
            {error}
          </ThemedText>
        )}

        {success && (
          <ThemedText style={[styles.success, { color: theme.success }]}>
            Registration successful! Please check your email to verify your
            account.
          </ThemedText>
        )}

        <PrimaryButton
          title="Register"
          onPress={handleRegister}
          loading={isSubmitting}
          disabled={isSubmitting || !email || !password || !repeatPassword}
        />

        <OnlyTextButton
          title="Already have an account? Login"
          onPress={() => {
            router.push("/auth/login");
          }}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
};
