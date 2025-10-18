import { SymbolView, SymbolViewProps } from 'expo-symbols';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { IconSymbolProps } from '@/4-shared/types/icons';


export const IconSymbol: React.FC<IconSymbolProps> = ({
  name,
  type = 'sf',
  size = 24,
  color = '#000',
  style,
  onPress,
  accessibilityLabel,
  svgAsset: SvgAsset,
  weight = 'regular',
}) => {
  let iconElement = null;

  if (type === 'sf') {
    iconElement = (
      <SymbolView
        name={name as SymbolViewProps['name']}
        weight={weight}
        tintColor={color}
        resizeMode="scaleAspectFit"
        style={[{ width: size, height: size }, style]}
        accessibilityLabel={accessibilityLabel}
      />
    );
  } else if (type === 'svg' && SvgAsset) {
    iconElement = <SvgAsset width={size} height={size} fill={color} style={style} accessibilityLabel={accessibilityLabel} />;
  } else {
    // fallback: use MaterialIcons or other packs, defer to default export
    // This fallback will be handled by icon-symbol.tsx
    iconElement = null;
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel}>
        {iconElement}
      </TouchableOpacity>
    );
  }

  return iconElement;
};