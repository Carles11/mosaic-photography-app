import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './HomeHeader.styles';

// Replace with your actual logo asset path in 4-shared/assets
const logoSrc = require('@/4-shared/assets/images/icon.png');
// Replace with your actual icon asset paths
const heartIcon = require('@/4-shared/assets/images/icon.png');
const messagesIcon = require('@/4-shared/assets/images/icon.png');

export const HomeHeader: React.FC = () => (
  <View style={styles.header}>
    <Image source={logoSrc} style={styles.logo} />
    <View style={styles.iconsRow}>
      <TouchableOpacity>
        <Image source={heartIcon} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={messagesIcon} style={styles.icon} />
      </TouchableOpacity>
    </View>
  </View>
);