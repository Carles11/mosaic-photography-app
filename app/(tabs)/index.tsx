import { StyleSheet } from "react-native";

import { Home } from "@/1-pages/home/ui/Home";
import { ThemedView } from "@/4-shared/components/themed-view";

export default function HomeScreen() {
  console.log("OLAKEASE-in-(tabs)/index.tsx-HomeScreen");

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
