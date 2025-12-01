import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  badge: {
    position: "absolute",
    bottom: 4,
    left: 22,
    backgroundColor: "#EB3B34",
    borderRadius: 4,
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  iconsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
