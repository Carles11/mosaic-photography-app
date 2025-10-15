import { StyleSheet } from 'react-native';

import { Home } from '@/1-pages/home/ui/Home';
import { ThemedView } from '@/4-shared/components/themed-view';

export default function HomeScreen() {
  return (
      <ThemedView style={styles.titleContainer}>
       <Home />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
   flex: 1
  },
});
