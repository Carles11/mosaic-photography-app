import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { getCanonicalSlug } from "@/4-shared/lib/authorSlug";
import { MainGalleryItemProps } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Image, TouchableOpacity } from "react-native";
import { createMainGalleryItemStyles } from "./MainGalleryItem.styles";

export const MainGalleryItem: React.FC<MainGalleryItemProps> = ({
  item,
  itemHeight,
  imageHeight,
  styles,
  onOpenMenu,
  onPressComments,
  onPressZoom,
}) => {
  const s = styles || createMainGalleryItemStyles(itemHeight, imageHeight);

  const hasImage = !!item.url && item.url.length > 0;

  const router = useRouter();

  const handlePressAuthor = useCallback(() => {
    if (!item.author) return;
    // Prefer DB-provided slug; fallback to canonical map via getCanonicalSlug (no slugify).
    let slug = (item as any).photographerSlug;
    let source = "photographerSlug";
    if (!slug) {
      const canonical = getCanonicalSlug(item.author);
      if (canonical) {
        slug = canonical;
        source = "canonicalSlugMap";
      }
    }
    if (!slug) {
      // Do not construct slug client-side. Notify and avoid navigating to a potentially wrong route.
      console.warn(
        `[handlePressAuthor] Missing photographerSlug for author: ${item.author}`,
      );
      showErrorToast("Photographer page unavailable.");
      return;
    }
    console.debug(
      `[handlePressAuthor] using slug: ${slug} source: ${source} author: ${item.author}`,
    );
    router.push(`/photographer/${slug}`);
  }, [router, item.author, (item as any).photographerSlug]);

  return (
    <ThemedView style={s.itemContainer}>
      <ImageHeaderRow onOpenMenu={onOpenMenu} />
      <TouchableOpacity activeOpacity={0.92} onPress={onPressZoom}>
        {hasImage ? (
          <Image
            source={{ uri: item.url }}
            style={s.image}
            resizeMode="cover"
          />
        ) : (
          <ThemedView
            style={[
              s.image,
              {
                backgroundColor: "#333",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <ThemedText style={{ fontSize: 12 }}>No image</ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>

      {item.author ? (
        <TouchableOpacity
          onPress={handlePressAuthor}
          activeOpacity={0.7}
          accessibilityRole="link"
          style={{ marginTop: 6 }}
        >
          <ThemedText
            style={(s as any).author}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.author}
            {item.year ? `, ${item.year}` : ""}
          </ThemedText>
        </TouchableOpacity>
      ) : null}

      <ThemedText style={s.title} numberOfLines={1}>
        {item.description}
      </ThemedText>

      <ThemedView style={s.footerRowContainer}>
        <ImageFooterRow
          imageId={String(item.id)}
          onPressComments={onPressComments}
        />
      </ThemedView>
    </ThemedView>
  );
};
