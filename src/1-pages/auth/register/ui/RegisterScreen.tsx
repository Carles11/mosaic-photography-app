import { registerWithEmail } from "@/2-features/auth/api/registerWithEmail";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
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
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: theme.text, fontFamily: theme.fontFamilyBold },
          ]}
        >
          Register
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
        <TextInput
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          placeholder="Repeat Password"
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

        {error && (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        )}

        {success && (
          <Text style={[styles.success, { color: theme.success }]}>
            Registration successful! Please check your email to verify your
            account.
          </Text>
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
      </View>
    </KeyboardAvoidingView>
  );
};
