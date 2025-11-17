import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingLeft: 10,
    paddingRight: 0,
  },
  title: {
    marginTop: 16,
    marginBottom: 22,
    paddingLeft: 6,
  },
  listContent: {
    paddingRight: 10,
  },
  item: {
    alignItems: "center",
    marginRight: 22,
    // width sets the separation between items
    width: 145,
  },
  portraitWrapper: {
    width: 160,
    height: 160,
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
    height: 160,
    borderRadius: 8,
  },
  placeholderPortrait: {
    width: 160,
    height: 160,
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
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
