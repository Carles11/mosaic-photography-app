// @/2-features/auth/screens/VerifyEmailScreen.tsx - ULTRA SIMPLE
import { logEvent } from "@/4-shared/firebase";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

export function VerifyEmailScreen() {
  const router = useRouter();

  useEffect(() => {
    logEvent("verify_email_auto_redirect");

    // Show success message and redirect to login
    Alert.alert(
      "Account Created!",
      "Your account has been created successfully. You can now log in.",
      [
        {
          text: "Go to Login",
          onPress: () => {
            router.replace("/auth/login");
          },
        },
      ]
    );
  }, [router]);

  return null; // Or a simple loading indicator
}
