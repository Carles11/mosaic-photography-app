import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  section: {
    paddingVertical: 16,
  },

  listContent: {
    paddingHorizontal: 16,
  },
  centered: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontStyle: "italic",
    fontSize: 14,
  },
  ctaLink: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  ctaLinkText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 16,
  },
  pillText: {
    fontSize: 13,
  },
  pillTextActive: {
    fontWeight: "600",
  },
});
