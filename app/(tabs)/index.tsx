import { StyleSheet } from "react-native";

import { Home } from "@/1-pages/home/ui/Home";
import { ThemedView } from "@/4-shared/components/themed-view";
console.log("[(tabs/index.tsx)] tabs-index.tsx loaded");
export default function HomeScreen() {
  return (
    <ThemedView style={styles.homeContainer}>
      <Home />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
});
