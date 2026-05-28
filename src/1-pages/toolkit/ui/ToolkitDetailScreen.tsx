import { fetchToolkitDataBySlug } from "@/2-features/toolkit/api/fetchAffiliateResources";
import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import {
  AffiliateAdvertiserWithProducts,
  AffiliateProduct,
  LocalizedText,
} from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ToolkitDetailScreen.styles";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLocalizedText(
  value: LocalizedText | null | undefined,
  locale: string,
): string {
  if (!value) return "";
  return (value[locale] ?? value.en ?? "") || "";
}

function openLink(url: string | null | undefined) {
  if (!url) {
    showErrorToast("This link is unavailable right now.");
    return;
  }
  WebBrowser.openBrowserAsync(url).catch(() =>
    showErrorToast("Could not open this link."),
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const ProductCard: React.FC<{
  product: AffiliateProduct;
  advertiserSlug: string;
  advertiserName: string;
  locale: string;
  userState: "logged_in" | "anonymous";
  theme: ReturnType<typeof useTheme>["theme"];
}> = ({
  product,
  advertiserSlug,
  advertiserName,
  locale,
  userState,
  theme,
}) => {
  const title = getLocalizedText(product.title, locale);
  const description = getLocalizedText(product.description, locale);

  const handleShopNow = useCallback(() => {
    try {
      logEvent("affiliate_click", {
        button: "shop_now",
        advertiser_slug: advertiserSlug,
        advertiser_name: advertiserName,
        product_id: product.id,
        product_type: product.type,
        screen: "toolkit_detail",
        user_state: userState,
      });
    } catch {
      // swallow analytics errors
    }

    openLink(product.affiliate_url);
  }, [product, advertiserSlug, advertiserName, userState]);

  return (
    <ThemedView style={[styles.productCard, { borderColor: theme.border }]}>
      {product.image_url ? (
        <ExpoImage
          source={product.image_url}
          style={styles.productImage}
          contentFit="cover"
          transition={140}
        />
      ) : null}

      <ThemedView style={styles.productBody}>
        <View style={styles.productMetaRow}>
          <ThemedView style={styles.typePill}>
            <ThemedText style={[styles.typeText, { color: theme.text }]}>
              {product.type}
            </ThemedText>
          </ThemedView>
          {product.featured ? (
            <ThemedText style={[styles.featuredText, { color: theme.accent }]}>
              Featured
            </ThemedText>
          ) : null}
        </View>

        <ThemedText type="defaultSemiBold" style={styles.productTitle}>
          {product.photographer_author
            ? `${product.photographer_author}'s ${title}`
            : title}
        </ThemedText>

        {product.photographer_author ? (
          <ThemedText style={styles.productAuthor}>
            {product.photographer_author}
          </ThemedText>
        ) : null}

        {description ? (
          <ThemedText style={styles.productDescription}>
            {description}
          </ThemedText>
        ) : null}

        <PrimaryButton
          title="Shop Now"
          onPress={handleShopNow}
          style={styles.productButton}
        />
      </ThemedView>
    </ThemedView>
  );
};

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

const ToolkitDetailScreen: React.FC = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useAuthSession();

  const [advertiser, setAdvertiser] =
    useState<AffiliateAdvertiserWithProducts | null>(null);
  const [loading, setLoading] = useState(true);

  const locale = "en";
  const userState = user?.id ? "logged_in" : "anonymous";

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Mosaic's Curated Selection" });
  }, [navigation]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);

    fetchToolkitDataBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setAdvertiser(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          showErrorToast("Could not load this selection.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.page, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!advertiser) {
    return (
      <SafeAreaView
        style={[styles.page, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <ThemedView style={styles.centered}>
          <ThemedText>Selection not found.</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const editorialNote = getLocalizedText(advertiser.editorial_note, locale);
  const visibleProducts = (advertiser.products ?? []).filter(
    (p) => p.affiliate_url,
  );

  return (
    <SafeAreaView
      style={[styles.page, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          {advertiser.header_url ? (
            <ExpoImage
              source={advertiser.header_url}
              style={styles.heroImage}
              contentFit="cover"
              transition={200}
            />
          ) : null}
          <View style={styles.heroOverlay} />

          <ThemedView style={styles.heroContent}>
            {advertiser.logo_url ? (
              <View style={styles.logoWrap}>
                <ExpoImage
                  source={advertiser.logo_url}
                  style={styles.logo}
                  contentFit="contain"
                />
              </View>
            ) : null}

            <ThemedText type="title" style={styles.title}>
              {advertiser.name}
            </ThemedText>

            <View style={styles.platformBadge}>
              <ThemedText style={styles.platformBadgeText}>
                {advertiser.platform}
              </ThemedText>
            </View>

            {advertiser.description ? (
              <ThemedText style={styles.heroDescription}>
                {advertiser.description}
              </ThemedText>
            ) : null}

            {advertiser.website_url ? (
              <PrimaryButton
                title="Visit Website"
                onPress={() => openLink(advertiser.website_url)}
                style={styles.heroButton}
              />
            ) : null}
          </ThemedView>
        </View>

        {/* Editorial note */}
        {editorialNote ? (
          <ThemedView style={styles.section}>
            <ThemedText style={[styles.eyebrow, { color: theme.text }]}>
              Why Mosaic recommends this
            </ThemedText>
            <ThemedView
              style={[styles.editorialBox, { borderLeftColor: theme.accent }]}
            >
              <ThemedText style={styles.bodyText}>{editorialNote}</ThemedText>
            </ThemedView>
          </ThemedView>
        ) : null}

        {/* Promo banner */}
        {advertiser.banner_image_url ? (
          <ThemedView style={styles.section}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => openLink(advertiser.banner_link_url)}
              disabled={!advertiser.banner_link_url}
            >
              <ExpoImage
                source={advertiser.banner_image_url}
                style={styles.banner}
                contentFit="cover"
                transition={150}
              />
            </TouchableOpacity>
          </ThemedView>
        ) : null}

        {/* Products */}
        {visibleProducts.length > 0 ? (
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Curated selection
            </ThemedText>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                advertiserSlug={advertiser.slug}
                advertiserName={advertiser.name}
                locale={locale}
                userState={userState}
                theme={theme}
              />
            ))}
          </ThemedView>
        ) : null}

        {/* Affiliate disclosure */}
        <ThemedView
          style={[styles.disclosure, { borderTopColor: theme.border }]}
        >
          <ThemedText style={styles.disclosureText}>
            Mosaic may earn a commission from purchases made through these links
            at no extra cost to you. We only recommend things we genuinely
            believe in.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToolkitDetailScreen;
