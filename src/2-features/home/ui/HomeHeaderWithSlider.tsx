// src/2-features/home/HomeHeaderWithSlider.tsx
import { HomeHeader } from "@/2-features/home";
import { PhotographersSlider } from "@/2-features/photographers/ui/PhotographersSlider";
import { HomeHeaderWithSliderProps } from "@/4-shared/types";
import React from "react";
import { View } from "react-native";

export const HomeHeaderWithSlider = ({
  onOpenFilters,
  onPhotographerPress,
}: HomeHeaderWithSliderProps) => (
  <View>
    <HomeHeader onOpenFilters={onOpenFilters} />
    <PhotographersSlider onPhotographerPress={onPhotographerPress} />
  </View>
);
