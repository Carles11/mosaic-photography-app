import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 11,
    height: 525,
  },
  pageTitle: {
    marginVertical: 11,
  },
  title: {
    marginTop: 16,
    marginBottom: 22,
    paddingLeft: 6,
  },
  listContent: {
    paddingRight: 0,
  },
  item: {
    alignItems: "center",
    // width sets the separation between items
    width: 165,
    padding: 8,
  },
  portraitWrapper: {
    width: 160,
    height: 222,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 6,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  portrait: {
    width: 160,
    height: 222,
    borderRadius: 8,
  },
  placeholderPortrait: {
    width: 160,
    height: 222,
    borderRadius: 8,
    backgroundColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderInitial: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  name: {
    textAlign: "center",
    fontSize: 16,
    maxWidth: "auto",
  },
  intro: {
    textAlign: "center",
    fontSize: 12,
    maxWidth: "auto",
    height: 148,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
