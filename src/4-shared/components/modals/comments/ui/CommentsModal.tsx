import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { Modal } from "@/4-shared/components/modals";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useComments } from "@/4-shared/context/comments";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, TextInput } from "react-native";

type CommentsModalProps = {
  imageId: string;
  visible: boolean;
  onClose: () => void;
};

export const CommentsModal: React.FC<CommentsModalProps> = ({
  imageId,
  visible,
  onClose,
}) => {
  const {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    loadCommentsForImage,
  } = useComments();
  const { user, loading: authLoading } = useAuthSession();

  // Load comments for the image when the modal opens
  useEffect(() => {
    if (visible && imageId) {
      loadCommentsForImage(imageId);
    }
  }, [visible, imageId, loadCommentsForImage]);

  const imageComments = comments[imageId] || [];
  const isLoading = loading[imageId];

  const [commentText, setCommentText] = React.useState("");
  const [editMode, setEditMode] = React.useState<{
    id: string;
    content: string;
  } | null>(null);

  const handleSaveComment = () => {
    if (!user) return;
    if (editMode) {
      updateComment(imageId, editMode.id, user.id, commentText);
      setEditMode(null);
    } else {
      addComment(imageId, user.id, commentText);
    }
    setCommentText("");
  };

  const handleEdit = (commentId: string, content: string) => {
    setEditMode({ id: commentId, content });
    setCommentText(content);
  };

  const handleDelete = (commentId: string) => {
    if (!user) return;
    deleteComment(imageId, commentId, user.id);
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 8 }}>
          Comments
        </ThemedText>
        {isLoading ? (
          <ActivityIndicator size="small" style={{ marginTop: 16 }} />
        ) : (
          <FlatList
            data={imageComments}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <ThemedText style={{ marginTop: 16, color: "#999" }}>
                No comments yet.
              </ThemedText>
            }
            renderItem={({ item }) => (
              <ThemedView
                style={{
                  paddingVertical: 8,
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <ThemedView style={{ flex: 1, width: "100%" }}>
                  <ThemedText type="defaultSemiBold">
                    {item.user_id === user?.id
                      ? "You"
                      : item.user_id || "Anonymous"}
                  </ThemedText>
                  <ThemedText>{item.content}</ThemedText>
                  <ThemedText style={{ fontSize: 10, color: "#999" }}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : ""}
                  </ThemedText>
                </ThemedView>
                {user && user.id === item.user_id && (
                  <ThemedView style={{ flexDirection: "row" }}>
                    <SecondaryButton
                      title="Edit"
                      onPress={() => handleEdit(item.id, item.content)}
                      style={{
                        marginRight: 8,
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                      }}
                    />
                    <SecondaryButton
                      title="Delete"
                      onPress={() => handleDelete(item.id)}
                      style={{ paddingVertical: 2, paddingHorizontal: 8 }}
                    />
                  </ThemedView>
                )}
              </ThemedView>
            )}
          />
        )}
        {user ? (
          <ThemedView style={{ flexDirection: "row", marginTop: 12 }}>
            <TextInput
              style={{
                flex: 1,
                borderColor: "#ccc",
                borderWidth: 1,
                padding: 8,
                borderRadius: 4,
                marginRight: 8,
                backgroundColor: "#fff",
              }}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <PrimaryButton
              title={editMode ? "Update" : "Send"}
              onPress={handleSaveComment}
              disabled={authLoading || !commentText.trim()}
              style={{ paddingVertical: 2, paddingHorizontal: 16 }}
            />
          </ThemedView>
        ) : (
          <ThemedText style={{ marginTop: 16, color: "#999" }}>
            Log in to write and manage your comments.
          </ThemedText>
        )}
        <PrimaryButton
          title="Close"
          onPress={onClose}
          style={{ marginTop: 24 }}
        />
      </ThemedView>
    </Modal>
  );
};
