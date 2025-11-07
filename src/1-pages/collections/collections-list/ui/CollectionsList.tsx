import { PrimaryButton } from "@/4-shared/components/buttons/variants/index";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import SwipeableCard from "@/4-shared/components/swipeable-card/ui/SwipeableCard";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { ASO } from "@/4-shared/config/aso";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useCollections } from "@/4-shared/context/collections/CollectionsContext";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ActivityIndicator, Alert, FlatList, Share } from "react-native";
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
  const navigation = useNavigation();
  const sheetRef = useRef<CreateCollectionSheetRef>(null);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) {
        import("@/4-shared/utility/toast/Toast").then(({ showErrorToast }) => {
          showErrorToast("Please log in to view your collections.");
        });
        router.replace("/auth/login");
        return;
      }
      reloadCollections();
    }, [user?.id, router, reloadCollections])
  );

  React.useEffect(() => {
    navigation.setOptions({
      title: ASO.collections.title,
      subtitle: ASO.collections.description,
    });
  }, [navigation]);

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
          },
        },
      ]
    );
  };

  const handleShareCollection = (collection: any) => {
    const url = `https://www.mosaic.photography/profile/collections/${collection.id}`;
    const message = ASO.collectionDetail?.shareTemplate
      ? ASO.collectionDetail.shareTemplate({
          name: collection.name,
          description: collection.description || "",
          url,
        })
      : `Check out my collection "${collection.name}" on Mosaic Gallery! ${
          collection.description ?? ""
        } View it here: ${url}`;
    Share.share({ message });
    logEvent("collection_shared", {
      collectionId: collection.id,
      collectionName: collection.name,
      imageCount: collection.imageCount,
      userId: user?.id,
      screen: "CollectionsList",
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <SwipeableCard
      imageUrl={item.previewImages?.[0]?.url ?? ""}
      onImagePress={() => router.push(`/collections/${item.id}`)}
      title={item.name}
      subtitle={`${item.imageCount} image${item.imageCount === 1 ? "" : "s"}`}
      rightActions={[
        {
          icon: (
            <IconSymbol name="share" type="material" size={24} color="#444" />
          ),
          onPress: () => handleShareCollection(item),
          accessibilityLabel: "Share Collection",
          backgroundColor: "#f5f5f5",
        },
        {
          icon: (
            <IconSymbol name="delete" type="material" size={26} color="#fff" />
          ),
          onPress: () => handleDeleteCollection(item.id, item.name),
          accessibilityLabel: "Delete Collection",
          backgroundColor: "#e53935",
        },
      ]}
      containerStyle={{ marginBottom: 12 }}
    />
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
          <ThemedText style={styles.emptyTitle}>
            {ASO.collections.emptyTitle}
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            {ASO.collections.emptyText}
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
              You created {collections.length}{" "}
              {collections.length === 1 ? "collection" : "collections"}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {ASO.collections.description}
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
            renderItem={renderItem}
          />
        </>
      )}
      <CreateCollectionSheet
        ref={sheetRef}
        onCreated={handleCollectionCreated}
      />
    </ThemedView>
  );
}
