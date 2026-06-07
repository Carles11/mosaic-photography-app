import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { paddingBottom: 60 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { fontSize: 15 },
  heroWrapper: { width: "100%", position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  backLink: { padding: 16, paddingBottom: 0 },
  backLinkText: { fontSize: 13 },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  metaPill: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  metaPillText: { fontSize: 12 },
  aboutSection: { padding: 16, marginTop: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 16,
  },
  shareButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  shareButtonText: { fontSize: 13 },
  bio: { lineHeight: 24, marginBottom: 12, fontSize: 15 },
  links: { flexDirection: "row", gap: 16, marginTop: 8 },
  externalLink: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  gallerySection: { padding: 16 },
  galleryFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  galleryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 16,
  },
  galleryPillActive: {},
  galleryPillText: {
    fontSize: 13,
  },
  galleryPillTextActive: {
    fontWeight: "600",
  },
});
