import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: "100%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  notLoggedInText: {
    fontSize: 18,
    marginBottom: 16,
  },
  profileMenuSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingVertical: 20,
    width: "100%",
  },
  menuItem: {
    width: "90%",
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: 16,
    gap: 8,
  },
  menuItemLabel: {
    fontSize: 16,
    marginLeft: 6,
  },
  menuItemSlider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
});
