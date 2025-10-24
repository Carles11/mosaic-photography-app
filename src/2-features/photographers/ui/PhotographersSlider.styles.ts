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
    width: 70,
  },
  portraitWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    marginBottom: 6,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  portrait: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  placeholderPortrait: {
    width: 70,
    height: 70,
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
    maxWidth: 70,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
