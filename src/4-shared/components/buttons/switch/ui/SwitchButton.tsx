import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";
import { Switch, View, ViewStyle } from "react-native";
import { styles } from "./SwitchButton.styles";

type SwitchButtonProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
};

export const SwitchButton: React.FC<SwitchButtonProps> = ({
  value,
  onValueChange,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#ccc", true: theme.accent }}
        thumbColor={value ? theme.text : "#eee"}
      />
    </View>
  );
};
