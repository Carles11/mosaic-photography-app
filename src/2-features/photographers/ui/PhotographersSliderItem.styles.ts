import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  item: {
    alignItems: "center",
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
  introTouchable: {
    width: "100%",
  },
});
