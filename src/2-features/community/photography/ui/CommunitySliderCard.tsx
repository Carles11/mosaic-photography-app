import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import type { ContributorWithFeatured } from "@/2-features/community/photography/api/fetchContributorsList";
import { getBestUrlForWidth } from "@/4-shared/lib/getAllS3Urls";
import { styles } from "./CommunitySliderCard.styles";

interface Props {
  contributor: ContributorWithFeatured;
  cardWidth: number;
}

const CommunitySliderCard: React.FC<Props> = ({ contributor, cardWidth }) => {
  const router = useRouter();

  const imageUrl = contributor.featuredImage?.s3Progressive
    ? getBestUrlForWidth(contributor.featuredImage.s3Progressive, cardWidth)
    : contributor.featuredImage?.url ?? null;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => router.push(`/community/photography/${contributor.slug}`)}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrap}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {contributor.name}
      </Text>
      <Text style={styles.country} numberOfLines={1}>
        {contributor.country || "Global"}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(CommunitySliderCard);
