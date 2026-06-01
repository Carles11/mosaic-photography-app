import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import { styles } from "./SupportModal.styles";

const KO_FI_URL = "https://ko-fi.com/Q5Q6R6S40";

export const SupportModal: React.FC<{
  visible: boolean;
  onDismiss: () => void;
}> = ({ visible, onDismiss }) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleSupport = useCallback(async () => {
    try {
      logEvent("APP_support_modal_tapped", { destination: "kofi" });
      logEvent("APP_prompt_converted", {
        prompt_type: "support",
        conversion: "kofi_click",
      });
    } catch {}
    onDismiss();
    try {
      await WebBrowser.openBrowserAsync(KO_FI_URL);
    } catch {}
  }, [onDismiss]);

  const handleLearnMore = useCallback(() => {
    try {
      logEvent("APP_support_modal_tapped", { destination: "about" });
      logEvent("APP_prompt_converted", {
        prompt_type: "support",
        conversion: "about_click",
      });
    } catch {}
    onDismiss();
    router.push("/about" as any);
  }, [onDismiss, router]);

  const handleDismiss = useCallback(() => {
    try {
      logEvent("APP_support_modal_dismissed");
      logEvent("APP_prompt_dismissed", {
        prompt_type: "support",
        trigger: "app_open_threshold",
      });
    } catch {}
    onDismiss();
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleDismiss}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <ThemedView style={styles.inner}>
            <ThemedText style={styles.emoji}>☕</ThemedText>

            <ThemedText type="title" style={styles.title}>
              Enjoying Mosaic?
            </ThemedText>

            <ThemedText style={styles.body}>
              Mosaic is free and open-source. If it's brought you something
              worth keeping — a discovery, a favourite image, a quiet moment — a
              small contribution helps keep it running.
            </ThemedText>

            <TouchableOpacity
              style={[styles.supportButton, { backgroundColor: theme.accent }]}
              onPress={handleSupport}
              activeOpacity={0.82}
            >
              <ThemedText style={styles.supportButtonText}>
                Support Mosaic on Ko-fi
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.learnMoreButton, { borderColor: theme.border }]}
              onPress={handleLearnMore}
              activeOpacity={0.75}
            >
              <ThemedText style={styles.learnMoreText}>
                Learn more about Mosaic →
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismiss}
              activeOpacity={0.6}
            >
              <ThemedText style={styles.dismissText}>Maybe later</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SupportModal;
