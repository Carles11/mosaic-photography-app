import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252525DD",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    position: "absolute",
    right: 11,
    bottom: 65,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    zIndex: 777,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 7,
  },
  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "TradeGothic-Bold, sans-serif",
    letterSpacing: 0.15,
  },
});
