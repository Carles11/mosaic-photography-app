import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
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
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 260,
  },
});
