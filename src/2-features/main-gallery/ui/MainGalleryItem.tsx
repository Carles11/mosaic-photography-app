import { ImageFooterRow } from "@/3-entities/images/ui/ImageFooterRow";
import { ImageHeaderRow } from "@/3-entities/images/ui/ImageHeaderRow";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { getCanonicalSlug } from "@/4-shared/lib/authorSlug";
import { MainGalleryItemProps } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
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

  // Localize values for stable references and clearer logic
  const author = item.author ? String(item.author).trim() : "";
  const dbSlug = (item as any).photographerSlug as string | undefined;
  const canonicalSlug = author ? getCanonicalSlug(author) : undefined;
  const navSlug = dbSlug ?? canonicalSlug;

  // Dedupe missing-slug warnings per author during this session
  const warnedAuthorsRef = useRef<Set<string>>(new Set());

  const handlePressAuthor = useCallback(() => {
    if (!author) return;

    if (!navSlug) {
      // Warn only once per author to avoid log spam
      if (!warnedAuthorsRef.current.has(author)) {
        warnedAuthorsRef.current.add(author);
      }
      showErrorToast("Photographer page unavailable.");
      return;
    }

    router.push(`/photographer/${navSlug}`);
  }, [router, author, navSlug, dbSlug]);

  const authorIsLink = Boolean(author && navSlug);

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

      {author ? (
        authorIsLink ? (
          <TouchableOpacity
            onPress={handlePressAuthor}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel={`Open photographer ${author}`}
            style={{ marginTop: 6 }}
          >
            <ThemedText
              style={(s as any).author}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {author}
              {item.year ? `, ${item.year}` : ""}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          // Render plain text when no nav slug is available
          <ThemedView style={{ marginTop: 6 }}>
            <ThemedText
              style={(s as any).author}
              numberOfLines={1}
              ellipsizeMode="tail"
              accessibilityLabel={`${author} (photographer page unavailable)`}
            >
              {author}
              {item.year ? `, ${item.year}` : ""}
            </ThemedText>
          </ThemedView>
        )
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
