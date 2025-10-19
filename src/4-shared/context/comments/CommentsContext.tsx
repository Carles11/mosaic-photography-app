import {
  addComment as apiAddComment,
  deleteComment as apiDeleteComment,
  updateComment as apiUpdateComment,
  Comment,
  fetchCommentCountsBatch,
  fetchCommentsForImage,
} from "@/4-shared/api/commentsApi";
import type { ReactNode } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type CommentsContextType = {
  comments: Record<string, Comment[]>;
  loading: Record<string, boolean>;
  commentCounts: Record<string, number>;
  getCommentsForImage: (imageId: string) => Comment[];
  getCommentCount: (imageId: string) => number;
  loadCommentCountsBatch: (imageIds: string[]) => Promise<void>;
  addComment: (
    imageId: string,
    userId: string,
    content: string
  ) => Promise<void>;
  updateComment: (
    commentId: string,
    userId: string,
    content: string
  ) => Promise<void>;
  deleteComment: (
    commentId: string,
    userId: string,
    imageId: string
  ) => Promise<void>;
  loadCommentsForImage: (imageId: string) => Promise<void>;
};

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined
);

export const useComments = (): CommentsContextType => {
  const context = useContext(CommentsContext);
  if (!context)
    throw new Error("useComments must be used within a CommentsProvider");
  return context;
};

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {}
  );

  const commentsRef = useRef(comments);
  const loadingRef = useRef(loading);
  const commentCountsRef = useRef(commentCounts);

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    commentCountsRef.current = commentCounts;
  }, [commentCounts]);

  const getCommentsForImage = useCallback(
    (imageId: string) => {
      return comments[imageId] || [];
    },
    [comments]
  );

  const getCommentCount = useCallback(
    (imageId: string) => {
      return commentCounts[imageId] || 0;
    },
    [commentCounts]
  );

  const loadCommentCountsBatch = useCallback(async (imageIds: string[]) => {
    if (!imageIds.length) return;
    try {
      const counts = await fetchCommentCountsBatch(imageIds);
      setCommentCounts((prev) => ({ ...prev, ...counts }));
    } catch (err) {
      console.error("Failed to load comment counts batch", err);
    }
  }, []);

  const loadCommentsForImage = useCallback(async (imageId: string) => {
    if (!imageId) {
      return;
    }
    if (
      loadingRef.current[imageId] ||
      commentsRef.current[imageId] !== undefined
    )
      return;
    setLoading((prev) => ({ ...prev, [imageId]: true }));
    try {
      const data = await fetchCommentsForImage(imageId);
      setComments((prev) => ({ ...prev, [imageId]: data }));
      setCommentCounts((prev) => ({ ...prev, [imageId]: data.length }));
    } catch (error) {
      setComments((prev) => ({ ...prev, [imageId]: [] }));
    } finally {
      setLoading((prev) => ({ ...prev, [imageId]: false }));
    }
  }, []);

  const addComment = useCallback(
    async (imageId: string, userId: string, content: string) => {
      if (!content.trim()) return;
      try {
        const comment = await apiAddComment(imageId, userId, content.trim());
        setComments((prev) => ({
          ...prev,
          [imageId]: [...(prev[imageId] || []), comment],
        }));
        setCommentCounts((prev) => ({
          ...prev,
          [imageId]: (prev[imageId] || 0) + 1,
        }));
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const updateComment = useCallback(
    async (commentId: string, userId: string, content: string) => {
      if (!content.trim()) return;
      try {
        const updated = await apiUpdateComment(
          commentId,
          userId,
          content.trim()
        );
        setComments((prev) => {
          const newComments = { ...prev };
          Object.keys(newComments).forEach((imageId) => {
            newComments[imageId] = newComments[imageId].map((comment) =>
              comment.id === commentId
                ? { ...comment, content: updated.content }
                : comment
            );
          });
          return newComments;
        });
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const deleteComment = useCallback(
    async (commentId: string, userId: string, imageId: string) => {
      try {
        await apiDeleteComment(commentId, userId);
        setComments((prev) => ({
          ...prev,
          [imageId]: (prev[imageId] || []).filter(
            (comment) => comment.id !== commentId
          ),
        }));
        setCommentCounts((prev) => ({
          ...prev,
          [imageId]: Math.max((prev[imageId] || 1) - 1, 0),
        }));
      } catch (error) {
        throw error;
      }
    },
    []
  );

  return (
    <CommentsContext.Provider
      value={{
        comments,
        loading,
        commentCounts,
        getCommentsForImage,
        getCommentCount,
        loadCommentCountsBatch,
        addComment,
        updateComment,
        deleteComment,
        loadCommentsForImage,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}
