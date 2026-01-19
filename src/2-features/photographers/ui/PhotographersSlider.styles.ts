import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },

  // Used while the initial page is loading
  loadingContainer: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  pageTitle: {
    fontSize: 22,
    marginBottom: 8,
    paddingHorizontal: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },

  titleLeft: {
    fontSize: 16,
  },

  titleRight: {
    paddingHorizontal: 8,
  },

  listContent: {
    paddingHorizontal: 8,
  },

  // Footer shown at the end of the horizontal FlatList while loading more pages.
  // Use a fixed-ish height to match item height so the spinner is vertically centered.
  // SEARCH: loadingMoreContainer
  loadingMoreContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 240, // matches PhotographersSliderItem portrait + label (adjust if you change item sizes)
  },
});
