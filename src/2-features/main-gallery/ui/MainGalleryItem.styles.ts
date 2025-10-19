import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 24,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    overflow: "hidden",
    shadowColor: "#dedede",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "auto",
    minHeight: 450,
    backgroundColor: "#eaeaea",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    color: "#222",
  },
});
