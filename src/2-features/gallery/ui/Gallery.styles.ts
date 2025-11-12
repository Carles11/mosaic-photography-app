import { StyleSheet } from "react-native";

export function styles(itemHeight: number) {
  return StyleSheet.create({
    container: {
      padding: 0,
    },
    title: {
      paddingHorizontal: 18,
      paddingTop: 16,
      marginBottom: 4,
    },
    item: {
      flex: 1,
      margin: 0,
      borderRadius: 8,
      overflow: "hidden",
      elevation: 2,
      height: itemHeight, // Always responsive from hook
    },
  });
}
