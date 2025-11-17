import { GalleryImage } from "./gallery";

type TimelineOrientation = "HORIZONTAL" | "VERTICAL" | "VERTICAL_ALTERNATING";

export interface PhotographerSlug {
  id: string;
  name: string;
  surname: string;
  slug: string;
  author: string;
  origin?: string;
  biography?: string;
  birthdate?: string;
  deceasedate?: string;
  website?: string;
  store?: { store: string; website: string; affiliate?: boolean }[] | string[];
  images?: GalleryImage[];
}

export interface TimelineItemModelProps {
  title?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
  eventType: "personal" | "historical";
  media?: { type: string; source: { url: string }; name?: string };
  timelineContent?: React.ReactNode;
  [key: string]: unknown;
}

export interface ChronoProps {
  items: TimelineItemModelProps[];
  mode?: TimelineOrientation;
  theme?: unknown;
  [key: string]: unknown;
}

export interface TimelineProps {
  events: TimelineItemModelProps[];
  orientation?: TimelineOrientation;
  width?: string | number;
  height?: string | number;
  // You can add more props like theme, etc.
}

export type PhotographerDetail = {
  name: string;
  surname: string;
  birthdate?: string | null;
  deceasedate?: string | null;
  images?: { filename: string; url: string }[];
};

export type PhotographerPortraitHeaderProps = {
  photographer: PhotographerDetail;
};

export interface Store {
  store: string;
  website: string;
  affiliate?: boolean;
}

export interface PhotographerLinksProps {
  stores?: Store[] | string[];
  website?: string;
}

export interface PhotographerListItem {
  id: string;
  name: string;
  surname: string;
  slug: string;
  portrait: string;
  intro: string;
}

export type PhotographersSliderProps = {
  onPhotographerPress?: (photographer: PhotographerListItem) => void;
};

export interface TimelineProps {
  events: TimelineItemModelProps[];
}

export type WebGalleryMessageProps = {
  style?: object;
  slug: string;
  name: string;
  surname: string;
};

export interface HomeHeaderWithSliderProps {
  onPhotographerPress: (photographer: any) => void;
}
