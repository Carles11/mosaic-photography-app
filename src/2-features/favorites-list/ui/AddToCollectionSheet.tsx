import { fetchCollectionsBasicForUser } from "@/4-shared/api/collectionsApi";
import { supabase } from "@/4-shared/api/supabaseClient";
import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
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
import { ActivityIndicator, FlatList } from "react-native";
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
    const { theme, mode } = useTheme();
    const sheetRef = useRef<any>(null);

    const [collections, setCollections] = useState<Collection[]>([]);
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [adding, setAdding] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<
      string | number | null
    >(null);

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

    const handleSheetDismiss = () => {
      setSelectedImageId(null);
      setFeedback(null);
      setAdding(false);
      setCollections([]);
    };

    return (
      <ReusableBottomSheetModal
        ref={sheetRef}
        snapPoints={["60%"]}
        enablePanDownToClose
        index={0}
        keyboardBehavior="interactive"
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
            <ThemedView style={{ flex: 1 }}>
              <FlatList<Collection>
                data={collections}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <ThemedText style={styles.emptyText}>
                    You have no collections yet.
                  </ThemedText>
                }
                renderItem={({ item }: { item: Collection }) => (
                  <PrimaryButton
                    title={item.name}
                    onPress={() => handleAdd(item.id)}
                    disabled={adding}
                  />
                )}
                contentContainerStyle={[
                  styles.listContent,
                  { backgroundColor: theme.background },
                ]}
              />
            </ThemedView>
          )}
          {feedback && (
            <ThemedText style={styles.feedback(feedback)}>
              {feedback}
            </ThemedText>
          )}
          <SecondaryButton
            title="Close"
            onPress={() => sheetRef.current?.dismiss()}
            style={styles.closeButton}
            disabled={adding}
          />
        </BottomSheetView>
      </ReusableBottomSheetModal>
    );
  }
);

export default AddToCollectionSheet;
