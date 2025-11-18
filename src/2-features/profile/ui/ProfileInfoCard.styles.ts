import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 22,
    paddingHorizontal: 22,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  email: {
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  memberSince: {
    fontSize: 13,
    textAlign: "center",
  },
});
