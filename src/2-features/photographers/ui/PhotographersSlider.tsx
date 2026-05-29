import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

import {
  FEATURED_PHOTOGRAPHERS_LIMIT,
  FEATURED_PHOTOGRAPHERS_THUMB_WIDTH,
} from "@/4-shared/config/photographers";
import {
  PhotographerListItem,
  PhotographersSliderProps,
} from "@/4-shared/types";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchPhotographersList } from "../api/fetchPhotographersList";
import { styles } from "./PhotographersSlider.styles";
import { PhotographersSliderItem } from "./PhotographersSliderItem";

export const PhotographersSlider: React.FC<PhotographersSliderProps> = ({
  onPhotographerPress,
}) => {
  const pageSize = FEATURED_PHOTOGRAPHERS_LIMIT;
  const thumbWidth = FEATURED_PHOTOGRAPHERS_THUMB_WIDTH;

  const [photographers, setPhotographers] = useState<PhotographerListItem[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0); // zero-based
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();

  // guard to avoid multiple onEndReached triggers while a request is in-flight
  const isFetchingRef = useRef(false);
  const { theme } = useTheme();

  // Prefetch first page
  useEffect(() => {
    let mounted = true;
    isFetchingRef.current = true;
    (async () => {
      try {
        const fetched = await fetchPhotographersList(pageSize, thumbWidth);
        if (!mounted) return;
        const initial = fetched.slice(0, pageSize);
        setPhotographers(initial);
        // if fetched returned exactly pageSize, there might be more
        setHasMore(fetched.length === pageSize);
      } catch (err) {
        console.warn("[PhotographersSlider] fetch error", err);
        if (!mounted) return;
        setPhotographers([]);
        setHasMore(false);
      } finally {
        if (mounted) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigateToPhotographer = useCallback(
    (slug: string) => {
      router.push(`/photographers/${slug}`);
    },
    [router],
  );

  const listCard = (
    <TouchableOpacity
      style={styles.seeAllCard}
      onPress={() => router.push("/photographers/photographers-list")}
    >
      <Ionicons name="arrow-forward" size={28} color={theme.text} />
      <ThemedText type="defaultSemiBold">See them all</ThemedText>
    </TouchableOpacity>
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PhotographerListItem | { id: string }>) => {
      if (item.id === "see-all") return listCard;
      const photographer = item as PhotographerListItem;
      return (
        <PhotographersSliderItem
          item={photographer}
          onPhotographerPress={onPhotographerPress}
          onNavigateToPhotographer={handleNavigateToPhotographer}
        />
      );
    },
    [onPhotographerPress, handleNavigateToPhotographer, listCard],
  );
  // Load the next page using the existing fetchPhotographersList(limit, width).
  // Because fetchPhotographersList accepts only limit (no offset), we request a cumulative
  // limit: (pageIndex+1 + 1) * pageSize, then slice out only the new page entries.
  const loadNextPage = useCallback(async () => {
    if (loadingMore || isFetchingRef.current || !hasMore) return;
    setLoadingMore(true);
    isFetchingRef.current = true;
    try {
      const nextPageIndex = pageIndex + 1;
      const requestedLimit = (nextPageIndex + 1) * pageSize; // cumulative
      const fetched = await fetchPhotographersList(requestedLimit, thumbWidth);
      const offset = nextPageIndex * pageSize;
      const pageItems = fetched.slice(offset, offset + pageSize);

      // Append only new unique items (defensive)
      setPhotographers((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = pageItems.filter((p) => !existingIds.has(p.id));
        return newItems.length ? [...prev, ...newItems] : prev;
      });

      // hasMore if we received a full page
      setHasMore(pageItems.length === pageSize);
      setPageIndex(nextPageIndex);
    } catch (err) {
      console.warn("[PhotographersSlider] loadNextPage error", err);
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, thumbWidth, loadingMore, hasMore]);

  // onEndReached is sometimes noisy on horizontal FlatList.
  // We guard with isFetchingRef and loadingMore to avoid duplicate requests.
  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    void loadNextPage();
  }, [hasMore, loadNextPage]);

  const listFooterComponent = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }, [loadingMore]);

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
      <ThemedText type="title">Featured Photographers</ThemedText>
      <ThemedText type="subtitle">
        The pioneers who pointed a lens at the world before anyone knew what
        photography could be.
      </ThemedText>
      <FlatList
        data={
          [...photographers, { id: "see-all" }] as (
            | PhotographerListItem
            | { id: string }
          )[]
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        initialNumToRender={pageSize}
        windowSize={3}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.6}
        ListFooterComponent={listFooterComponent}
      />
    </View>
  );
};
