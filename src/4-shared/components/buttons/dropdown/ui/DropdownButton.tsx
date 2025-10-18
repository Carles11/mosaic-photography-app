import { Modal } from "@/4-shared/components/modals";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { DropdownButtonProps } from "@/4-shared/types/menu";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./DropdownButton.styles";

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  style,
  children,
  menuItems,
}) => {
  const { theme } = useTheme();

  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.button, style]}
        accessibilityLabel="Customize Dropdown"
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: theme.text,
              borderColor: theme.buttonBorderColor,
              backgroundColor: theme.buttonBackgroundColor,
              borderWidth: theme.buttonBorderWidth,
              borderRadius: theme.buttonBorderRadius,
              fontSize: theme.buttonFontSize,
              fontFamily: theme.fontFamilyBold,
            },
          ]}
        >
          {children ? children : "Customize"}
        </Text>
      </TouchableOpacity>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <View style={styles.dropdownContainer}>
          {menuItems.map((item, idx) =>
            item.component ? (
              <View key={idx} style={styles.menuItem}>
                {item.component}
              </View>
            ) : (
              <TouchableOpacity
                key={idx}
                style={[styles.menuItem]}
                onPress={() => {
                  if (!item.disabled) {
                    item.action?.();
                    setVisible(false);
                  }
                }}
                accessibilityLabel={item.label}
                disabled={item.disabled}
              >
                {item.icon && <View style={styles.menuIcon}>{item.icon}</View>}
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </Modal>
    </>
  );
};
