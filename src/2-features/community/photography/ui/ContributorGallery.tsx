import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import type { ContributorImage } from "@/4-shared/types";
import { getBestUrlForWidth } from "@/4-shared/lib/getAllS3Urls";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { styles } from "./ContributorGallery.styles";

interface Props {
  images: ContributorImage[];
  onPressImage?: (index: number) => void;
}

export default function ContributorGallery({ images, onPressImage }: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const THUMB = Math.floor((width - 40) / 3);

  return (
    <View style={styles.grid}>
      {images.map((img, i) => {
        const url = img.s3Progressive
          ? getBestUrlForWidth(img.s3Progressive, THUMB)
          : img.url ?? "";
        return (
          <TouchableOpacity
            key={img.id}
            onPress={() => onPressImage?.(i)}
            style={[styles.thumb, { width: THUMB, height: THUMB, backgroundColor: theme.border }]}
          >
            <Image
              source={{ uri: url }}
              style={styles.thumbImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
