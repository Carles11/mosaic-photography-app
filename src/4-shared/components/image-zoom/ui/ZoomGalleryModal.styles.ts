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
    top: 32,
    right: 24,
    zIndex: 100,
    backgroundColor: "rgba(30,30,30,0.7)",
    borderRadius: 12,
    padding: 6,
  },
  downloadButton: {
    position: "absolute",
    top: 32,
    right: 70,
    backgroundColor: "rgba(30,30,30,0.7)",
    borderRadius: 12,
    padding: 6,
    zIndex: 100,
  },
  imageWrapper: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  indexIndicator: {
    position: "absolute",
    top: 32,
    left: 24,
    zIndex: 100,
    backgroundColor: "rgba(30,30,30,0.7)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  indexText: {
    color: "#fff",
    fontSize: 14,
  },
});
