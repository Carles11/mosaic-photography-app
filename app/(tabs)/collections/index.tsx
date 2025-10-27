import CollectionsList from "@/1-pages/collections/collections-list/ui/CollectionsList";
import { ThemedView } from "@/4-shared/components/themed-view";
import React from "react";

export default function CollectionsListScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <CollectionsList />
    </ThemedView>
  );
}
