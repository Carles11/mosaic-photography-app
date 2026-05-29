import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    paddingTop: 8,
  },
  section: {
    paddingVertical: 20,
  },

  body: {
    fontSize: 15,
    lineHeight: 23,
    opacity: 0.85,
  },
  divider: {
    height: 1,
    opacity: 0.15,
  },
  instaRow: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  instaHandle: {
    fontSize: 15,
    fontWeight: "600",
  },
  instaCaption: {
    fontSize: 13,
    marginTop: 3,
  },
  linkRow: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  linkText: {
    fontSize: 13,
    opacity: 0.7,
  },
  supportButton: {
    marginTop: 16,
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 32,
    letterSpacing: 0.5,
  },
});
