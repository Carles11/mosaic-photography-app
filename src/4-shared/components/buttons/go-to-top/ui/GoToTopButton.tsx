import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./GoToTopButton.styles";

interface GoToTopButtonProps {
  onPress: () => void;
  style?: object;
  label?: string;
  visible?: boolean; // Control visibility if needed, else always show
}

export const GoToTopButton: React.FC<GoToTopButtonProps> = ({
  onPress,
  style,
  label = "Go to top",
  visible = true,
}) => {
  if (!visible) return null;
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.82}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <MaterialIcons
          name="arrow-upward"
          size={18}
          color="#fff"
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );
};
