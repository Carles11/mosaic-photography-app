import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 22,
  },
  container: {
    gap: 16,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  message: {
    marginBottom: 18,
    padding: 10,
    borderRadius: 8,
  },
  error: {
    backgroundColor: "#fdecea",
  },
  success: {
    backgroundColor: "#e7fbe7",
  },
  databaseSetup: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
  },
  dbTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  instructionsTitle: {
    marginTop: 10,
    fontWeight: "bold",
  },
  code: {
    fontFamily: "monospace",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  section: {
    marginBottom: 24,
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    minWidth: 110,
  },
  value: {
    fontSize: 15,
    flexShrink: 1,
  },
  field: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 8,
    fontSize: 15,
    marginTop: 4,
  },

  disabledForm: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
});

export default styles;
