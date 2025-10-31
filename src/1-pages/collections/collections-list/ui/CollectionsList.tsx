import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { fetchCollectionsForUser } from "../../../../4-shared/api/collectionsApi.ts";
import { PrimaryButton } from "../../../../4-shared/components/buttons/variants/index.ts";
import { ThemedText } from "../../../../4-shared/components/themed-text.tsx";
import { ThemedView } from "../../../../4-shared/components/themed-view.tsx";
import { useAuthSession } from "../../../../4-shared/context/auth/AuthSessionContext.tsx";
import { useTheme } from "../../../../4-shared/theme/ThemeProvider.tsx";
import { CollectionWithPreview } from "../../../../4-shared/types/collections.ts";
import { styles } from "./CollectionsList.styles.ts";
import CreateCollectionSheet, {
  CreateCollectionSheetRef,
} from "./CreateCollectionSheet.tsx";

export default function CollectionsList() {
  const { theme } = useTheme();
  const { user } = useAuthSession();
  const router = useRouter();
  const sheetRef = useRef<CreateCollectionSheetRef>(null);

  const [collections, setCollections] = useState<CollectionWithPreview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCollections = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await fetchCollectionsForUser(user.id);
      setCollections(result);
    } catch (e) {
      setCollections([]);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const handleOpenCreateSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.open();
    } else {
      console.warn("[CollectionsList] handleOpenCreateSheet: sheetRef is null");
    }
  };

  const handleCollectionCreated = () => {
    sheetRef.current?.close();
    loadCollections();
  };

  return (
    <ThemedView style={styles.container}>
      {!user?.id ? (
        <ThemedView style={styles.centered}>
          <ThemedText style={styles.emptyText}>
            Please log in to view your collections.
          </ThemedText>
        </ThemedView>
      ) : loading ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" color={theme.favoriteIcon} />
          <ThemedText style={styles.loadingText}>
            Loading collections...
          </ThemedText>
        </ThemedView>
      ) : collections.length === 0 ? (
        <ThemedView style={styles.centered}>
          <ThemedText style={styles.emptyIcon}>📚</ThemedText>
          <ThemedText style={styles.emptyTitle}>No collections yet</ThemedText>
          <ThemedText style={styles.emptyText}>
            Create your first collection to organize your favorite images.
          </ThemedText>
          <PrimaryButton
            title="New Collection"
            onPress={handleOpenCreateSheet}
            style={styles.createButton}
          />
        </ThemedView>
      ) : (
        <>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Your Collections ({collections.length})
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Organize your favorite images into themed collections.
            </ThemedText>
            <PrimaryButton
              title="+ New Collection"
              onPress={handleOpenCreateSheet}
              style={styles.createButton}
            />
          </ThemedView>
          <FlatList
            data={collections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.collectionCard,
                  { borderWidth: 1, borderColor: theme.border },
                ]}
                activeOpacity={0.8}
                onPress={() => router.push(`/collections/${item.id}`)}
              >
                <ThemedView style={styles.cardPreviewRow}>
                  {item.previewImages.map((img) => (
                    <Image
                      key={String(img.id)}
                      source={img.url ? { uri: img.url } : undefined}
                      style={styles.previewThumb}
                      resizeMode="cover"
                    />
                  ))}
                  {item.previewImages.length === 0 && (
                    <ThemedView style={styles.emptyThumb}>
                      <ThemedText style={styles.emptyThumbIcon}>🖼️</ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
                <ThemedView style={styles.cardInfo}>
                  <ThemedText
                    style={styles.collectionName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </ThemedText>
                  {item.description ? (
                    <ThemedText
                      style={styles.collectionDescription}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </ThemedText>
                  ) : null}
                  <ThemedText style={styles.imageCount}>
                    {item.imageCount} image
                    {item.imageCount === 1 ? "" : "s"}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </>
      )}
      {/* Bottom sheet must always be mounted outside any conditional render */}
      <CreateCollectionSheet
        ref={sheetRef}
        onCreated={handleCollectionCreated}
      />
    </ThemedView>
  );
}
