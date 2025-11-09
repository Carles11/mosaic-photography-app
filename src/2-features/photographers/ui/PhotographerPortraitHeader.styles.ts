import {
  PHOTOGRAPHER_HEADER_DEVICE_WIDTH,
  PHOTOGRAPHER_HEADER_FADE_HEIGHT,
  PHOTOGRAPHER_HEADER_HEIGHT,
} from "@/4-shared/constants/photographers";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    width: PHOTOGRAPHER_HEADER_DEVICE_WIDTH,
    height: PHOTOGRAPHER_HEADER_HEIGHT,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientContainer: {
    position: "absolute",
    left: 0,
    width: PHOTOGRAPHER_HEADER_DEVICE_WIDTH,
    height: PHOTOGRAPHER_HEADER_FADE_HEIGHT,
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
    width: PHOTOGRAPHER_HEADER_DEVICE_WIDTH,
    alignItems: "center",
    bottom: PHOTOGRAPHER_HEADER_FADE_HEIGHT * 0.4,
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
