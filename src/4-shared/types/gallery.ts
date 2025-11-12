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
};

export type MainGalleryItemProps = {
  item: GalleryImage;
  onOpenMenu: () => void;
  onPressComments?: () => void;
  onPressZoom?: () => void;
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
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  onOpenMenu: (image: GalleryImage) => void;
  onPressComments?: (imageId: string) => void;
  scrollY: SharedValue<number>;
  onGalleryScroll?: (scrollY: number) => void;
};

// Types for filters (mirroring your web app, but omitting "nudity")
export type GalleryFilter = {
  gender?: string;
  orientation?: string;
  color?: string;
  print_quality?: string;
  year?: { from: number; to: number };
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
};
