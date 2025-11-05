// import { ThemedView } from "@/4-shared/components/themed-view";
// import { Ionicons } from "@expo/vector-icons"; // or use your IconSymbol if preferred
// import React from "react";
// import {
//   Modal as RNModal,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { styles } from "./Modal.styles";

// type ModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
//   title?: string;
//   contentContainerStyle?: object;
//   disableBackdropPress?: boolean;
// };

// export const Modal: React.FC<ModalProps> = ({
//   visible,
//   onClose,
//   children,
//   title,
//   contentContainerStyle,
//   disableBackdropPress = false,
// }) => (
//   <RNModal
//     visible={visible}
//     transparent
//     animationType="fade"
//     onRequestClose={onClose}
//   >
//     {!disableBackdropPress && (
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.overlay} />
//       </TouchableWithoutFeedback>
//     )}
//     <View style={styles.centeredView}>
//       <ThemedView style={[styles.container, contentContainerStyle]}>
//         <View style={styles.headerRow}>
//           {!!title && <Text style={styles.title}>{title}</Text>}
//           <TouchableOpacity
//             onPress={onClose}
//             style={styles.closeBtn}
//             accessibilityLabel="Close modal"
//           >
//             <Ionicons name="close" size={24} color="#444" />
//           </TouchableOpacity>
//         </View>
//         {children}
//       </ThemedView>
//     </View>
//   </RNModal>
// );
