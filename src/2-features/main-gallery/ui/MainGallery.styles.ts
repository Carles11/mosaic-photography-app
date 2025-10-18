import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    color: "#fff",
    fontSize: 18,
  },
  error: {
    color: "#ff3333",
    fontSize: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    padding: 4,
    fontSize: 14,
    textAlign: "center",
  },
});
