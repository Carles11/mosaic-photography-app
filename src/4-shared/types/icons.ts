
import { SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';


export type IconType = 'material' | 'ion' | 'fontawesome' | 'svg' | 'sf';

export interface IconSymbolProps {
  name?: string;
  type?: IconType; // If not provided, defaults to 'sf'
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  svgAsset?: React.FC<SvgProps>; // Only for type="svg"
  weight?: SymbolWeight;
}