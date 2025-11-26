import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 3,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "stretch",
  },
  containerTop: {
    flex: 3,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "stretch",
  },
  containerBottom: {
    flex: 1,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: "center",
    height: 34,
  },

  error: {
    marginBottom: 8,
    fontSize: 14,
    textAlign: "center",
  },
  success: {
    marginBottom: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
