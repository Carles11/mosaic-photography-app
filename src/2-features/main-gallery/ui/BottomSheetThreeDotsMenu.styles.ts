import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheetView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
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
  downloadOptionsTitle: {
    paddingHorizontal: 8,
    marginTop: 12,
  },
  reportButtonIcon: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  downloadOptionButton: {
    minWidth: 56,
    maxWidth: 78,
    flexGrow: 0,
    flexShrink: 1,
    marginHorizontal: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadOptionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 6,
  },
});
