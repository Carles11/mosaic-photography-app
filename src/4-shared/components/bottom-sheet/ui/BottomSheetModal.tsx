import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetModal as GorhomBottomSheetModal } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { styles } from "./BottomSheetModal.styles";

export type BottomSheetModalRef = {
  present: () => void;
  dismiss: () => void;
};

type KeyboardBehaviorType = "interactive" | "extend" | "fillParent" | undefined;

type BottomSheetModalProps = {
  children: ReactNode;
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
  handleIndicatorStyle?: ViewStyle;
  backgroundStyle?: ViewStyle;
  enablePanDownToClose?: boolean;
  keyboardBehavior?: KeyboardBehaviorType;
  keyboardBlurBehavior?: "restore" | undefined;
  style?: StyleProp<ViewStyle>; // <-- Accept single or array
  modalRef?: React.Ref<BottomSheetModalRef>;
  index?: number;
};

export const BottomSheetModal = forwardRef<
  BottomSheetModalRef,
  BottomSheetModalProps
>(
  (
    {
      children,
      snapPoints,
      onDismiss,
      handleIndicatorStyle,
      backgroundStyle,
      enablePanDownToClose = true,
      keyboardBehavior = "interactive",
      keyboardBlurBehavior = "restore",
      style,
      modalRef,
      index = 0,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const localSheetRef = useRef<GorhomBottomSheetModal>(null);

    useImperativeHandle(ref ?? modalRef, () => ({
      present: () => localSheetRef.current?.present(),
      dismiss: () => localSheetRef.current?.dismiss(),
    }));

    const resolvedSnapPoints = useMemo(
      () => snapPoints ?? ["60%"],
      [snapPoints]
    );

    // Always flatten the style prop so it is a single style object
    const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

    return (
      <GorhomBottomSheetModal
        ref={localSheetRef}
        snapPoints={resolvedSnapPoints}
        index={index}
        enablePanDownToClose={enablePanDownToClose}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        handleIndicatorStyle={[
          styles.indicator,
          { backgroundColor: theme.text },
          handleIndicatorStyle,
        ]}
        backgroundStyle={[
          { backgroundColor: theme.background },
          backgroundStyle,
        ]}
        onDismiss={onDismiss}
        style={flattenedStyle} // <-- Always a single object now
      >
        {children}
      </GorhomBottomSheetModal>
    );
  }
);

BottomSheetModal.displayName = "BottomSheetModal";
