import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React from "react";

import Animated, {
  useAnimatedProps,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { styles } from "./ZoomScaleBadge.styles";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ZoomScaleBadgeProps = {
  scale: number;
  minScale?: number;
  maxScale?: number;
  visible?: boolean;
  style?: any;
};

export const ZoomScaleBadge: React.FC<ZoomScaleBadgeProps> = ({
  scale,
  minScale = 1,
  maxScale = 5,
  visible = true,
  style,
}) => {
  const { theme } = useTheme();

  // Badge circle geometry
  const size = 48;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress (0 = minScale, 1 = maxScale)
  const progress = Math.max(
    0,
    Math.min(1, (scale - minScale) / (maxScale - minScale))
  );

  // Animated stroke offset
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withSpring(circumference * (1 - progress), {
      damping: 18,
      stiffness: 180,
    }),
  }));

  // Animate appearance
  const animatedContainerStyle = useAnimatedProps(() => ({
    opacity: withSpring(visible ? 1 : 0, { damping: 15, stiffness: 180 }),
    transform: [
      {
        scale: withSpring(visible ? 1 : 0.7, { damping: 18, stiffness: 160 }),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.badgeContainer,
        animatedContainerStyle as any,
        style,
        {
          backgroundColor:
            scale !== 1 ? "rgba(30,30,30,0.92)" : "rgba(30,30,30,0.70)",
        },
      ]}
      pointerEvents="none"
    >
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.11)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      <ThemedText style={[styles.badgeText, { fontSize: 11, padding: 6 }]}>
        {scale.toFixed(2)}x
      </ThemedText>
    </Animated.View>
  );
};
