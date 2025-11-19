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

  const initialToken =
    magicParams.access_token ||
    magicParams.token ||
    searchParams.token ||
    searchParams.access_token ||
    undefined;
  const initialType = magicParams.type || searchParams.type || "magiclink";

  // New: Email state from storage or manual input
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [emailInput, setEmailInput] = useState<string>("");
  const [token, setToken] = useState<string | undefined>(initialToken);
  const [type, setType] = useState<string | undefined>(initialType);
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string | null>(null);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);
  const [paramsFromUrl, setParamsFromUrl] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);

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

  useEffect(() => {
    if (!token) {
      getInitialDeepLinkParamsAsync().then((params) => {
        setParamsFromUrl(params);
        console.log(
          "[MagicLinkScreen] getInitialDeepLinkParamsAsync returned:",
          params
        );

        if (params.token || params.access_token) {
          setToken(params.token || params.access_token);
        } else {
          console.log(
            "[MagicLinkScreen] No token/access_token in deep link params"
          );
        }

        if (params.type) {
          setType(params.type);
        } else {
          setType("magiclink");
        }

        if (params.error || params.error_code || params.error_description) {
          console.log("[MagicLinkScreen] ERROR PARAMS in deep link params:", {
            error: params.error,
            error_code: params.error_code,
            error_description: params.error_description,
          });
        }
      });
    }
  }, [token]);

  useEffect(() => {
    if (paramsFromUrl) {
      console.log(
        "[MagicLinkScreen] paramsFromUrl state set to:",
        paramsFromUrl
      );
    }
  }, [paramsFromUrl]);

  // New: Try to load stored email on mount
  useEffect(() => {
    let didCancel = false;
    (async () => {
      const stored = await getMagicLinkEmail();
      if (!didCancel) setEmail(stored ?? undefined);
    })();
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    console.log("[MagicLinkScreen] token state changed:", token);
    console.log("[MagicLinkScreen] type state changed:", type);
  }, [token, type]);

  // Main effect: react to email+token+type ready
  useEffect(() => {
    if (token && type && email) {
      handleMagicLinkVerification(email, token, type);
    } else if ((token && !type) || (type && !token)) {
      setType("magiclink");
    } else if (!token) {
      setStatus("error");
      setError("Invalid magic link. Please request a new one.");
      logEvent("magic_link_verification_failure", {
        reason: "missing_token_or_type",
        tokenPresent: Boolean(token),
        typePresent: Boolean(type),
      });
      console.log("[MagicLinkScreen] ERROR: missing token", { token, type });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token, type]);

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
      tokenParam,
      typeParam,
    });

    logEvent("magic_link_verification_attempt", {
      email: emailParam,
      token: tokenParam,
      type: typeParam,
    });

    try {
      const result = await verifyMagicLink(emailParam, tokenParam, typeParam);
      setVerifyResult(result);
      console.log("[MagicLinkScreen] verifyMagicLink result:", result);

      if (result && result.error) {
        setStatus("error");
        setError(result.error);
        logEvent("magic_link_verification_failure", {
          email: emailParam,
          token: tokenParam,
          type: typeParam,
          error: result.error,
        });
      } else if (result) {
        setStatus("success");
        clearMagicLinkEmail(); // Cleanup: remove stored email after successful login
        logEvent("magic_link_verification_success", {
          email: emailParam,
          token: tokenParam,
          type: typeParam,
        });
        setTimeout(() => router.replace("/"), 2000);
      } else {
        setStatus("error");
        setError("Unknown server response.");
        console.log("[MagicLinkScreen] ERROR: Unknown server response", result);
      }
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Unexpected error");
      logEvent("magic_link_verification_failure", {
        email: emailParam,
        token: tokenParam,
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
    } else {
      setError("Please enter your email address to continue.");
    }
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
        [DEBUG] State Token: {token}
        {"\n"}
        [DEBUG] State Type: {type}
        {"\n"}
        [DEBUG] State Email: {email}
        {"\n"}
        [DEBUG] Verify Result:{"\n"}
        {JSON.stringify(verifyResult, null, 2)}
        {"\n"}
        [DEBUG] Status: {status}
        {"\n"}
        [DEBUG] Error: {error}
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
