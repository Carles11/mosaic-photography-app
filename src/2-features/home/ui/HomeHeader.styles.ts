import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#303030",
  },
  searchBar: {
    minHeight: 58,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  searchText: {
    color: "#1d1d1d",
    marginLeft: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 72,
    paddingHorizontal: 2,
  },
  tabButtonCompact: {
    minHeight: 42,
  },
  tabIconWrap: {
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    opacity: 1,
  },
  tabIconHidden: {
    height: 0,
    marginBottom: 0,
    opacity: 0,
    overflow: "hidden",
  },
  tabLabel: {
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center",
  },
  activeIndicator: {
    width: 44,
    height: 3,
    borderRadius: 3,
    marginTop: 8,
  },
});
