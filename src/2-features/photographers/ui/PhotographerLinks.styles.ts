import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 22,
    marginBottom: 11,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 2,
  },
  sectionStoresContent: {
    fontSize: 15,
    paddingBottom: 4,
  },
  linkItem: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  link: {
    color: "#1371d6",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  noLink: {
    color: "#888",
    textDecorationLine: "none",
  },
});
