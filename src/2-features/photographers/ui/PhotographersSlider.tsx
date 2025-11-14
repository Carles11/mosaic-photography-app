import { ThemedText } from "@/4-shared/components/themed-text";
import {
  PhotographerListItem,
  PhotographersSliderProps,
} from "@/4-shared/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchPhotographersList } from "../api/fetchPhotographersList";
import { styles } from "./PhotographersSlider.styles";

export const PhotographersSlider: React.FC<PhotographersSliderProps> = ({
  onPhotographerPress,
}) => {
  const [photographers, setPhotographers] = useState<PhotographerListItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    fetchPhotographersList().then((data) => {
      if (mounted) {
        setPhotographers(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!photographers.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Featured Photographers
      </ThemedText>
      <FlatList
        data={photographers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        windowSize={7}
        renderItem={({ item }) => {
          const hasPortrait = !!item.portrait && item.portrait.length > 0;
          return (
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => {
                router.push(`/photographer/${item.slug}`);
                if (onPhotographerPress) onPhotographerPress(item);
              }}
              accessibilityLabel={`Discover vintage photography by ${item.name} ${item.surname}`}
            >
              <View style={[styles.portraitWrapper]}>
                {hasPortrait ? (
                  <Image
                    source={{ uri: item.portrait }}
                    style={styles.portrait}
                    resizeMode="cover"
                    accessibilityLabel={`${item.name} ${item.surname} portrait`}
                  />
                ) : (
                  <View style={styles.placeholderPortrait}>
                    <ThemedText style={styles.placeholderInitial}>
                      {item.name[0]}
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText
                style={styles.name}
                numberOfLines={1}
                ellipsizeMode="tail"
                allowFontScaling={false}
              >
                {item.surname}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
