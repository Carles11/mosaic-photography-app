import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  section: {
    paddingTop: 20,
    paddingBottom: 18,
  },

  filtersList: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 18,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 2,
  },
  centered: {
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
