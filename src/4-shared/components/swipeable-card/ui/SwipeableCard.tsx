import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { SwipeableCardProps } from "@/4-shared/types/swipeableCard";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { styles } from "./SwipeableCard.styles";

/**
 * A performant, reusable swipeable card for lists (collections, favorites, and more).
 * @example
 * <SwipeableCard
 *   imageUrl={item.thumbnailUrl}
 *   onPress={() => handleZoom(index)}
 *   title={item.author}
 *   subtitle={item.description}
 *   year={item.year}
 *   rightActions={[
 *     { icon: <ShareIcon />, onPress: () => handleShare(item), backgroundColor: '#eee' },
 *     { icon: <DeleteIcon />, onPress: () => handleDelete(item.id), backgroundColor: 'red' }
 *   ]}
 * />
 */
const SwipeableCard: React.FC<
  Omit<SwipeableCardProps, "onImagePress"> & { onPress?: () => void }
> = memo(
  ({
    imageUrl,
    onPress,
    title,
    subtitle,
    year,
    rightActions,
    containerStyle = {},
    imageStyle = {},
    textStyle = {},
  }) => {
    const { theme } = useTheme();

    // Render right swipe actions (up to two)
    const renderRightActions = (progress: any, drag: any) => (
      <View style={styles.rightActionContainer}>
        {rightActions.slice(0, 2).map((action, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={action.onPress}
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  action.backgroundColor || (idx === 1 ? "#e53935" : "#f5f5f5"),
              },
            ]}
            activeOpacity={0.7}
            accessibilityLabel={action.accessibilityLabel}
          >
            {action.icon}
          </TouchableOpacity>
        ))}
      </View>
    );

    const hasImage = !!imageUrl && imageUrl.length > 0;

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress ? 0.85 : 1}
          disabled={!onPress}
          style={[styles.card, containerStyle]}
        >
          {/* Left: Image */}
          <View style={styles.imageContainer}>
            {hasImage ? (
              <Image
                source={{ uri: imageUrl }}
                style={[styles.image, imageStyle]}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.image,
                  {
                    backgroundColor: "#333",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <ThemedText style={{ color: "#fff", fontSize: 12 }}>
                  No image
                </ThemedText>
              </View>
            )}
          </View>
          {/* Center: Texts */}
          <View style={styles.infoContainer}>
            <ThemedText
              style={[styles.title, textStyle]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </ThemedText>
            {subtitle ? (
              <ThemedText
                style={[styles.subtitle, textStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {subtitle}
              </ThemedText>
            ) : null}
            {year ? (
              <ThemedText
                style={[styles.year, textStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {year}
              </ThemedText>
            ) : null}
          </View>
          {/* Swipe Hint: Chevron + Gradient (always visible, right side) */}
          <View style={styles.swipeHintContainer} pointerEvents="none">
            <LinearGradient
              colors={["transparent", theme.background]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.swipeGradient}
            />
            <IconSymbol
              name="chevron-left"
              type="material"
              size={18}
              color="#a6a9b2"
              style={styles.swipeChevron}
            />
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }
);

export default SwipeableCard;
