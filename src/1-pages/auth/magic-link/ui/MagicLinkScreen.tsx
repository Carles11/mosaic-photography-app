// @/2-features/auth/screens/MagicLinkScreen.tsx
import { verifyMagicLink } from "@/2-features/auth/api/verifyMagicLink";
import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { logEvent } from "@/4-shared/firebase";
import { parseHashParams } from "@/4-shared/lib/parseHashParams";
import { getInitialDeepLinkParamsAsync } from "@/4-shared/routing/getDeepLinkParams";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import {
  clearMagicLinkEmail,
  getMagicLinkEmail,
  saveMagicLinkEmail,
} from "@/4-shared/utility/emailStorage";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { styles } from "./MagicLinkScreen.styles";

export function MagicLinkScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const searchParams = useLocalSearchParams<{
    token?: string;
    type?: string;
    access_token?: string;
    error?: string;
    error_code?: string;
    error_description?: string;
    "#": string;
  }>();

  let magicParams: Record<string, string> = {};
  if ("#" in searchParams && typeof searchParams["#"] === "string") {
    magicParams = parseHashParams(searchParams["#"]);
    console.log("[MagicLinkScreen] Extracted hash params:", magicParams);
  }

  // New: Email state from storage or manual input
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [emailInput, setEmailInput] = useState<string>("");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string | null>(null);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);
  const [paramsFromUrl, setParamsFromUrl] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    console.log("[MagicLinkScreen] === COMPONENT RENDERED ===");
    navigation.setOptions({
      title: "Magic Link Login",
    });
  }, [navigation]);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      setDeepLinkUrl(url);
      console.log("[MagicLinkScreen] Linking.getInitialURL:", url);
    });
  }, []);

  // Load stored email on mount
  useEffect(() => {
    let didCancel = false;
    (async () => {
      const stored = await getMagicLinkEmail();
      if (!didCancel) {
        setEmail(stored ?? undefined);
        console.log("[MagicLinkScreen] Loaded stored email:", stored);
      }
    })();
    return () => {
      didCancel = true;
    };
  }, []);

  // Main verification effect
  useEffect(() => {
    const verifyFromParams = async () => {
      if (verificationAttempted) {
        console.log(
          "[MagicLinkScreen] Verification already attempted, skipping"
        );
        return;
      }

      console.log("[MagicLinkScreen] Starting verification from params...");

      // Get parameters from all possible sources
      const urlParams = await getInitialDeepLinkParamsAsync();
      setParamsFromUrl(urlParams);
      console.log("[MagicLinkScreen] Deep link params:", urlParams);

      // Extract token and type with priority to deep link params
      const token =
        urlParams?.access_token ||
        urlParams?.token ||
        magicParams.access_token ||
        magicParams.token ||
        searchParams.access_token ||
        searchParams.token;
      const type =
        urlParams?.type || magicParams.type || searchParams.type || "magiclink";

      console.log("[MagicLinkScreen] Final extracted params:", { token, type });

      if (!token) {
        console.log("[MagicLinkScreen] No token found in any source");
        setStatus("error");
        setError("Invalid magic link. No authentication token found.");
        setVerificationAttempted(true);
        logEvent("magic_link_verification_failure", {
          reason: "missing_token",
          hasDeepLinkParams: !!urlParams,
          hasMagicParams: !!Object.keys(magicParams).length,
          hasSearchParams: !!Object.keys(searchParams).length,
        });
        return;
      }

      // Get stored email
      const storedEmail = await getMagicLinkEmail();
      if (!storedEmail) {
        console.log("[MagicLinkScreen] No stored email found");
        setStatus("error");
        setError("Session expired. Please request a new magic link.");
        setVerificationAttempted(true);
        return;
      }

      setEmail(storedEmail);
      setVerificationAttempted(true);

      // Perform verification
      await handleMagicLinkVerification(storedEmail, token, type);
    };

    if (!verificationAttempted && email !== undefined) {
      verifyFromParams();
    }
  }, [email, verificationAttempted, magicParams, searchParams]);

  // Update the handleMagicLinkVerification function in your MagicLinkScreen component:

  const handleMagicLinkVerification = async (
    emailParam: string,
    tokenParam: string,
    typeParam: string
  ) => {
    setStatus("verifying");
    setError(null);
    setVerifyResult(null);

    console.log("[MagicLinkScreen] handleMagicLinkVerification called with:", {
      emailParam,
      tokenParam: tokenParam ? `${tokenParam.substring(0, 10)}...` : "empty",
      typeParam,
    });

    logEvent("magic_link_verification_attempt", {
      email: emailParam,
      token_length: tokenParam?.length || 0,
      type: typeParam,
    });

    try {
      // Extract refresh token from URL parameters if available
      const refreshToken =
        paramsFromUrl?.refresh_token || magicParams.refresh_token;
      console.log("[MagicLinkScreen] Refresh token available:", !!refreshToken);

      const result = await verifyMagicLink(
        emailParam,
        tokenParam,
        typeParam,
        refreshToken
      );
      setVerifyResult(result);
      console.log("[MagicLinkScreen] verifyMagicLink result:", result);

      if (result && result.error) {
        setStatus("error");
        setError(result.error);
        logEvent("magic_link_verification_failure", {
          email: emailParam,
          type: typeParam,
          error: result.error,
        });
      } else {
        setStatus("success");
        await clearMagicLinkEmail(); // Cleanup: remove stored email after successful login
        logEvent("magic_link_verification_success", {
          email: emailParam,
          type: typeParam,
        });
        setTimeout(() => router.replace("/"), 2000);
      }
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Unexpected error during verification");
      logEvent("magic_link_verification_failure", {
        email: emailParam,
        type: typeParam,
        error: e?.message || "Unexpected JS error",
      });
      console.log("[MagicLinkScreen] Caught JS error:", e);
    }
  };

  const handleGoToLogin = () => {
    logEvent("magic_link_goto_login_clicked");
    router.push("/auth/login");
  };

  // Manual email entry fallback UI if AsyncStorage not found
  const handleEmailInputSubmit = () => {
    if (emailInput) {
      saveMagicLinkEmail(emailInput);
      setEmail(emailInput);
      setError(null);
      setVerificationAttempted(false); // Reset to allow new verification attempt
    } else {
      setError("Please enter your email address to continue.");
    }
  };

  const handleRetryVerification = () => {
    setVerificationAttempted(false);
    setError(null);
    setStatus("verifying");
  };

  const debugBlock = (
    <ThemedView
      style={{
        backgroundColor: "#222",
        margin: 16,
        borderRadius: 8,
        padding: 8,
        opacity: 0.85,
      }}
    >
      <ThemedText
        style={{ fontFamily: "monospace", fontSize: 10, color: "#39f" }}
      >
        [DEBUG] Deep Link URL:{"\n"}
        {deepLinkUrl ?? "n/a"}
        {"\n"}
        [DEBUG] useLocalSearchParams:{"\n"}
        {JSON.stringify(searchParams, null, 2)}
        {"\n"}
        [DEBUG] Extracted Hash Params:{"\n"}
        {JSON.stringify(magicParams, null, 2)}
        {"\n"}
        [DEBUG] Params from URL:{"\n"}
        {JSON.stringify(paramsFromUrl, null, 2)}
        {"\n"}
        [DEBUG] State Email: {email}
        {"\n"}
        [DEBUG] Verify Result:{"\n"}
        {JSON.stringify(verifyResult, null, 2)}
        {"\n"}
        [DEBUG] Status: {status}
        {"\n"}
        [DEBUG] Error: {error}
        {"\n"}
        [DEBUG] Verification Attempted: {verificationAttempted.toString()}
      </ThemedText>
    </ThemedView>
  );

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1, backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.container}>
        {status === "verifying" && !email && (
          <>
            <ThemedText style={[styles.title]}>
              Enter your email to verify login
            </ThemedText>
            <ThemedText
              style={[styles.subtitle, { color: theme.text, marginBottom: 16 }]}
            >
              We need your email to match with the magic link you received
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.border,
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 6,
                },
              ]}
              value={emailInput}
              placeholder="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmailInput}
              onSubmitEditing={handleEmailInputSubmit}
              editable={status === "verifying"}
            />
            <PrimaryButton
              title="Verify"
              onPress={handleEmailInputSubmit}
              disabled={!emailInput}
            />
            {error && (
              <ThemedText style={[styles.error, { color: theme.error }]}>
                {error}
              </ThemedText>
            )}
            {debugBlock}
          </>
        )}
        {status === "verifying" && email && (
          <>
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText style={[styles.title]}>Signing you in...</ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.text }]}>
              Verifying your magic link for {email}
            </ThemedText>
            {debugBlock}
          </>
        )}
        {status !== "verifying" && (
          <>
            <ThemedText type="title" style={[styles.title]}>
              Magic Link Login
            </ThemedText>
            {status === "success" ? (
              <>
                <ThemedText style={[styles.success, { color: theme.success }]}>
                  Login successful! Redirecting to your account...
                </ThemedText>
              </>
            ) : (
              <>
                <ThemedText style={[styles.error, { color: theme.error }]}>
                  {error}
                </ThemedText>
                <PrimaryButton
                  title="Try Again"
                  onPress={handleRetryVerification}
                  style={{ marginBottom: 10 }}
                />
                <PrimaryButton title="Go to Login" onPress={handleGoToLogin} />
              </>
            )}
            {debugBlock}
          </>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
