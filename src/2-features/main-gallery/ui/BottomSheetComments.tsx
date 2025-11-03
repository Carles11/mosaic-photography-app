import { ReportBottomSheetRef } from "@/2-features/reporting/ui/ReportBottomSheet";
import { BottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  OnlyTextButton,
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { Comment } from "@/4-shared/types";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Router } from "expo-router";
import React, { forwardRef } from "react";
import { ActivityIndicator, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./BottomSheetComments.styles";

type EditMode = { id: string; content: string } | null;

type BottomSheetCommentsProps = {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  isLoading: boolean;
  commentText: string;
  setCommentText: (txt: string) => void;
  handleSaveComment: () => void;
  handleEdit: (id: string, content: string) => void;
  handleDelete: (id: string) => void;
  editMode: EditMode;
  user: { id: string } | null;
  authLoading: boolean;
  reportSheetRef: React.RefObject<ReportBottomSheetRef | null>;
  router: Router;
};

export const BottomSheetComments = forwardRef<any, BottomSheetCommentsProps>(
  (
    {
      isOpen,
      onClose,
      comments,
      isLoading,
      commentText,
      setCommentText,
      handleSaveComment,
      handleEdit,
      handleDelete,
      editMode,
      user,
      authLoading,
      reportSheetRef,
      router,
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["80%"]}
        onDismiss={onClose}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.sheetView}>
          <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
            <ThemedText
              type="subtitle"
              style={[styles.commentsTitle, { color: theme.text }]}
            >
              Comments
            </ThemedText>
            {isLoading ? (
              <ActivityIndicator size="small" style={styles.loadingIndicator} />
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <ThemedText style={styles.emptyText}>
                    No comments yet.
                  </ThemedText>
                }
                renderItem={({ item }) => (
                  <ThemedView
                    style={[
                      styles.commentItem,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <ThemedView
                      style={[
                        styles.commentInfo,
                        { backgroundColor: theme.background },
                      ]}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: theme.text }}
                      >
                        {item.user_id === user?.id
                          ? "You"
                          : item.user_id || "Anonymous"}
                      </ThemedText>
                      <ThemedText style={{ color: theme.text }}>
                        {item.content}
                      </ThemedText>
                      <ThemedText
                        style={[styles.commentDate, { color: theme.text }]}
                      >
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : ""}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView
                      style={[
                        styles.editActions,
                        { backgroundColor: theme.background },
                      ]}
                    >
                      {user && user.id === item.user_id && (
                        <>
                          <OnlyTextButton
                            title="Edit"
                            onPress={() => handleEdit(item.id, item.content)}
                            style={styles.editButton}
                          />
                          <PrimaryButton
                            title="Delete"
                            onPress={() => handleDelete(item.id)}
                            style={styles.deleteButton}
                          />
                        </>
                      )}
                      {/* REPORT BUTTON: Always visible */}
                      <OnlyTextButton
                        title="Report"
                        onPress={() => {
                          if (!user) {
                            router.push("/auth/login");
                          } else {
                            reportSheetRef.current?.open({
                              commentId: item.id,
                              reportedUserId: item.user_id,
                            });
                          }
                        }}
                        style={styles.reportButton}
                      />
                    </ThemedView>
                  </ThemedView>
                )}
              />
            )}
            {user ? (
              <ThemedView
                style={[styles.inputRow, { backgroundColor: theme.background }]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholderTextColor="#999"
                />
                <PrimaryButton
                  title={editMode ? "Update" : "Send"}
                  onPress={handleSaveComment}
                  disabled={authLoading || !commentText.trim()}
                  style={styles.sendButton}
                />
              </ThemedView>
            ) : (
              <ThemedText style={styles.loginText}>
                Log in to write and manage your comments.
              </ThemedText>
            )}
            <SecondaryButton
              title="Close"
              onPress={onClose}
              style={styles.closeButton}
            />
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
