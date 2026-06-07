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
});
