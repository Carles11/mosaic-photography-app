import { Dimensions, StyleSheet } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

// Height constants
export const HEADER_HEIGHT = deviceHeight * 0.5;
// We want the fade to start at the bottom 1/3 of the image
export const FADE_START = HEADER_HEIGHT * (2 / 3);
export const FADE_HEIGHT = HEADER_HEIGHT - FADE_START;

export const styles = StyleSheet.create({
  root: {
    width: deviceWidth,
    height: HEADER_HEIGHT,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientContainer: {
    position: "absolute",
    left: 0,
    width: deviceWidth,
    height: FADE_HEIGHT,
    bottom: 0,
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContent: {
    position: "absolute",
    width: deviceWidth,
    alignItems: "center",
    bottom: FADE_HEIGHT * 0.4,
  },
  name: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.65)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  lifespan: {
    color: "#eee",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
