import FavoritesList from "@/1-pages/favorites-list/ui/FavoritesList";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesListScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <FavoritesList />
    </SafeAreaView>
  );
}
