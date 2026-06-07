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
    color: "#666",
    fontStyle: "italic",
    fontSize: 14,
  },
  ctaLink: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  ctaLinkText: {
    color: "#888",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
