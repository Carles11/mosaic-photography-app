import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  title: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  checkboxRow: {
    marginTop: 8,
    paddingVertical: 8,
  },
  checkboxText: {
    fontSize: 14,
  },
  actionsRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
