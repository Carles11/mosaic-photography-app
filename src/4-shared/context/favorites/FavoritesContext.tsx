import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "@/4-shared/api/favoritesApi";
import { supabase } from "@/4-shared/api/supabaseClient"; // For ensureFavorite
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type FavoritesContextType = {
  favorites: Set<string>;
  loading: boolean;
  toggleFavorite: (imageId: string | number) => Promise<void>;
  isFavorite: (imageId: string | number) => boolean;
  isUserLoggedIn: () => boolean;
  ensureFavorite: (
    imageId: string | number
  ) => Promise<{ favoriteId: number } | null>;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  loading: true,
  toggleFavorite: async () => {},
  isFavorite: () => false,
  isUserLoggedIn: () => false,
  ensureFavorite: async () => null,
});

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuthSession();

  // Load user's favorites when user changes/mounts
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites(new Set());
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const favoriteIds = await getUserFavorites(user.id);
        setFavorites(new Set(favoriteIds.map(String)));
      } catch (error) {
        setFavorites(new Set());
        showErrorToast("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user]);

  const toggleFavorite = useCallback(
    async (imageId: string | number) => {
      if (!user) {
        showErrorToast("Please log in to use favorites.");
        return;
      }
      const idStr = String(imageId);
      try {
        const isFav = favorites.has(idStr);
        if (isFav) {
          await removeFavorite(user.id, idStr);
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.delete(idStr);
            return newSet;
          });
          showSuccessToast("Removed from favorites.");
        } else {
          await addFavorite(user.id, idStr);
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.add(idStr);
            return newSet;
          });
          showSuccessToast("Added to favorites!");
        }
      } catch (error) {
        showErrorToast("Error toggling favorite.");
      }
    },
    [favorites, user]
  );

  const ensureFavorite = useCallback(
    async (
      imageId: string | number
    ): Promise<{ favoriteId: number } | null> => {
      if (!user) {
        showErrorToast("Please log in to use favorites.");
        return null;
      }
      const numericId =
        typeof imageId === "string" ? parseInt(imageId, 10) : imageId;
      // 1. Try to find favorite first
      const { data: favorite, error: favError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("image_id", numericId)
        .maybeSingle();

      if (favorite && favorite.id) {
        // Sync with context (optional)
        setFavorites((prev) => new Set(prev).add(String(imageId)));
        return { favoriteId: favorite.id };
      }
      // 2. If not found, create
      const { data: newData, error: addError } = await supabase
        .from("favorites")
        .insert([{ user_id: user.id, image_id: numericId }])
        .select("id")
        .maybeSingle();

      if (addError || !newData || !newData.id) {
        showErrorToast("Failed to create favorite.");
        return null;
      }
      setFavorites((prev) => new Set(prev).add(String(imageId)));
      showSuccessToast("Added to favorites!");
      return { favoriteId: newData.id };
    },
    [user]
  );

  const isFavorite = useCallback(
    (imageId: string | number) => {
      return favorites.has(String(imageId));
    },
    [favorites]
  );

  const isUserLoggedIn = useCallback(() => !!user, [user]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        isFavorite,
        isUserLoggedIn,
        ensureFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
