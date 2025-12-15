import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 22,
    marginBottom: 11,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 4,
  },
  sectionStoresContent: {
    fontSize: 15,
    paddingBottom: 4,
    color: "#444",
  },

  list: {
    marginTop: 4,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginVertical: 6,
    backgroundColor: "transparent",
    borderRadius: 8,
  },

  left: {
    width: 64,
    height: 64,
    marginRight: 12,
  },

  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: "#eee",
  },

  thumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: "#e9eef8",
    alignItems: "center",
    justifyContent: "center",
  },

  thumbnailInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f3d7a",
  },

  center: {
    flex: 1,
    justifyContent: "center",
  },

  storeName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },

  itemLabel: {
    fontSize: 11,
    lineHeight: 14, // keeps text vertically centered without extra height
    backgroundColor: "#fff7ed",
    color: "#b45309",
    paddingHorizontal: 8,
    paddingVertical: 2, // reduced vertical padding so badge is compact
    borderRadius: 999, // pill/badge shape
    alignSelf: "flex-start",
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f5d6a9",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.06,
        shadowRadius: 0.8,
      },
      android: {
        elevation: 0.5,
      },
      default: {},
    }),
  },

  description: {
    fontSize: 13,
  },

  right: {
    width: 92,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#1371d6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  buttonPressed: {
    opacity: 0.9,
  },

  buttonDisabled: {
    backgroundColor: "#e6e6e6",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  buttonTextDisabled: {
    color: "#888",
  },

  linkRow: {
    paddingVertical: 8,
    paddingHorizontal: 2,
  },

  linkText: {
    color: "#1371d6",
    textDecorationLine: "underline",
    fontSize: 15,
  },

  emptyText: {
    color: "#888",
    fontSize: 14,
    paddingVertical: 6,
  },

  // legacy/simple link styles (kept for compatibility)
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
