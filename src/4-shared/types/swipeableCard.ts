import {
  GestureResponderEvent,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";

export type SwipeableCardAction = {
  icon: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  backgroundColor?: string;
};

export interface SwipeableCardProps {
  imageUrl: string;
  onImagePress?: (event: GestureResponderEvent) => void;
  title: string;
  subtitle?: string;
  year?: string | number;
  rightActions: SwipeableCardAction[]; // up to two actions
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  // ... add extenders if needed in future
}
