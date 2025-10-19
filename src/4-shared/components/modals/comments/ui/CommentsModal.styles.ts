import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
    marginBottom: 12,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
    color: "#444",
  },
  commentText: {
    fontSize: 15,
    color: "#222",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionBtn: {
    marginLeft: 4,
    padding: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#fafafa",
  },
  sendBtn: {
    marginLeft: 8,
    padding: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 24,
    fontSize: 16,
  },
});
