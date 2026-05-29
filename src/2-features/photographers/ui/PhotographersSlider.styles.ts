import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  seeAllCard: {
    width: 120,
    height: 240,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 6,
  },

  // Used while the initial page is loading
  loadingContainer: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
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
