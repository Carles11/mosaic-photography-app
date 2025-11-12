import { StyleSheet } from "react-native";

export function createPhotographerPortraitHeaderStyles(
  headerWidth: number,
  headerHeight: number,
  headerImageWidth: number, // not used for full-bleed; can be reused for something else
  fadeHeight: number
) {
  return StyleSheet.create({
    root: {
      width: headerWidth,
      height: headerHeight,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: headerWidth, // FULL width
      height: headerHeight,
    },
    gradientContainer: {
      position: "absolute",
      left: 0,
      width: headerWidth,
      height: fadeHeight,
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
      width: headerWidth,
      alignItems: "center",
      bottom: fadeHeight * 0.4,
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
}
