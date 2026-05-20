import { theme } from "@/4-shared/theme/globalTheme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    paddingTop: 0, // navigation handles status bar
    marginTop: 0,
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 4,
    fontSize: 22,
    fontWeight: "bold",
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

export const markdownStyles = {
  body: {
    color: theme.text,
    fontSize: 14, // Slightly smaller for list cards
    lineHeight: 18,
  },
};
