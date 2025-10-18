import { IconSymbolProps, IconType } from '@/4-shared/types/icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Platform, StyleProp, TextStyle, TouchableOpacity } from 'react-native';

const MATERIAL_ICON_MAPPING: Record<string, string> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
};

export const IconSymbol: React.FC<IconSymbolProps> = ({
  name,
  type,
  size = 24,
  color = '#000',
  style,
  onPress,
  accessibilityLabel,
  svgAsset: SvgAsset,
}) => {
  let resolvedType: IconType = type || (Platform.OS === 'ios' ? 'sf' : 'material');
  let iconName = name;

  if (!type && Platform.OS !== 'ios' && MATERIAL_ICON_MAPPING[name ? name : '']) {
    resolvedType = 'material';
    iconName = MATERIAL_ICON_MAPPING[name ? name : ''];
  }

  let iconElement = null;

 if (resolvedType === 'svg' && SvgAsset) {
  iconElement = (
    <SvgAsset width={size} height={size} />
  );
} else if (resolvedType === 'material') {
    type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
    iconElement = (
      <MaterialIcons
        name={iconName as MaterialIconName}
        size={size}
        color={color}
        style={style as StyleProp<TextStyle>}
        accessibilityLabel={accessibilityLabel}
      />
    );
  } else if (resolvedType === 'ion') {
    type IonIconName = React.ComponentProps<typeof Ionicons>['name'];
    iconElement = (
      <Ionicons
        name={iconName as IonIconName}
        size={size}
        color={color}
        style={style as StyleProp<TextStyle>}
        accessibilityLabel={accessibilityLabel}
      />
    );
  } else if (resolvedType === 'fontawesome') {
    type FAIconName = React.ComponentProps<typeof FontAwesome>['name'];
    iconElement = (
      <FontAwesome
        name={iconName as FAIconName}
        size={size}
        color={color}
        style={style as StyleProp<TextStyle>}
        accessibilityLabel={accessibilityLabel}
      />
    );
  } else if (resolvedType === 'sf') {
    if (Platform.OS !== 'ios') {
      type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
      const mappedName = MATERIAL_ICON_MAPPING[iconName ? iconName : ''] || iconName;
      iconElement = (
        <MaterialIcons
          name={mappedName as MaterialIconName}
          size={size}
          color={color}
          style={style as StyleProp<TextStyle>}
          accessibilityLabel={accessibilityLabel}
        />
      );
    } else {
      iconElement = null;
    }
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