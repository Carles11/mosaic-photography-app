,import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 10,
  },
  reasonList: {
    marginBottom: 12,
    gap: 6,
  },
  reasonButton: {
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "flex-start",
    backgroundColor: "#f7f7f7",
  },
  reasonButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#e8f0fe",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    color: "#333",
  },
  feedback: (feedback: string) => ({
    color: feedback.toLowerCase().includes("thank") ? "green" : "red",
    marginTop: 4,
    marginBottom: 4,
    fontSize: 14,
    textAlign: "center",
  }),
  loadingIndicator: {
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 8,
  },
  submitButton: {
    flex: 1,
    marginRight: 6,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 6,
  },
});