import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "@/4-shared/api/favoritesApi";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
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
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  loading: true,
  toggleFavorite: async () => {},
  isFavorite: () => false,
  isUserLoggedIn: () => false,
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
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user]);

  const toggleFavorite = useCallback(
    async (imageId: string | number) => {
      if (!user) return;
      const idStr = String(imageId);
      console.log("toggleFavorite called with imageId:", idStr);
      try {
        const isFav = favorites.has(idStr);
        if (isFav) {
          await removeFavorite(user.id, idStr);
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.delete(idStr);
            return newSet;
          });
        } else {
          await addFavorite(user.id, idStr);
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.add(idStr);
            return newSet;
          });
        }
      } catch (error) {
        console.log("Error toggling favorite:", error);
      }
    },
    [favorites, user]
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
      value={{ favorites, loading, toggleFavorite, isFavorite, isUserLoggedIn }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
