import { fetchCommentsForUser } from "@/4-shared/api/commentsApi";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useComments } from "@/4-shared/context/comments/CommentsContext";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { UserCommentWithImage } from "@/4-shared/types/comments";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { styles } from "./CommentsList.styles";

export default function CommentsList() {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuthSession();
  const { updateComment, deleteComment } = useComments();
  const [comments, setComments] = useState<UserCommentWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const result = await fetchCommentsForUser(user.id);
        setComments(result);
      } catch (e) {
        setComments([]);
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const handleEdit = (comment: UserCommentWithImage) => {
    setEditId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditSave = async (comment: UserCommentWithImage) => {
    if (!comment.image_id) return;
    try {
      await updateComment(
        comment.image_id,
        comment.id,
        comment.user_id,
        editContent.trim()
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id ? { ...c, content: editContent.trim() } : c
        )
      );
      setEditId(null);
      setEditContent("");
    } catch (e) {
      Alert.alert("Error", "Failed to update comment.");
    }
  };

  const handleDelete = async (comment: UserCommentWithImage) => {
    if (!comment.image_id) return;
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment(
                comment.image_id,
                comment.id,
                comment.user_id
              );
              setComments((prev) => prev.filter((c) => c.id !== comment.id));
            } catch (e) {
              Alert.alert("Error", "Failed to delete comment.");
            }
          },
        },
      ]
    );
  };

  if (!user?.id) {
    return (
      <ThemedView
        style={[styles.centered, { backgroundColor: theme.background }]}
      >
        <ThemedText style={[styles.emptyText, { color: theme.text }]}>
          Please log in to view your comments.
        </ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView
        style={[styles.centered, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.favoriteIcon} />
        <ThemedText style={[styles.loadingText, { color: theme.text }]}>
          Loading comments...
        </ThemedText>
      </ThemedView>
    );
  }

  if (comments.length === 0) {
    return (
      <ThemedView
        style={[styles.centered, { backgroundColor: theme.background }]}
      >
        <ThemedText style={[styles.emptyIcon, { color: theme.favoriteIcon }]}>
          💬
        </ThemedText>
        <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
          No comments yet
        </ThemedText>
        <ThemedText style={[styles.emptyText, { color: theme.text }]}>
          You haven't commented on any images yet.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: theme.text }]}>
          Your Comments ({comments.length})
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.text }]}>
          All comments you've made on gallery images.
        </ThemedText>
      </ThemedView>
      <FlatList
        data={comments}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const image = item.image;
          let thumbnailUrl = "";
          if (image) {
            const { url } = getBestS3FolderForWidth(image, 100);
            thumbnailUrl = url;
          }
          return (
            <ThemedView style={styles.imageCard}>
              <Image
                source={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <ThemedView style={styles.imageInfo}>
                <ThemedText style={styles.imageAuthor}>
                  {image?.author}
                </ThemedText>
                <ThemedText style={styles.imageTitle}>
                  {image?.title}
                </ThemedText>
                <ThemedText style={styles.imageYear}>{image?.year}</ThemedText>
                {editId === item.id ? (
                  <>
                    <ThemedText style={[styles.editLabel, { marginTop: 8 }]}>
                      Editing:
                    </ThemedText>
                    <TextInput
                      value={editContent}
                      onChangeText={setEditContent}
                      style={styles.editTextArea}
                      autoFocus
                      multiline
                      maxLength={500}
                      placeholder="Edit your comment..."
                    />
                    <ThemedView style={styles.editActions}>
                      <PrimaryButton
                        title="Save"
                        onPress={() => handleEditSave(item)}
                        disabled={authLoading || !editContent.trim()}
                      />
                      <SecondaryButton
                        title="Cancel"
                        onPress={() => setEditId(null)}
                      />
                    </ThemedView>
                  </>
                ) : (
                  <>
                    <ThemedText
                      style={styles.menuItemText}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {item.content}
                    </ThemedText>
                    <ThemedText style={styles.commentDate}>
                      {new Date(item.created_at).toLocaleString()}
                    </ThemedText>
                    <ThemedView style={styles.commentActions}>
                      <SecondaryButton
                        title="Edit"
                        onPress={() => handleEdit(item)}
                        style={styles.editButton}
                      />
                      <SecondaryButton
                        title="Delete"
                        onPress={() => handleDelete(item)}
                        style={styles.deleteButton}
                      />
                    </ThemedView>
                  </>
                )}
              </ThemedView>
            </ThemedView>
          );
        }}
      />
    </ThemedView>
  );
}
