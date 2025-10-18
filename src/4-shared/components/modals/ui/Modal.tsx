import { ThemedView } from "@/4-shared/components/themed-view";
import React from "react";
import { Modal as RNModal, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "./Modal.styles";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ visible, onClose, children }) => (
  <RNModal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay} />
    </TouchableWithoutFeedback>
    <View style={styles.centeredView}>
      <ThemedView style={styles.container}>{children}</ThemedView>
    </View>
  </RNModal>
);
