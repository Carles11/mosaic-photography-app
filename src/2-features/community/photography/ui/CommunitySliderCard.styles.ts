import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
  },
  image: { width: "100%", height: "100%" },
  placeholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 16,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  country: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
});
