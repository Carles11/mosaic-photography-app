import React, { ReactNode, useRef } from "react";
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

type RevealOnScrollProps = {
  children: ReactNode;
  scrollY: SharedValue<number>;
  direction?: "up" | "down";
  height?: number;
  threshold?: number;
};

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  scrollY,
  direction = "up",
  height = 64,
  threshold = 24,
}) => {
  const hysteresisRef = useRef<{ lastAction: number; lastToggleY: number }>({
    lastAction: 1,
    lastToggleY: scrollY.value,
  });

  const revealed = useDerivedValue(() => {
    const { lastAction, lastToggleY } = hysteresisRef.current;
    const delta = scrollY.value - lastToggleY;

    let newAction = lastAction;
    let newToggleY = lastToggleY;

    if (direction === "up") {
      if (lastAction === 1 && delta > threshold) {
        newAction = 0;
        newToggleY = scrollY.value;
      } else if (lastAction === 0 && delta < -threshold) {
        newAction = 1;
        newToggleY = scrollY.value;
      }
    } else {
      if (lastAction === 0 && delta > threshold) {
        newAction = 1;
        newToggleY = scrollY.value;
      } else if (lastAction === 1 && delta < -threshold) {
        newAction = 0;
        newToggleY = scrollY.value;
      }
    }

    if (newAction !== lastAction || newToggleY !== lastToggleY) {
      hysteresisRef.current.lastAction = newAction;
      hysteresisRef.current.lastToggleY = newToggleY;
    }

    return withTiming(newAction, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
  }, [direction, scrollY, threshold]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      height: interpolate(revealed.value, [0, 1], [0, height]),
      opacity: revealed.value,
      overflow: "hidden",
    }),
    [height]
  );

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
