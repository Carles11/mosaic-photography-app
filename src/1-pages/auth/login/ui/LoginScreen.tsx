import { loginWithEmail } from "@/2-features/auth/api/loginWithEmail";
import {
  OnlyTextButton,
  PrimaryButton,
} from "@/4-shared/components/buttons/variants";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React, { useState } from "react";
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
  const { loading } = useAuthSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError(null);

    const result = await loginWithEmail(email, password);

    if (result.error) {
      setError(result.error);
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
          Login to Mosaic
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

        {error && (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        )}

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          loading={isSubmitting || loading}
          disabled={isSubmitting || loading || !email || !password}
        />

        <OnlyTextButton
          title="Forgot Password?"
          onPress={() => {
            // TODO: Navigate to ForgotPasswordScreen
          }}
        />

        <OnlyTextButton
          title="Don't have an account? Register"
          onPress={() => {
            // TODO: Navigate to RegisterScreen
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
