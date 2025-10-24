import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "stretch",
  },
  title: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
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
