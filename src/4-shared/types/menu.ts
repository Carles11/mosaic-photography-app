import { ViewStyle } from "react-native";

export type DropdownMenuItem = {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  component?: React.ReactNode;
  disabled?: boolean;
};

export type DropdownButtonProps = {
  menuItems: DropdownMenuItem[];
  style?: ViewStyle;
  children?: React.ReactNode;
};
