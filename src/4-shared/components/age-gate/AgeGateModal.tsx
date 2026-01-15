import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { styles } from "./AgeGateModal.styles";

/**
 * AgeGateModal
 * - visible: whether to render
 * - onConfirm: called with { confirmedAt: ISOString }
 * - onCancel: called when the user cancels (keeps previous state)
 *
 * Note: This component is intentionally simple (checkbox + continue) to keep reviewer flow fast.
 * If you prefer a date-of-birth input instead, tell me and I will change it.
 */
export type AgeGatePayload = { confirmedAt: string };

export const AgeGateModal: React.FC<{
  visible: boolean;
  onConfirm: (payload: AgeGatePayload) => void;
  onCancel: () => void;
}> = ({ visible, onConfirm, onCancel }) => {
  const [checked, setChecked] = useState(false);

  if (!visible) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Content notice — Historical / Artistic Nudity
      </ThemedText>

      <ThemedText style={styles.body}>
        This section contains historical and artistic nude photography
        (public-domain, 19th–early 20th century). These images are presented for
        educational, historical, and artistic purposes only.
      </ThemedText>

      <Pressable
        onPress={() => setChecked(!checked)}
        style={styles.checkboxRow}
      >
        <ThemedText style={styles.checkboxText}>
          {checked ? "☑" : "☐"} I confirm I am 18 years or older and wish to
          view this content.
        </ThemedText>
      </Pressable>

      <View style={styles.actionsRow}>
        <SecondaryButton title="Cancel" onPress={onCancel} />
        <PrimaryButton
          title="Continue"
          onPress={() => onConfirm({ confirmedAt: new Date().toISOString() })}
          disabled={!checked}
          // small left margin to separate buttons; variant components accept style
          style={{ marginLeft: 8 }}
        />
      </View>
    </ThemedView>
  );
};

export default AgeGateModal;
