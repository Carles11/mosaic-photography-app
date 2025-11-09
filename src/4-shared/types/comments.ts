import { ReportBottomSheetRef } from "@/2-features/reporting/ui/ReportBottomSheet";
import { Router } from "expo-router";

export type Comment = {
  id: string;
  user_id: string;
  image_id: string;
  content: string;
  created_at: string;
  user_name?: string; // Optionally hydrate with profile info
};

export type UserCommentWithImage = Comment & {
  image: {
    id: string;
    base_url: string;
    filename: string;
    author: string;
    title: string;
    description: string;
    orientation: string;
    created_at: string;
    width: number;
    height: number;
    year: number;
    photographers: {
      slug: string;
    } | null;
  } | null;
};

export type EditMode = { id: string; content: string } | null;

export type BottomSheetCommentsProps = {
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
