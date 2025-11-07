import { ReportBottomSheetRef } from "@/2-features/reporting/ui/ReportBottomSheet";
import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  OnlyTextButton,
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { Comment } from "@/4-shared/types";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Router } from "expo-router";
import React, { forwardRef } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
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
      <ReusableBottomSheetModal
        ref={ref}
        snapPoints={["80%"]}
        onDismiss={onClose}
        enablePanDownToClose
      >
        <BottomSheetView style={{ flex: 1 }}>
          <SafeAreaView
            edges={["bottom"]}
            style={[styles.safeArea, { flex: 1 }]}
          >
            <View style={{ flex: 1 }}>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  style={styles.loadingIndicator}
                />
              ) : (
                <FlatList
                  style={{ flex: 1 }}
                  data={comments}
                  keyExtractor={(item) => item.id}
                  ListHeaderComponent={
                    <ThemedText type="subtitle" style={styles.commentsTitle}>
                      Comments
                    </ThemedText>
                  }
                  ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>
                      No comments yet.
                    </ThemedText>
                  }
                  contentContainerStyle={{
                    ...styles.commentsList,
                    paddingBottom: 100,
                  }}
                  renderItem={({ item }) => (
                    <ThemedView style={styles.commentItem}>
                      <ThemedView style={styles.commentInfo}>
                        <ThemedText type="defaultSemiBold">
                          {item.user_id === user?.id
                            ? "You"
                            : item.user_id || "Anonymous"}
                        </ThemedText>
                        <ThemedText>{item.content}</ThemedText>
                        <ThemedText style={styles.commentDate}>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : ""}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={styles.editActions}>
                        <ThemedView style={styles.editActionsLeft}>
                          {user && user.id === item.user_id && (
                            <>
                              <OnlyTextButton
                                title="Edit"
                                onPress={() =>
                                  handleEdit(item.id, item.content)
                                }
                                style={styles.editButton}
                              />
                              <PrimaryButton
                                title="Delete"
                                onPress={() => handleDelete(item.id)}
                                style={styles.deleteButton}
                              />
                            </>
                          )}
                        </ThemedView>
                        <IconSymbol
                          name="flag"
                          type="material"
                          size={11}
                          color={theme?.error ?? "#E74C3C"}
                          accessibilityLabel="Report"
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
                          style={styles.reportButtonIcon}
                        />
                      </ThemedView>
                    </ThemedView>
                  )}
                />
              )}
            </View>
            {user ? (
              <ThemedView style={styles.inputRow}>
                <BottomSheetTextInput
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholderTextColor={theme.inputPlaceholderColor ?? "#999"}
                  style={styles.textInput}
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
      </ReusableBottomSheetModal>
    );
  }
);
