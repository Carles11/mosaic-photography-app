import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: 260,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  imageWrap: {
    height: 160,
    backgroundColor: "#2a2a2a",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  typeLabel: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(29, 29, 29, 0.82)",
  },
  typeLabelText: {
    color: "#fff",
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  body: {
    padding: 12,
    height: 200,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    textTransform: "uppercase",
  },
  store: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
    opacity: 0.72,
  },
  description: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.86,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    marginTop: "auto",
  },
  shopButton: {
    flex: 1,
    minHeight: 42,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 0,
  },
  whyButton: {
    flex: 0.9,
    minHeight: 42,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 0,
  },
  actionText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
