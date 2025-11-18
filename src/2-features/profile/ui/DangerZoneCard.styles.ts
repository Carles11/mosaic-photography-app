import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginVertical: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionHeaderText: {
    marginLeft: 7,
    fontWeight: "bold",
    fontSize: 17,
    color: "#d10101",
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 14,
    color: "#833",
    lineHeight: 20,
    marginBottom: 18,
  },
  bold: {
    fontWeight: "bold",
    color: "#d10101",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: "#d10101",
    marginTop: 8,
  },
  buttonText: {
    color: "#d10101",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
});
