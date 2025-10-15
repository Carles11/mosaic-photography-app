import { HomeHeader } from '@/2-features/home-header'; // Import via public API
import { MainGallery } from '@/2-features/main-gallery'; // Import via public API
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Home.styles';

export const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <HomeHeader />
      <MainGallery />
    </SafeAreaView>
  );
};