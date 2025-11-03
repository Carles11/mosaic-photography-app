import { fetchCollectionsBasicForUser } from "@/4-shared/api/collectionsApi";
import { supabase } from "@/4-shared/api/supabaseClient";
import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  OnlyTextButton,
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, FlatList, TextInput, View } from "react-native";
import { styles } from "./AddToCollectionSheet.styles";

export type AddToCollectionSheetRef = {
  open: (imageId: string | number) => void;
  close: () => void;
};

type Props = {
  onAdded?: () => void;
};

type Collection = {
  id: string;
  name: string;
};

const AddToCollectionSheet = forwardRef<AddToCollectionSheetRef, Props>(
  ({ onAdded }, ref) => {
    const { user } = useAuthSession();
    const { theme } = useTheme();
    const sheetRef = useRef<any>(null);

    const [collections, setCollections] = useState<Collection[]>([]);
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [adding, setAdding] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
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

    // Snap to 99% when create mode is enabled
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
        setLoadingCollections(true);
        fetchCollectionsBasicForUser(user.id)
          .then((data) => setCollections(data))
          .catch(() => setCollections([]))
          .finally(() => setLoadingCollections(false));
      }
      if (!selectedImageId) setCollections([]);
      setFeedback(null);
      setShowCreateForm(false);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setCreatingCollection(false);
    }, [selectedImageId, user?.id]);

    const handleAdd = useCallback(
      async (collectionId: string) => {
        if (!selectedImageId || !user?.id) return;
        setAdding(true);
        setFeedback(null);

        const { data: favorite, error: favError } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("image_id", selectedImageId)
          .maybeSingle();

        if (favError || !favorite) {
          setFeedback("Favorite record not found for this image.");
          setAdding(false);
          return;
        }
        const favoriteId = favorite.id;

        const { error } = await supabase.from("collection_favorites").insert({
          collection_id: collectionId,
          favorite_id: favoriteId,
        });

        if (error) {
          if (
            error.code === "23505" ||
            (error.message && error.message.toLowerCase().includes("duplicate"))
          ) {
            setFeedback("Already in this collection!");
          } else {
            setFeedback("Failed to add to collection.");
          }
        } else {
          setFeedback("Added to collection!");
          if (onAdded) onAdded();
          setTimeout(() => {
            sheetRef.current?.dismiss();
            setFeedback(null);
          }, 900);
        }
        setAdding(false);
      },
      [selectedImageId, user, onAdded]
    );

    const handleAddToNewCollection = async () => {
      if (!user?.id || !selectedImageId) return;
      if (!newCollectionName.trim()) {
        setFeedback("Collection name is required.");
        return;
      }
      setCreatingCollection(true);
      setFeedback(null);

      // 1. Create the new collection
      const { data: collectionInsert, error: collectionError } = await supabase
        .from("collections")
        .insert({
          name: newCollectionName.trim(),
          description: newCollectionDescription.trim() || null,
          user_id: user.id,
        })
        .select("id")
        .maybeSingle();

      if (collectionError || !collectionInsert || !collectionInsert.id) {
        setFeedback("Failed to create collection.");
        setCreatingCollection(false);
        return;
      }

      // 2. Find the favorite for this image/user
      const { data: favorite, error: favError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("image_id", selectedImageId)
        .maybeSingle();

      if (favError || !favorite) {
        setFeedback("Favorite record not found for this image.");
        setCreatingCollection(false);
        return;
      }

      // 3. Add the favorite to the new collection
      const { error: addError } = await supabase
        .from("collection_favorites")
        .insert({
          collection_id: collectionInsert.id,
          favorite_id: favorite.id,
        });

      if (addError) {
        setFeedback("Failed to add to new collection.");
        setCreatingCollection(false);
        return;
      }

      setFeedback("Created and added to new collection!");
      setNewCollectionName("");
      setNewCollectionDescription("");
      setShowCreateForm(false);

      // Optionally, refresh collections
      fetchCollectionsBasicForUser(user.id)
        .then((data) => setCollections(data))
        .catch(() => {})
        .finally(() => {});

      if (onAdded) onAdded();

      setTimeout(() => {
        sheetRef.current?.dismiss();
        setFeedback(null);
      }, 900);

      setCreatingCollection(false);
    };

    const handleSheetDismiss = () => {
      setSelectedImageId(null);
      setFeedback(null);
      setAdding(false);
      setShowCreateForm(false);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setCreatingCollection(false);
      setCollections([]);
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
          <ThemedText
            type="title"
            style={[styles.title, { color: theme.text }]}
          >
            Add to a Collection
          </ThemedText>
          {loadingCollections ? (
            <ActivityIndicator size="small" style={styles.loadingIndicator} />
          ) : (
            <ThemedView style={{ flex: 1, backgroundColor: theme.background }}>
              {!showCreateForm ? (
                <>
                  <FlatList<Collection>
                    data={collections}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                      <ThemedText
                        style={[styles.emptyText, { color: theme.text }]}
                      >
                        You have no collections yet.
                      </ThemedText>
                    }
                    renderItem={({ item }: { item: Collection }) => (
                      <OnlyTextButton
                        title={item.name}
                        onPress={() => handleAdd(item.id)}
                        disabled={adding || creatingCollection}
                        textStyle={{ color: theme.text }}
                      />
                    )}
                    contentContainerStyle={[
                      styles.listContent,
                      { backgroundColor: theme.background },
                    ]}
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
                <View
                  style={[
                    styles.createForm,
                    { backgroundColor: theme.background, flex: 1 },
                  ]}
                >
                  <ThemedText
                    type="subtitle"
                    style={[styles.title, { color: theme.text }]}
                  >
                    Create a new Collection and add this image to it.
                  </ThemedText>
                  <TextInput
                    placeholder="Collection Name"
                    value={newCollectionName}
                    onChangeText={setNewCollectionName}
                    style={styles.input}
                    editable={!creatingCollection}
                    autoFocus
                    onFocus={() => {
                      // Snap to 99% if not already there
                      if (sheetRef.current?.snapToIndex) {
                        sheetRef.current.snapToIndex(1);
                      }
                    }}
                  />
                  <TextInput
                    placeholder="Description (optional)"
                    value={newCollectionDescription}
                    onChangeText={setNewCollectionDescription}
                    style={[styles.input, { marginBottom: 8 }]}
                    editable={!creatingCollection}
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
                </View>
              )}
            </ThemedView>
          )}
          {feedback && (
            <ThemedText style={styles.feedback(feedback)}>
              {feedback}
            </ThemedText>
          )}
        </BottomSheetView>
      </ReusableBottomSheetModal>
    );
  }
);

export default AddToCollectionSheet;
