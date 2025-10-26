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
    marginTop: 12,
    textAlign: "center" as const,
  }),
  closeButton: {
    marginTop: 18,
  },
  listContent: {
    paddingBottom: Platform.OS === "android" ? 48 : 0,
  },
};
