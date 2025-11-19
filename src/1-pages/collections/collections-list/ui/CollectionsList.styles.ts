import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    paddingTop: 0, // navigation handles status bar
    marginTop: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  header: {
    marginBottom: 14,
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  createButton: {
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 14,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 260,
    alignSelf: "center",
  },
});
