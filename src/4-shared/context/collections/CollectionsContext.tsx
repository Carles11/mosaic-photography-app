import {
  deleteCollection as apiDeleteCollection,
  fetchCollectionDetail,
  fetchCollectionsBasicForUser,
  fetchCollectionsForUser,
  removeFavoriteFromCollection, // <-- ADD THIS IMPORT
} from "@/4-shared/api/collectionsApi";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import {
  CollectionDetail,
  CollectionWithPreview,
} from "@/4-shared/types/collections";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BasicCollection = { id: string; name: string };

type CollectionsContextType = {
  collections: CollectionWithPreview[];
  loading: boolean;
  detailLoading: boolean;
  detail: CollectionDetail | null;
  reloadCollections: () => Promise<void>;
  createCollection: (params: {
    name: string;
    description?: string;
  }) => Promise<BasicCollection | null>;
  deleteCollection: (collectionId: string) => Promise<boolean>;
  getCollectionDetail: (
    collectionId: string
  ) => Promise<CollectionDetail | null>;
  /** NEW: Remove an image (by favoriteId) from a collection */
  removeImageFromCollection: (
    collectionId: string,
    favoriteId: number
  ) => Promise<boolean>;
  basicCollections: BasicCollection[];
  reloadBasicCollections: () => Promise<void>;
};

const CollectionsContext = createContext<CollectionsContextType | undefined>(
  undefined
);

export const useCollections = (): CollectionsContextType => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};

export function CollectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthSession();

  // List of collections with previews for current user
  const [collections, setCollections] = useState<CollectionWithPreview[]>([]);
  const [loading, setLoading] = useState(true);

  // For AddToCollectionSheet (list of collections with id, name only)
  const [basicCollections, setBasicCollections] = useState<BasicCollection[]>(
    []
  );

  // Detail
  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Helper for current userId
  const userId = user?.id;

  // Effect: fetch all collections with previews when user changes
  const reloadCollections = useCallback(async () => {
    if (!userId) {
      setCollections([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await fetchCollectionsForUser(userId);
      setCollections(result);
    } catch (err) {
      setCollections([]);
      showErrorToast("Failed to load collections.");
    }
    setLoading(false);
  }, [userId]);

  // Effect: fetch all basic collections for current user
  const reloadBasicCollections = useCallback(async () => {
    if (!userId) {
      setBasicCollections([]);
      return;
    }
    try {
      const result = await fetchCollectionsBasicForUser(userId);
      setBasicCollections(result);
    } catch (err) {
      setBasicCollections([]);
      showErrorToast("Failed to load collections list.");
    }
  }, [userId]);

  // Main load on mount/userId change
  useEffect(() => {
    reloadCollections();
    reloadBasicCollections();
  }, [reloadCollections, reloadBasicCollections]);

  // Fetch a collection with images (for detail screens)
  const getCollectionDetail = useCallback(
    async (collectionId: string): Promise<CollectionDetail | null> => {
      setDetailLoading(true);
      try {
        const result = await fetchCollectionDetail(collectionId);
        setDetail(result);
        if (!result) showErrorToast("Collection not found");
        return result;
      } catch (err) {
        setDetail(null);
        showErrorToast("Could not load collection details.");
        return null;
      } finally {
        setDetailLoading(false);
      }
    },
    []
  );

  // Create a new collection. Returns new collection object (id, name), reloads lists.
  const createCollection = useCallback(
    async ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }): Promise<BasicCollection | null> => {
      if (!userId) {
        showErrorToast("Not authenticated.");
        return null;
      }
      if (!name || name.trim() === "") {
        showErrorToast("Collection name is required.");
        return null;
      }
      try {
        // Insert, using direct supabase to get id
        const { data, error } = await import(
          "@/4-shared/api/supabaseClient"
        ).then((mod) =>
          mod.supabase
            .from("collections")
            .insert({
              user_id: userId,
              name: name.trim(),
              description: description?.trim() || null,
            })
            .select()
            .maybeSingle()
        );
        if (error || !data) {
          showErrorToast("Failed to create collection.");
          return null;
        }
        showSuccessToast("Collection created!");
        await reloadCollections();
        await reloadBasicCollections();
        // data.id and data.name should both exist
        return { id: data.id, name: data.name };
      } catch {
        showErrorToast("Failed to create collection.");
        return null;
      }
    },
    [userId, reloadCollections, reloadBasicCollections]
  );

  // Delete a collection
  const deleteCollection = useCallback(
    async (collectionId: string) => {
      setLoading(true);
      try {
        await apiDeleteCollection(collectionId);
        showSuccessToast("Collection deleted!");
        await reloadCollections();
        await reloadBasicCollections();
        return true;
      } catch (err) {
        showErrorToast("Failed to delete collection.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [reloadCollections, reloadBasicCollections]
  );

  // --- NEW: Remove an image from a collection ---
  const removeImageFromCollection = useCallback(
    async (collectionId: string, favoriteId: number): Promise<boolean> => {
      setDetailLoading(true);
      try {
        await removeFavoriteFromCollection(collectionId, favoriteId);
        showSuccessToast("Image removed from collection!");
        // Refresh detail so UI updates
        await getCollectionDetail(collectionId);
        return true;
      } catch (err) {
        showErrorToast("Failed to remove image from collection.");
        return false;
      } finally {
        setDetailLoading(false);
      }
    },
    [getCollectionDetail]
  );

  // Memo for context value
  const value: CollectionsContextType = useMemo(
    () => ({
      collections,
      loading,
      detailLoading,
      detail,
      reloadCollections,
      createCollection,
      deleteCollection,
      getCollectionDetail,
      removeImageFromCollection, // << Add to memo!
      basicCollections,
      reloadBasicCollections,
    }),
    [
      collections,
      loading,
      detailLoading,
      detail,
      reloadCollections,
      createCollection,
      deleteCollection,
      getCollectionDetail,
      removeImageFromCollection,
      basicCollections,
      reloadBasicCollections,
    ]
  );

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}
