import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheet: {
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    elevation: 8,
  },

  safeArea: {
    flex: 1,
    padding: 12,
  },

  container: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "left",
  },
  label: {
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#555555",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: "#2f2f4cff",
    borderWidth: 1,
    borderColor: "#313131",
  },
  optionActiveText: {
    color: "#fff",
    fontWeight: "bold",
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
    gap: 24,
  },
  // New styles for text search
  textSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  clearButton: {
    marginLeft: 6,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 17,
    color: "#888",
  },
});
