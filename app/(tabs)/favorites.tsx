import FavoritesList from "@/1-pages/favorites-list/ui/FavoritesList";
import { ThemedView } from "@/4-shared/components/themed-view";
import React from "react";

export default function FavoritesListScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <FavoritesList />
    </ThemedView>
  );
}
