import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  badgeContainer: {
    minWidth: 48,
    minHeight: 48,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 15,
    padding: 0,
    // backgroundColor animated!
    overflow: "visible",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  badgeText: {
    textAlign: "center",
  },
});
