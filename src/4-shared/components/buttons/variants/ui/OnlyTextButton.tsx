import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { ButtonProps } from "@/4-shared/types/buttons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { styles } from "./OnlyTextButton.styles";

type OnlyTextButtonProps = ButtonProps & {
  textStyle?: any;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
};

export const OnlyTextButton: React.FC<OnlyTextButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  numberOfLines = 1,
  ellipsizeMode = "tail",
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: theme.buttonBorderColor,
        },
        disabled && { opacity: 0.5 },
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText
        type="defaultSemiBold"
        style={[
          styles.text,
          {
            textAlign: "center",
            fontVariant: ["tabular-nums"], // helps with numbers
          },
          textStyle,
        ]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};
