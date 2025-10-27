import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { StyleSheet, View } from "react-native";

export function HapticTab(props: BottomTabBarButtonProps) {
  const theme = useTheme();
  const isFocused = props.accessibilityState?.selected;

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      style={StyleSheet.flatten([props.style, styles.center])}
    >
      <View style={styles.center}>
        {isFocused ? (
          <View
            style={[
              styles.circle,
              {
                backgroundColor: "red",
              },
            ]}
          >
            {props.children}
          </View>
        ) : (
          props.children
        )}
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
