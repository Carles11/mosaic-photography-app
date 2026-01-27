import { createMainGalleryItemStyles } from "@/2-features/main-gallery/ui/MainGalleryItem.styles";
import { StyleProp, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

export type Photographer = {
  id: string | number;
  name: string;
  surname: string;
  origin: string;
  birthdate?: string;
  deceasedate?: string;
  equipment?: string[];
  biography?: string;
  author?: string;
  website?: string;
  store?: string[];
  instagram?: string;
  random_order?: number;
  slug?: string;
  intro?: string;
};

export type GalleryImage = {
  id: number;
  base_url: string;
  filename: string;
  author: string;
  title: string;
  description: string;
  created_at: string;
  orientation: string;
  width: number;
  height: number;
  print_quality?: string;
  gender?: string;
  color?: string;
  nudity?: string;
  year?: number;
  url: string;
  thumbnailUrl?: string;
  mosaicType?: "normal" | "large" | "wide" | "tall";

  // Optional canonical slug attached by the data layer (fetchers) when available.
  // UI components should prefer this for navigation (item.photographerSlug), and
  // only fall back to a curated canonical map if absolutely necessary.
  photographerSlug?: string;
};

export type MainGalleryItemProps = {
  item: GalleryImage;
  onOpenMenu: () => void;
  onPressComments?: () => void;
  onPressZoom?: () => void;
  itemHeight: number;
  imageHeight: number;
  styles: ReturnType<typeof createMainGalleryItemStyles>;
};

export type GalleryImageWithPhotographer = GalleryImage & {
  photographers?: Photographer;
};

export type GalleryProps = {
  galleryTitle?: string;
  images: GalleryImage[];
  renderItem: (item: GalleryImage, index: number) => React.ReactNode;
  scrollY: any;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  itemHeight?: number;
  extraData?: any;
};

export type MainGalleryProps = {
  onScrollY?: (scrollY: number) => void;
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  onOpenMenu: (image: GalleryImage) => void;
  onPressComments?: (imageId: string) => void;
  scrollY: SharedValue<number>;
  onGalleryScroll?: (scrollY: number) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
};

// Types for filters (mirroring your web app, but omitting "nudity")
export type GalleryFilter = {
  gender?: string;
  orientation?: string;
  color?: string;
  print_quality?: string;
  year?: { from: number; to: number };
  text?: string;
  author?: string[];
  nudity?: "not-nude" | "nude";
};

export type UseGalleryFiltersReturn = {
  filters: GalleryFilter;
  setFilters: (filters: GalleryFilter) => void;
  resetFilters: () => void;
  filtersActive: boolean | undefined;
};

export type ZoomGalleryModalProps = {
  images: GalleryImage[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
};

export type BottomSheetFilterMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  filters: GalleryFilter;
  setFilters: (filters: GalleryFilter) => void;
  resetFilters: () => void;
  photographerNames: string[];
};

export type FetchMainGalleryOptions = {
  bannedTitles?: string[]; // case-insensitive substring match against title
  firstBlockSize?: number; // number of first images that must avoid male-nudity (default 30)
};

export type ZoomImageProps = {
  image: {
    width?: number;
    filename: string;
    base_url: string;
    author?: string;
    year?: string | number;
    description?: string;
    // optional nav slug available when provided by the data layer
    photographerSlug?: string;
  };
  minScale?: number;
  maxScale?: number;
  doubleTapScale?: number;
  loading?: boolean;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: any;
};
