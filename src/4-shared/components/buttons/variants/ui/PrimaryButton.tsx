import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { ButtonProps } from "@/4-shared/types";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./PrimaryButton.styles";

type PrimaryButtonProps = ButtonProps & {
  textStyles?: StyleProp<TextStyle>;
  iconLeft?: {
    name: string;
    type: "material" | "ion" | "fontawesome" | "svg" | "sf";
    size?: number;
    color?: string;
  };
  iconRight?: {
    name: string;
    type: "material" | "ion" | "fontawesome" | "svg" | "sf";
    size?: number;
    color?: string;
  };
  iconLeftStyle?: StyleProp<ViewStyle>;
  iconRightStyle?: StyleProp<ViewStyle>;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyles,
  iconLeft,
  iconRight,
  iconLeftStyle,
  iconRightStyle,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.buttonBackgroundColor,
          borderColor: theme.buttonBorderColor,
          borderWidth: theme.buttonBorderWidth,
          borderRadius: theme.buttonBorderRadius,
        },
        disabled && { opacity: 0.5 },
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.buttonTextColor} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconLeft && (
            <View style={[{ marginRight: 7 }, iconLeftStyle]}>
              <IconSymbol {...iconLeft} />
            </View>
          )}
          <ThemedText
            type="defaultSemiBold"
            style={[
              {
                color: "#fff",
                textAlign: "center",
              },
              textStyles,
            ]}
          >
            {title}
          </ThemedText>
          {iconRight && (
            <View style={[{ marginLeft: 7 }, iconRightStyle]}>
              <IconSymbol {...iconRight} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
