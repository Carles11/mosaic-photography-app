import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 66,
    position: "relative",
  },
  gradient: {
    borderWidth: 1,
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
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadgeText: {
    fontSize: 13,
  },
});
