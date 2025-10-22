import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  timelineWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    fontStyle: "italic",
  },
  eventContainer: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    padding: 14,
    elevation: 1,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#333",
    marginRight: 6,
    flexShrink: 1,
  },
  eventSubtitle: {
    fontSize: 15,
    color: "#666",
    marginLeft: 2,
    flexShrink: 1,
  },
  eventType: {
    fontSize: 13,
    color: "#3498db",
    marginLeft: 6,
    fontStyle: "italic",
  },
  eventDescription: {
    fontSize: 15,
    color: "#444",
    marginTop: 4,
    lineHeight: 21,
  },
  mediaBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: "#e9eef6",
    borderRadius: 5,
  },
  mediaText: {
    fontSize: 13,
    color: "#555",
  },
  mediaUrl: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "underline",
  },
  timelineTime: {
    minWidth: 46,
    textAlign: "right",
    fontSize: 13,
    color: "#888",
    paddingRight: 6,
    fontVariant: ["tabular-nums"],
    fontFamily: "System",
    alignSelf: "flex-start",
    marginTop: 2,
  },
});
