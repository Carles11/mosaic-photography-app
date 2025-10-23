import { ViewStyle } from "react-native";

export type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyles?: ViewStyle;
};
