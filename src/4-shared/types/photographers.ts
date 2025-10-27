type TimelineOrientation = "HORIZONTAL" | "VERTICAL" | "VERTICAL_ALTERNATING";

export interface PhotographerImage {
  id: string;
  filename: string;
  base_url: string;
  width: number;
  year: number;
  url: string;
  title?: string;
  description?: string;
}

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
  images?: PhotographerImage[];
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
