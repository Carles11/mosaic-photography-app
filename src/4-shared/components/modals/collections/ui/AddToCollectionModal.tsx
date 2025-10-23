import { supabase } from "@/4-shared/api/supabaseClient";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { Modal } from "@/4-shared/components/modals";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";

type AddToCollectionModalProps = {
  imageId: string | number | null;
  visible: boolean;
  onClose: () => void;
  onAdded?: () => void;
};

type Collection = {
  id: string;
  name: string;
};

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  imageId,
  visible,
  onClose,
  onAdded,
}) => {
  const { user } = useAuthSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (visible && user?.id) {
      setLoading(true);
      supabase
        .from("collections")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setCollections(data);
          } else {
            setCollections([]);
          }
          setLoading(false);
        });
    }
    if (!visible) {
      setFeedback(null);
    }
  }, [visible, user?.id]);

  const handleAdd = async (collectionId: string) => {
    if (!imageId || !user?.id) return;
    setAdding(true);
    setFeedback(null);

    // Find the favorite record for this image and user
    const { data: favorite, error: favError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("image_id", imageId)
      .maybeSingle();

    if (favError || !favorite) {
      setFeedback("Favorite record not found for this image.");
      setAdding(false);
      return;
    }

    const favoriteId = favorite.id;

    // Now insert into collection_favorites using the favorite id
    const { error } = await supabase.from("collection_favorites").insert({
      collection_id: collectionId,
      favorite_id: favoriteId,
    });

    if (error) {
      // Check if it's a duplicate error (unique violation)
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
        onClose();
        setFeedback(null);
      }, 900);
    }
    setAdding(false);
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 12 }}>
          Add to a Collection
        </ThemedText>
        {loading ? (
          <ActivityIndicator size="small" style={{ marginTop: 16 }} />
        ) : (
          <FlatList
            data={collections}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <ThemedText style={{ marginTop: 16, color: "#999" }}>
                You have no collections yet.
              </ThemedText>
            }
            renderItem={({ item }) => (
              <PrimaryButton
                title={item.name}
                onPress={() => handleAdd(item.id)}
                style={{
                  marginVertical: 6,
                  opacity: adding ? 0.6 : 1,
                }}
                disabled={adding}
              />
            )}
          />
        )}
        {feedback && (
          <ThemedText
            style={{
              color: feedback.includes("Failed") ? "red" : "green",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {feedback}
          </ThemedText>
        )}
        <SecondaryButton
          title="Close"
          onPress={onClose}
          style={{ marginTop: 18 }}
        />
      </ThemedView>
    </Modal>
  );
};
