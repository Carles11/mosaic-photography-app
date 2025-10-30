import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheetView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  author: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 8,
    width: "50%",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
