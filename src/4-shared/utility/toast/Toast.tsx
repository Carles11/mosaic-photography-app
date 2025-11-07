import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { Text } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export const MosaicToast = () => {
  const { theme } = useTheme();

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.success,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        renderText1={({ children }: { children: React.ReactNode }) => (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#222",
            }}
          >
            {children}
          </Text>
        )}
        renderText2={({ children }: { children: React.ReactNode }) =>
          children ? (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                color: "#555",
                marginTop: 2,
              }}
            >
              {children}
            </Text>
          ) : null
        }
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.error,
        }}
        renderText1={({ children }: { children: React.ReactNode }) => (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#222",
            }}
          >
            {children}
          </Text>
        )}
        renderText2={({ children }: { children: React.ReactNode }) =>
          children ? (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                color: "#555",
                marginTop: 2,
              }}
            >
              {children}
            </Text>
          ) : null
        }
      />
    ),
    // Add other toast types here...
  };

  return <Toast config={toastConfig} position="top" topOffset={48} />;
};

// Helper functions (no changes needed, keep as-is)
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
