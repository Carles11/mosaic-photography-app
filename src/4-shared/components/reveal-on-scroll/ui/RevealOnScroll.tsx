import React, { ReactNode } from "react";
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
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
  // Track last scrollY and accumulated delta between direction changes
  const lastScrollY = useSharedValue(0);
  const accumulatedDelta = useSharedValue(0);
  const lastAction = useSharedValue(1); // 1 = revealed, 0 = hidden

  const revealed = useDerivedValue(() => {
    const currentY = scrollY.value;
    const delta = currentY - lastScrollY.value;

    // Determine if direction changed
    const scrollingUp = delta < 0;
    const scrollingDown = delta > 0;

    // Reset accumulatedDelta on direction change
    if (
      (accumulatedDelta.value > 0 && scrollingUp) ||
      (accumulatedDelta.value < 0 && scrollingDown)
    ) {
      accumulatedDelta.value = 0;
    }

    // Accumulate delta in the current direction
    accumulatedDelta.value += delta;
    lastScrollY.value = currentY;

    if (direction === "up") {
      // Reveal on scroll up, hide on scroll down
      if (lastAction.value === 1 && accumulatedDelta.value > threshold) {
        lastAction.value = 0;
      } else if (
        lastAction.value === 0 &&
        accumulatedDelta.value < -threshold
      ) {
        lastAction.value = 1;
      }
    } else {
      // Reveal on scroll down, hide on scroll up (inverse)
      if (lastAction.value === 0 && accumulatedDelta.value > threshold) {
        lastAction.value = 1;
      } else if (
        lastAction.value === 1 &&
        accumulatedDelta.value < -threshold
      ) {
        lastAction.value = 0;
      }
    }

    return withTiming(lastAction.value, {
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
