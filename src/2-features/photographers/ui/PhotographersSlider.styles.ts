import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 0,
  },
  title: {
    marginBottom: 8,
    paddingLeft: 6,
  },
  listContent: {
    paddingRight: 10,
  },
  item: {
    alignItems: "center",
    marginRight: 22,
    width: 65,
  },
  portraitWrapper: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    overflow: "hidden",
    marginBottom: 6,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  portrait: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
  },
  placeholderPortrait: {
    width: 95,
    height: 95,
    borderRadius: 35,
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
    maxWidth: 65,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
