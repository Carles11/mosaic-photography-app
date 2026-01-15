import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
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
  const [checked, setChecked] = useState(false);

  // Reset checkbox whenever modal opened
  useEffect(() => {
    if (visible) setChecked(false);
  }, [visible]);

  if (!visible) return null;

  console.debug("[AgeGateModal] rendered visible=true, checked=", checked);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        console.debug("[AgeGateModal] onRequestClose (back button) -> cancel");
        onCancel();
      }}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <Pressable
        style={styles.overlay}
        onPress={() => {
          console.debug("[AgeGateModal] backdrop pressed -> cancel");
          onCancel();
        }}
      >
        {/* Stop propagation so presses on the dialog don't trigger backdrop */}
        <Pressable style={styles.dialog} onPress={() => {}}>
          <ThemedView style={{ padding: 20 }}>
            <ThemedText type="title" style={styles.title}>
              Content notice — Historical / Artistic Nudity
            </ThemedText>

            <ThemedText style={styles.body}>
              This area contains historical and artistic nude photography
              (public-domain, 19th–early 20th century). Images are presented for
              educational, historical, and artistic purposes only.
            </ThemedText>

            <Pressable
              onPress={() => setChecked((c) => !c)}
              style={styles.checkboxRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <ThemedText style={styles.checkboxText}>
                {checked ? "☑" : "☐"} I confirm I am 18 years or older and wish
                to view this content.
              </ThemedText>
            </Pressable>

            <View style={styles.actionsRow}>
              <SecondaryButton
                title="Cancel"
                onPress={() => {
                  console.debug("[AgeGateModal] Cancel pressed");
                  onCancel();
                }}
              />
              <PrimaryButton
                title="Continue"
                onPress={() => {
                  console.debug(
                    "[AgeGateModal] Continue pressed, checked=",
                    checked
                  );
                  if (!checked) return;
                  onConfirm({ confirmedAt: new Date().toISOString() });
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
