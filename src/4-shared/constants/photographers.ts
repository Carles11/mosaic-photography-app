import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const PHOTOGRAPHER_HEADER_DEVICE_WIDTH = deviceWidth;
export const PHOTOGRAPHER_HEADER_DEVICE_HEIGHT = deviceHeight;

// Main header height
export const PHOTOGRAPHER_HEADER_HEIGHT = deviceHeight * 0.5;
// Fade starts at the bottom third of the image
export const PHOTOGRAPHER_HEADER_FADE_START =
  PHOTOGRAPHER_HEADER_HEIGHT * (2 / 3);
export const PHOTOGRAPHER_HEADER_FADE_HEIGHT =
  PHOTOGRAPHER_HEADER_HEIGHT - PHOTOGRAPHER_HEADER_FADE_START;
