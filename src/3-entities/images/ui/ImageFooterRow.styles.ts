import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 12,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24, // space between groups
  },
  icon: {
    marginRight: 6, // space between icon and number
  },
  text: {
    fontSize: 15,
  },
});
