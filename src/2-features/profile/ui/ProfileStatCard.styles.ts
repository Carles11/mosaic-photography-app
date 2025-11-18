import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1.5,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: "#fff",
    padding: 0,
    overflow: "hidden",
  },
  statBlock: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  leftStat: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  rightStat: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginVertical: 3,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 2,
  },
  divider: {
    width: 1,
    marginVertical: 12,
    backgroundColor: "#eee",
  },
});
