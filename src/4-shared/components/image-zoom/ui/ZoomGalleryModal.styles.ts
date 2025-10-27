import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.99)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 48,
    right: 24,
    zIndex: 100,
    backgroundColor: "rgba(30,30,30,0.7)",
    borderRadius: 20,
    padding: 8,
  },
  imageWrapper: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  indexIndicator: {
    position: "absolute",
    top: 48,
    left: 24,
    zIndex: 100,
    backgroundColor: "rgba(30,30,30,0.7)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  indexText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
