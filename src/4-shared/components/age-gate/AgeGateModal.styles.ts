import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dialog: {
    width: "100%",
    maxWidth: 680,
    borderRadius: 12,
    // Android elevation + iOS shadow
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  title: {
    marginBottom: 10,
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
