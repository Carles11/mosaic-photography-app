import { Modal } from "@/4-shared/components/modals";
import { ThemedText } from "@/4-shared/components/themed-text";
import { IconSymbol } from "@/4-shared/components/ui/icon-symbol";
import { useComments } from "@/4-shared/context/comments";
import React, { useEffect, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./CommentsModal.styles";

type CommentsModalProps = {
  visible: boolean;
  imageId: string;
  onClose: () => void;
};

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  imageId,
  onClose,
}) => {
  // TEMP PATCH: Replace with real useAuthSession later
  const user = { id: "anon-id-123", email: "anon@example.com" }; // null for "not logged in"

  const {
    getCommentsForImage,
    addComment,
    updateComment,
    deleteComment,
    loadCommentsForImage,
    loading,
  } = useComments();
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCommentsForImage(imageId);
    }
  }, [visible, imageId, loadCommentsForImage]);

  const comments = getCommentsForImage(imageId);

  const handleAdd = async () => {
    if (!input.trim() || !user) return;
    setSubmitting(true);
    try {
      await addComment(imageId, user.id, input.trim());
      setInput("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingContent.trim() || !user) return;
    setSubmitting(true);
    try {
      await updateComment(editingId, user.id, editingContent.trim());
      setEditingId(null);
      setEditingContent("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await deleteComment(commentId, user.id, imageId);
      if (editingId === commentId) {
        setEditingId(null);
        setEditingContent("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  type Comment = {
    id: string;
    user_id: string;
    user_name?: string;
    user_email?: string;
    content: string;
  };

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentRow}>
      <View style={styles.commentContent}>
        <ThemedText style={styles.commentUser}>
          {item.user_name || item.user_email || "User"}
        </ThemedText>
        {editingId === item.id ? (
          <TextInput
            style={styles.input}
            value={editingContent}
            onChangeText={setEditingContent}
            editable={!submitting}
            autoFocus
          />
        ) : (
          <ThemedText style={styles.commentText}>{item.content}</ThemedText>
        )}
      </View>
      {user && item.user_id === user.id && (
        <View style={styles.actions}>
          {editingId === item.id ? (
            <TouchableOpacity
              onPress={handleUpdate}
              disabled={submitting}
              style={styles.actionBtn}
            >
              <IconSymbol
                type="material"
                name="check"
                size={20}
                color="#4caf50"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setEditingId(item.id);
                setEditingContent(item.content);
              }}
              disabled={submitting}
              style={styles.actionBtn}
            >
              <IconSymbol
                type="material"
                name="edit"
                size={20}
                color="#1976d2"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            disabled={submitting}
            style={styles.actionBtn}
          >
            <IconSymbol
              type="material"
              name="delete"
              size={20}
              color="#e53935"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Comments"
      disableBackdropPress={submitting}
      contentContainerStyle={styles.modalContainer}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>No comments yet.</ThemedText>
        }
        style={styles.list}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      {user && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={input}
            onChangeText={setInput}
            editable={!submitting}
            onSubmitEditing={handleAdd}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={handleAdd}
            disabled={submitting || !input.trim()}
            style={styles.sendBtn}
          >
            <IconSymbol type="material" name="send" size={22} color="#1976d2" />
          </TouchableOpacity>
        </View>
      )}
      {!user && (
        <View style={styles.inputRow}>
          <ThemedText style={{ color: "#888", textAlign: "center" }}>
            Please log in to comment.
          </ThemedText>
        </View>
      )}
    </Modal>
  );
};
