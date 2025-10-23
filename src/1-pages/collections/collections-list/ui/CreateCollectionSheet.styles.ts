import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  sheetInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
});
