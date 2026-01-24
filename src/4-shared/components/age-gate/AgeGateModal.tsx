import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { logEvent } from "@/4-shared/firebase";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { ThemedView } from "../themed-view";
import { styles } from "./AgeGateModal.styles";

/**
 * AgeGateModal (native Modal overlay)
 * - Renders above all content (including bottom sheet) using RN Modal with transparent backdrop.
 * - onConfirm receives { confirmedAt: ISOString }
 * - onCancel called on backdrop press or Android back button
 */
export type AgeGatePayload = { confirmedAt: string };

export const AgeGateModal: React.FC<{
  visible: boolean;
  onConfirm: (payload: AgeGatePayload) => void;
  onCancel: () => void;
}> = ({ visible, onConfirm, onCancel }) => {
  const { user } = useAuthSession();
  const userState = user?.id ? "logged_in" : "anonymous";
  const [checked, setChecked] = useState(false);

  // Reset checkbox whenever modal opened and log shown event
  useEffect(() => {
    if (visible) {
      setChecked(false);
      try {
        logEvent("agegate_shown", { user_state: userState });
      } catch {
        /* swallow */
      }
    }
  }, [visible, userState]);

  if (!visible) return null;

  const handleCancel = () => {
    try {
      logEvent("agegate_canceled", { user_state: userState });
    } catch {
      /* swallow */
    }
    onCancel();
  };

  const handleConfirm = () => {
    if (!checked) return;
    const confirmedAt = new Date().toISOString();
    try {
      logEvent("agegate_confirmed", { user_state: userState, confirmedAt });
    } catch {
      /* swallow */
    }
    onConfirm({ confirmedAt });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        handleCancel();
      }}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <Pressable
        style={styles.overlay}
        onPress={() => {
          handleCancel();
        }}
      >
        {/* Stop propagation so presses on the dialog don't trigger backdrop */}
        <Pressable style={styles.dialog} onPress={() => {}}>
          <ThemedView style={{ padding: 20, alignItems: "center" }}>
            <ThemedText type="title" style={styles.title}>
              Content notice — Historical / Artistic Nudity
            </ThemedText>

            <ThemedText style={styles.body}>
              This gallery shows public-domain photographic works from the 19th
              and early 20th centuries that might include nudity presented for
              educational, historical, and artistic purposes only. Images are
              non-sexual in intent and shown with contextual information where
              available.
            </ThemedText>

            <Pressable
              onPress={() => setChecked((c) => !c)}
              style={styles.checkboxRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <ThemedText style={styles.checkboxText}>
                {checked ? "☑" : "☐"} I confirm I am 18 years or older (or meet
                the legal minimum age in my country) and wish to view historical
                & artistic nude images for educational or historical purposes.
              </ThemedText>
            </Pressable>

            <View style={styles.actionsRow}>
              <SecondaryButton
                title="Cancel"
                onPress={() => {
                  handleCancel();
                }}
              />
              <PrimaryButton
                title="Continue"
                onPress={() => {
                  handleConfirm();
                }}
                disabled={!checked}
                style={{ marginLeft: 8 }}
              />
            </View>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AgeGateModal;
