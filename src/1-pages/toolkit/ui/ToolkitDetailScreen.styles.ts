import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingBottom: 36,
  },
  hero: {
    minHeight: 300,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.62)",
  },
  heroContent: {
    paddingHorizontal: 18,
    paddingTop: 42,
    paddingBottom: 24,
    backgroundColor: "transparent",
  },
  logoWrap: {
    minHeight: 42,
    alignSelf: "flex-start",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logo: {
    width: 150,
    height: 38,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 40,
    textTransform: "uppercase",
  },
  platformBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 4,
  },
  platformBadgeText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 15,
    textTransform: "uppercase",
  },
  heroDescription: {
    color: "#fff",
    marginTop: 14,
    fontSize: 16,
    lineHeight: 23,
  },
  heroButton: {
    alignSelf: "flex-start",
    marginTop: 18,
    marginVertical: 0,
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 26,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 0,
    opacity: 0.68,
    marginBottom: 10,
  },
  editorialBox: {
    borderLeftWidth: 2,
    paddingLeft: 16,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 25,
    opacity: 0.9,
  },
  emptyEditorial: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 6,
    padding: 14,
    opacity: 0.78,
  },
  banner: {
    width: "100%",
    height: 190,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  productCard: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 210,
  },
  productBody: {
    padding: 14,
  },
  productMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  typeText: {
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  featuredText: {
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  productTitle: {
    fontSize: 18,
    lineHeight: 23,
    textTransform: "uppercase",
  },
  productAuthor: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.7,
  },
  productDescription: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.86,
  },
  productButton: {
    alignSelf: "flex-start",
    marginTop: 14,
    marginVertical: 0,
  },
  disclosure: {
    marginHorizontal: 18,
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    alignItems: "center",
  },
  disclosureText: {
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.75,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
