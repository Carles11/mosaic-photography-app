import { HomeHeader } from '@/2-features/home-header'; // import via public API
import { MainGallery } from '@/2-features/main-gallery'; // import via public API
import React from 'react';
import { View } from 'react-native';
import { styles } from './Home.styles';

export const Home: React.FC = () => {
  return (
    <View style={styles.page}>
      <HomeHeader />
      <MainGallery />
      {/* BottomTab navigation is handled in your 0-app layer */}
    </View>
  );
};