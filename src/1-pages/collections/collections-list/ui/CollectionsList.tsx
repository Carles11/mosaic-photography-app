import { PrimaryButton } from "@/4-shared/components/buttons/variants/index";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useCollections } from "@/4-shared/context/collections/CollectionsContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { styles } from "./CollectionsList.styles";
import CreateCollectionSheet, {
  CreateCollectionSheetRef,
} from "./CreateCollectionSheet";

export default function CollectionsList() {
  const { theme } = useTheme();
  const { user } = useAuthSession();
  const { collections, loading, deleteCollection, reloadCollections } =
    useCollections();
  const router = useRouter();
  const sheetRef = useRef<CreateCollectionSheetRef>(null);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) {
        // Auth-guarding, can move to context if desired
        import("@/4-shared/utility/toast/Toast").then(({ showErrorToast }) => {
          showErrorToast("Please log in to view your collections.");
        });
        router.replace("/auth/login");
        return;
      }
      reloadCollections(); // this may be a no-op if you'll keep context auto-syncing on user change
    }, [user?.id, router, reloadCollections])
  );

  // Auth gating: only render content if logged in
  if (!user?.id) {
    return null;
  }

  const handleOpenCreateSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.open();
    } else {
      console.warn("[CollectionsList] handleOpenCreateSheet: sheetRef is null");
    }
  };

  const handleCollectionCreated = () => {
    sheetRef.current?.close();
    // reloadCollections(); // Should already be synced in context after create
  };

  const handleDeleteCollection = (
    collectionId: string,
    collectionName: string
  ) => {
    Alert.alert(
      "Delete Collection",
      `Are you sure you want to delete "${collectionName}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteCollection(collectionId);
            // No need for reload, it's handled in context
          },
        },
      ]
    );
  };

  const renderRightActions = (
    collectionId: string,
    collectionName: string,
    progress: any,
    drag: any
  ) => (
    <View style={localStyles.rightActionContainer}>
      <TouchableOpacity
        style={localStyles.trashButton}
        onPress={() => handleDeleteCollection(collectionId, collectionName)}
        activeOpacity={0.7}
        accessibilityLabel="Delete Collection"
      >
        <IconSymbol name="delete" type="material" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {loading ? (
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
              <Swipeable
                renderRightActions={(progress, drag) =>
                  renderRightActions(item.id, item.name, progress, drag)
                }
                friction={2}
                rightThreshold={40}
                overshootRight={false}
                containerStyle={{}}
                childrenContainerStyle={{}}
              >
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
                        <ThemedText style={styles.emptyThumbIcon}>
                          🖼️
                        </ThemedText>
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
              </Swipeable>
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

const CARD_HEIGHT = 96;

const localStyles = StyleSheet.create({
  rightActionContainer: {
    height: CARD_HEIGHT - 14,
    width: 56,
    marginVertical: 7,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  trashButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
