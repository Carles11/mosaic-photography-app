import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 11,
  },
  pageTitle: {
    marginVertical: 11,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 95,
  },
  titleLeft: {
    marginTop: 16,
    marginBottom: 22,
    paddingLeft: 6,
  },
  titleRight: {
    marginTop: 16,
    marginBottom: 22,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingRight: 0,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
