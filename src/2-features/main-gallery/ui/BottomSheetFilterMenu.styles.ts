import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    elevation: 8,
  },
  sheetBackground: {
    backgroundColor: "#fafafa",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  option: {
    backgroundColor: "#ededed",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: "#313131",
  },
  optionText: {
    fontSize: 15,
    color: "#313131",
  },
  input: {
    width: 72,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    backgroundColor: "#ededed",
    color: "#313131",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  resetButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  resetButtonText: {
    color: "#313131",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#313131",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
