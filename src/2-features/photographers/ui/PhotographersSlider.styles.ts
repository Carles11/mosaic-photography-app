import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 12,
    paddingLeft: 10,
    paddingRight: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    paddingLeft: 6,
    color: "#222",
  },
  listContent: {
    paddingRight: 10,
  },
  item: {
    alignItems: "center",
    marginRight: 22,
    width: 72,
  },
  portraitWrapper: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: "hidden",
    marginBottom: 6,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  portrait: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  placeholderPortrait: {
    width: 62,
    height: 62,
    borderRadius: 31,
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
    fontSize: 13,
    color: "#222",
    textAlign: "center",
    maxWidth: 70,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
