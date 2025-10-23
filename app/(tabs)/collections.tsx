import CollectionsList from "@/1-pages/collections/collections-list/ui/CollectionsList";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionsListScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <CollectionsList />
    </SafeAreaView>
  );
}
