import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
// You may import custom styles from Toast.styles if desired

const { theme } = useTheme();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: theme.success,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: theme.error,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  // Extend with more types as needed (e.g. info)
};

// Toast global component for inclusion at entry-point
export const MosaicToast = () => (
  <Toast config={toastConfig} position="top" topOffset={48} />
);

// Helper functions for use throughout the app
export function showToast({
  type = "success",
  text1,
  text2,
  ...rest
}: {
  type?: "success" | "error" | "info" | string;
  text1: string;
  text2?: string;
  [key: string]: any;
}) {
  Toast.show({ type, text1, text2, ...rest });
}

export function showSuccessToast(text1: string, text2?: string) {
  showToast({ type: "success", text1, text2 });
}

export function showErrorToast(text1: string, text2?: string) {
  showToast({ type: "error", text1, text2 });
}
