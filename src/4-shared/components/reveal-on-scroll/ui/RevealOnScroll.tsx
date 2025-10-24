import React, { ReactNode, useRef } from "react";
import Animated, {
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
};

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  scrollY,
  direction = "up",
  height = 64,
}) => {
  const prevScrollY = useRef(0);

  // Derived value: 1 = visible, 0 = hidden
  const revealed = useDerivedValue(() => {
    const scrollingDown = scrollY.value > prevScrollY.current;
    prevScrollY.current = scrollY.value;

    if (direction === "up") {
      return scrollingDown ? withTiming(0) : withTiming(1);
    } else {
      return scrollingDown ? withTiming(1) : withTiming(0);
    }
  }, [direction, scrollY]);

  const animatedStyle = useAnimatedStyle(() => {
    const containerHeight = interpolate(revealed.value, [0, 1], [0, height]);
    const translateY = interpolate(revealed.value, [0, 1], [-height, 0]);
    return {
      height: containerHeight,
      overflow: "hidden",
      transform: [{ translateY }],
      opacity: revealed.value,
    };
  }, [height]);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
