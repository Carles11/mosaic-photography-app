import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    elevation: 8,
  },

  container: {
    padding: 20,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: "#202030",
    borderWidth: 1,
    borderColor: "#313131",
  },
  optionActiveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  optionText: {
    fontSize: 15,
    color: "#fff",
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
});
