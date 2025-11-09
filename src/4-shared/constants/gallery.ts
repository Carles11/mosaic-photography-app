export const GALLERY_ITEM_HEIGHT = 480;

// Calculate image height based on fixed cell height minus header (50), title (33), footer (30)
const IMAGE_HEADER_HEIGHT = 50;
const TITLE_HEIGHT = 33;
const FOOTER_ROW_HEIGHT = 50;
export const IMAGE_HEIGHT =
  GALLERY_ITEM_HEIGHT - IMAGE_HEADER_HEIGHT - TITLE_HEIGHT - FOOTER_ROW_HEIGHT;
