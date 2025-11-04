import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  panelContainer: {
    marginTop: 12,
    marginBottom: 10,
    padding: 16,
    paddingBottom: 44,

    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderTopColor: "#c0c0c0",
  },
  originalBlock: {
    marginBottom: 18,
  },
  originalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  bestQualityBadge: {
    marginLeft: 10,
    backgroundColor: "#ffd700",
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  bestQualityBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#633",
    letterSpacing: 0.5,
  },
  qualityLine: {
    color: "#ab8700",
    fontSize: 13,
    marginBottom: 7,
    fontWeight: "500",
  },
  qualityHighlight: {
    fontWeight: "bold",
    color: "#795200",
  },
  collectorsNote: {
    color: "#938753",
    fontSize: 12,
    marginBottom: 8,
  },
  downloadOriginalButton: {
    marginTop: 3,
    marginBottom: 6,
    borderRadius: 12,
    backgroundColor: "#ffd700",
  },
  downloadOriginalButtonText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 16,
  },
  webpBlock: {
    marginBottom: 10,
  },
  webpTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  webpBadge: {
    marginLeft: 9,
    backgroundColor: "#12cd87",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  webpBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.4,
  },
  webpDesc: {
    color: "#298a46",
    fontSize: 13,
    marginBottom: 8,
  },
  downloadOptionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
    width: "100%",
  },
  downloadWebpButton: {
    minWidth: 66,
    maxWidth: 90,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 2,
    backgroundColor: "#12cd87",
    elevation: 2,
  },
  downloadWebpButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  customRequestText: {
    color: "#9ea29a",
    fontSize: 12,
    textAlign: "center",
    marginTop: 7,
    opacity: 0.77,
    fontStyle: "italic",
  },
});
