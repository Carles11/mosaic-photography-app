import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchPhotographersList,
  PhotographerListItem,
} from "../api/fetchPhotographersList";
import { styles } from "./PhotographersSlider.styles";

export const PhotographersSlider: React.FC = () => {
  const [photographers, setPhotographers] = useState<PhotographerListItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<any>();
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
      <Text style={styles.title}>Featured Photographers</Text>
      <FlatList
        data={photographers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => router.push(`/photographer/${item.slug}`)}
            >
              <View style={styles.portraitWrapper}>
                {item.portrait ? (
                  <Image
                    source={{ uri: item.portrait }}
                    style={styles.portrait}
                    resizeMode="cover"
                    accessibilityLabel={`${item.name} ${item.surname} portrait`}
                  />
                ) : (
                  <View style={styles.placeholderPortrait}>
                    <Text style={styles.placeholderInitial}>
                      {item.name[0]}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.name} numberOfLines={2}>
                {item.name} {item.surname}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
