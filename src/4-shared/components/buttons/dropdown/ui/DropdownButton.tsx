import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { DropdownButtonProps } from "@/4-shared/types/menu";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./DropdownButton.styles";

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  style,
  children,
  menuItems,
}) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  // Calculate dropdown position (optional: can be made smarter if needed)
  const dropdownTop = 48; // Adjust if your button has different height

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={[styles.button, style]}
        accessibilityLabel="Menu Dropdown"
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
          {children ? children : "Menu"}
        </Text>
      </TouchableOpacity>

      {visible && (
        <>
          {/* Overlay that catches outside presses */}
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setVisible(false)}
            accessibilityLabel="Close Dropdown"
          />

          {/* Dropdown menu */}
          <View
            style={[
              styles.dropdownContainer,
              {
                backgroundColor: theme.background,
                position: "absolute",
                top: dropdownTop,
                left: 0,
                zIndex: 9999,
                elevation: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                minWidth: 180,
              },
            ]}
          >
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
                  {item.icon && (
                    <View style={styles.menuIcon}>{item.icon}</View>
                  )}
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </>
      )}
    </>
  );
};
