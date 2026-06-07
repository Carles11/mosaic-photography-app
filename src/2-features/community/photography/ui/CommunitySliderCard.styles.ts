import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#222",
  },
  image: { width: "100%", height: "100%" },
  placeholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2a2a2a",
    margin: 16,
  },
  name: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  country: {
    color: "#888",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
});
