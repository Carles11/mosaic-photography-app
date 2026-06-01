import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { logEvent } from "@/4-shared/firebase";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { AffiliateProductWithAdvertiser } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { memo, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { styles } from "./CuratedFindsCard.styles";

type Props = {
  product: AffiliateProductWithAdvertiser;
  locale?: string;
};

const FALLBACK_IMAGE =
  "https://cdn.mosaic.photography/logos/mosaic-high-resolution-logo-transparent-DESKTOP-dark_766x541px_lg82w1.webp";

function getLocalizedText(
  value: Record<string, string | null | undefined> | null | undefined,
  locale: string,
) {
  return value?.[locale] || value?.en || "";
}

export const CuratedFindsCard = memo(function CuratedFindsCard({
  product,
  locale = "en",
}: Props) {
  const { theme } = useTheme();
  const { user } = useAuthSession();
  const router = useRouter();
  const title = getLocalizedText(product.title, locale);
  const description = getLocalizedText(product.description, locale);
  const advertiserName =
    product.affiliate_advertisers?.name ?? product.advertiser_name ?? "";
  const imageUrl = product.image_url || FALLBACK_IMAGE;

  const handleShopNow = useCallback(async () => {
    if (!product.affiliate_url) {
      showErrorToast("This resource is unavailable right now.");
      return;
    }

    try {
      logEvent("APP_affiliate_click", {
        button: "shop_now",
        advertiser_slug: product.affiliate_advertisers?.slug ?? "",
        advertiser_name: advertiserName,
        product_id: product.id,
        product_type: product.type,
        screen: "home_curated_finds",
        user_state: user?.id ? "logged_in" : "anonymous",
      });
    } catch {
      // swallow analytics errors
    }

    try {
      await WebBrowser.openBrowserAsync(product.affiliate_url);
    } catch {
      showErrorToast("Could not open this resource.");
    }
  }, [product, advertiserName, user?.id]);

  const handleOpenRecommendation = useCallback(() => {
    const slug = product.affiliate_advertisers?.slug;
    if (!slug) {
      showErrorToast("Recommendation details are unavailable.");
      return;
    }

    try {
      logEvent("APP_affiliate_click", {
        button: "why_this",
        advertiser_slug: slug,
        advertiser_name: advertiserName,
        product_id: product.id,
        product_type: product.type,
        screen: "home_curated_finds",
        user_state: user?.id ? "logged_in" : "anonymous",
      });
    } catch {
      // swallow analytics errors
    }

    router.push(`/toolkit/${slug}` as any);
  }, [product, advertiserName, user?.id, router]);

  return (
    <ThemedView
      style={[
        styles.card,
        {
          borderColor: theme.border,
          backgroundColor: theme.background,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleShopNow}
        accessibilityRole="link"
        accessibilityLabel={`Open ${title || "resource"}`}
      >
        <ThemedView style={styles.imageWrap}>
          {imageUrl ? (
            <ExpoImage
              source={imageUrl}
              style={styles.image}
              contentFit="cover"
              transition={140}
            />
          ) : (
            <ThemedView style={styles.placeholder}>
              <ThemedText numberOfLines={2}>Mosaic Selection</ThemedText>
            </ThemedView>
          )}
          <ThemedView style={styles.typeLabel}>
            <ThemedText type="defaultSemiBold" style={styles.typeLabelText}>
              {product.type}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>

      <ThemedView style={styles.body}>
        <ThemedText
          type="defaultSemiBold"
          style={styles.title}
          numberOfLines={2}
        >
          {product.photographer_author
            ? `${product.photographer_author}'s ${title}`
            : title}
        </ThemedText>
        {advertiserName ? (
          <ThemedText style={styles.store} numberOfLines={1}>
            {advertiserName}
          </ThemedText>
        ) : null}
        {description ? (
          <ThemedText style={styles.description} numberOfLines={3}>
            {description}
          </ThemedText>
        ) : null}

        <ThemedView style={styles.actions}>
          <PrimaryButton
            title="Shop Now"
            onPress={handleShopNow}
            style={styles.shopButton}
            textStyles={styles.actionText}
          />
          <SecondaryButton
            title="Details"
            onPress={handleOpenRecommendation}
            disabled={!product.affiliate_advertisers?.slug}
            style={styles.whyButton}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
});
