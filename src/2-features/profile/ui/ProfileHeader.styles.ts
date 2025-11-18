import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 66,
    position: "relative",
  },
  gradient: {
    width: "90%",
    height: 100,
    borderRadius: 22,
    alignSelf: "center",
    position: "relative",
    zIndex: 1,
  },
  avatarContainer: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    borderWidth: 4,

    zIndex: 2,
  },
  initial: {
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
});
