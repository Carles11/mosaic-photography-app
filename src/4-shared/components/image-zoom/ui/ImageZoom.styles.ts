import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // to avoid white flash during image loading
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  descriptionTextContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "6%",
    // leave room for scale badge
    alignItems: "center",
    zIndex: 12,
    paddingHorizontal: 16,
  },
  descriptionText: {
    backgroundColor: "rgba(30,30,30,0.8)",
    color: "#fff",

    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: "hidden",
    textAlign: "center",
  },
  topLegendContainer: {
    position: "absolute",
    top: "11%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 12,
    paddingHorizontal: 16,
  },
  topLegendText: {
    backgroundColor: "rgba(30,30,30,0.85)",
    color: "#fff",
    fontWeight: "600",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    overflow: "hidden",
    textAlign: "center",
  },
  zoomScaleBadge: {
    position: "absolute",
    bottom: "13%",
    right: 16,

    paddingVertical: 4,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  noImageContainer: {
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  activityIndicator: { position: "absolute", alignSelf: "center" },
});
