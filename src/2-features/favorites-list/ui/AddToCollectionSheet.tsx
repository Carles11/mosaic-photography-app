import { addFavoriteToCollection } from "@/4-shared/api/collectionsApi";
import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  OnlyTextButton,
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useCollections } from "@/4-shared/context/collections/CollectionsContext";
import { useFavorites } from "@/4-shared/context/favorites";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FlatList } from "react-native";
import { styles } from "./AddToCollectionSheet.styles";

export type AddToCollectionSheetRef = {
  open: (imageId: string | number) => void;
  close: () => void;
};

type Props = {
  onAdded?: () => void;
};

const AddToCollectionSheet = forwardRef<AddToCollectionSheetRef, Props>(
  ({ onAdded }, ref) => {
    const { user } = useAuthSession();
    const { theme } = useTheme();
    const sheetRef = useRef<any>(null);

    const { basicCollections, reloadBasicCollections, createCollection } =
      useCollections();
    const { ensureFavorite } = useFavorites();

    const [adding, setAdding] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<
      string | number | null
    >(null);

    // For new collection inline form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDescription, setNewCollectionDescription] =
      useState("");
    const [creatingCollection, setCreatingCollection] = useState(false);

    useImperativeHandle(ref, () => ({
      open: (imageId: string | number) => {
        setSelectedImageId(imageId);
        sheetRef.current?.present();
      },
      close: () => {
        sheetRef.current?.dismiss();
      },
    }));

    useEffect(() => {
      if (showCreateForm && sheetRef.current?.snapToIndex) {
        sheetRef.current.snapToIndex(1); // 1 = 99%
      }
    }, [showCreateForm]);

    useEffect(() => {
      if (
        sheetRef.current &&
        sheetRef.current.present &&
        selectedImageId &&
        user?.id
      ) {
        reloadBasicCollections();
      }
      if (!selectedImageId) {
        setShowCreateForm(false);
        setNewCollectionName("");
        setNewCollectionDescription("");
        setCreatingCollection(false);
      }
    }, [selectedImageId, user?.id, reloadBasicCollections]);

    const handleAdd = useCallback(
      async (collectionId: string) => {
        if (!selectedImageId || !user?.id) return;
        setAdding(true);

        const result = await ensureFavorite(selectedImageId);
        if (!result || !result.favoriteId) {
          setAdding(false);
          return;
        }
        const favoriteId = result.favoriteId;

        try {
          await addFavoriteToCollection(collectionId, favoriteId);
          showSuccessToast("Added to collection!");
          if (onAdded) onAdded();
          setTimeout(() => {
            sheetRef.current?.dismiss();
          }, 900);
        } catch (error: any) {
          if (error.message === "Already in this collection!") {
            showErrorToast(error.message);
          } else {
            showErrorToast("Failed to add to collection.");
          }
        }

        setAdding(false);
      },
      [selectedImageId, user, onAdded, ensureFavorite]
    );

    const handleAddToNewCollection = async () => {
      if (!user?.id || !selectedImageId) return;
      if (!newCollectionName.trim()) {
        showErrorToast("Collection name is required.");
        return;
      }
      setCreatingCollection(true);

      const created = await createCollection({
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim(),
      });

      if (!created) {
        setCreatingCollection(false);
        return;
      }

      const result = await ensureFavorite(selectedImageId);
      if (!result || !result.favoriteId) {
        setCreatingCollection(false);
        return;
      }

      await reloadBasicCollections();
      const fresh = (basicCollections || []).find(
        (col) =>
          col.name.trim().toLowerCase() ===
          newCollectionName.trim().toLowerCase()
      );
      const newCollectionId = fresh?.id;
      if (!newCollectionId) {
        showErrorToast("Failed to find the new collection.");
        setCreatingCollection(false);
        return;
      }

      try {
        await addFavoriteToCollection(newCollectionId, result.favoriteId);
        showSuccessToast("Created and added to new collection!");
        setNewCollectionName("");
        setNewCollectionDescription("");
        setShowCreateForm(false);
        if (onAdded) onAdded();
        setTimeout(() => {
          sheetRef.current?.dismiss();
        }, 900);
      } catch (error: any) {
        if (error.message === "Already in this collection!") {
          showErrorToast(error.message);
        } else {
          showErrorToast("Failed to add to new collection.");
        }
      }

      setCreatingCollection(false);
    };

    const handleSheetDismiss = () => {
      setSelectedImageId(null);
      setAdding(false);
      setShowCreateForm(false);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setCreatingCollection(false);
    };

    return (
      <ReusableBottomSheetModal
        ref={sheetRef}
        snapPoints={showCreateForm ? ["60%", "99%"] : ["70%", "99%"]}
        enablePanDownToClose
        index={0}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        onDismiss={handleSheetDismiss}
      >
        <BottomSheetView style={styles.sheet}>
          <ThemedText type="title" style={styles.title}>
            Add to a Collection
          </ThemedText>
          <ThemedView style={{ flex: 1 }}>
            {!showCreateForm ? (
              <>
                <FlatList
                  data={basicCollections}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>
                      You have no collections yet.
                    </ThemedText>
                  }
                  renderItem={({ item }) => (
                    <OnlyTextButton
                      title={item.name}
                      onPress={() => handleAdd(item.id)}
                      disabled={adding || creatingCollection}
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                />
                <PrimaryButton
                  title="Add to a new collection"
                  style={styles.createForm}
                  onPress={() => setShowCreateForm(true)}
                  disabled={adding || creatingCollection}
                />
                <SecondaryButton
                  title="Close"
                  onPress={() => sheetRef.current?.dismiss()}
                  style={styles.closeButton}
                  disabled={adding || creatingCollection}
                />
              </>
            ) : (
              <ThemedView style={styles.createForm}>
                <ThemedText style={styles.title}>
                  Create a new Collection and add this image to it.
                </ThemedText>
                <BottomSheetTextInput
                  placeholder="Collection Name"
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  style={styles.input}
                  editable={!creatingCollection}
                  autoFocus
                  onFocus={() => {
                    if (sheetRef.current?.snapToIndex) {
                      sheetRef.current.snapToIndex(1);
                    }
                  }}
                  placeholderTextColor={theme.inputPlaceholderColor}
                />
                <BottomSheetTextInput
                  placeholder="Description (optional)"
                  value={newCollectionDescription}
                  onChangeText={setNewCollectionDescription}
                  style={[styles.input, { marginBottom: 8 }]}
                  editable={!creatingCollection}
                  placeholderTextColor={theme.inputPlaceholderColor}
                />
                <PrimaryButton
                  title={creatingCollection ? "Creating..." : "Create & Add"}
                  style={styles.createButton}
                  onPress={handleAddToNewCollection}
                  disabled={creatingCollection || adding}
                />
                <SecondaryButton
                  title="Cancel"
                  style={styles.cancelButton}
                  onPress={() => setShowCreateForm(false)}
                  disabled={creatingCollection}
                />
              </ThemedView>
            )}
          </ThemedView>
        </BottomSheetView>
      </ReusableBottomSheetModal>
    );
  }
);

export default AddToCollectionSheet;
