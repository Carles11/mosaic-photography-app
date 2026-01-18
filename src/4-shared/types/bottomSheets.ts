import { Router } from "expo-router";
import { StyleProp, ViewStyle } from "react-native";
import { DownloadOption } from "../lib/getAvailableDownloadOptionsForImage";
import { GalleryImage } from "./gallery";

export type BottomSheetThreeDotsMenuProps = {
  onClose: () => void;
  selectedImage: GalleryImage | null;
  onAddToFavorites?: () => void;
  isFavorite?: (imageId: string | number) => void;
  onShare?: () => void;
  downloadOptions?: DownloadOption[];
  onDownloadOption?: (option: DownloadOption) => void;
  // NEW props for reporting
  onReport?: () => void;
  user?: { id: string } | null;
  router?: Router;
};

export type DownloadOptionsPanelProps = {
  originalOption?: DownloadOption | null;
  webpOptions: DownloadOption[];
  selectedImage: Pick<GalleryImage, "print_quality" | "width" | "height">;
  onDownloadOption: (option: DownloadOption) => void;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
};
