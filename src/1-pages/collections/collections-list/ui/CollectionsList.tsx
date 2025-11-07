import { PrimaryButton } from "@/4-shared/components/buttons/variants/index";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
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
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Share,
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

  // ---- SWIPE ACTIONS: Share and Delete ----
  const renderRightActions = (
    collectionId: string,
    collectionName: string,
    progress: any,
    drag: any,
    item: any
  ) => (
    <View style={localStyles.rightActionContainer}>
      <TouchableOpacity
        style={localStyles.shareButton}
        onPress={() => handleShareCollection(item)}
        activeOpacity={0.7}
        accessibilityLabel="Share Collection"
      >
        <IconSymbol name="share" type="material" size={24} color="#444" />
      </TouchableOpacity>
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
              {ASO.collections.title} ({collections.length})
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
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={(progress, drag) =>
                  renderRightActions(item.id, item.name, progress, drag, item)
                }
                friction={2}
                rightThreshold={40}
                overshootRight={false}
                containerStyle={{}}
                childrenContainerStyle={{}}
              >
                <ThemedView
                  style={[
                    styles.collectionCard,
                    { borderWidth: 1, borderColor: theme.border },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
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
                </ThemedView>
              </Swipeable>
            )}
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

const CARD_HEIGHT = 96;

const localStyles = StyleSheet.create({
  rightActionContainer: {
    flexDirection: "row",
    height: CARD_HEIGHT - 14,
    alignItems: "center",
    marginVertical: 7,
    marginHorizontal: 10,
    gap: 6,
  },
  shareButton: {
    width: 56,
    height: 56,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    flexDirection: "column",
  },
  trashButton: {
    width: 56,
    height: 56,
    borderRadius: 24,
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    flexDirection: "column",
    padding: 14,
  },
});
