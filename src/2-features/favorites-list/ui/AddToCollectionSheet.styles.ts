import { Platform } from "react-native";

export const styles = {
  sheet: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 12,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  emptyText: {
    marginTop: 16,
  },

  feedback: (feedback: string) => ({
    color: feedback.includes("Failed") ? "red" : "green",
    marginVertical: 12,
    textAlign: "center" as const,
  }),
  closeButton: {
    marginTop: 18,
  },
  listContent: {
    paddingBottom: Platform.OS === "android" ? 48 : 0,
  },
  createNewButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  createForm: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  input: {
    padding: 8,
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    marginBottom: 6,
    fontSize: 16,
  },
  createButton: {
    marginBottom: 6,
  },
  cancelButton: {
    marginBottom: 4,
  },
};
