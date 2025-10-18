import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    borderRadius: 11,
  },
  buttonText: {
    letterSpacing: 0.5,
    paddingVertical: 6,
    paddingHorizontal: 11,
  },
  // For future dropdown menu
  dropdownContainer: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,

    minWidth: 140,
    zIndex: 99,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 15,
    marginLeft: 8,
  },
  menuIcon: {
    marginRight: 12,
  },
});
