import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useRevenueCat } from "@/4-shared/context/subscription/RevenueCatContext";
import { logEvent } from "@/4-shared/firebase";
import { useSubscription } from "@/4-shared/hooks/useSubscription";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { AccessibilityRole, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import createStyles from "./SubscriptionScreen.styles";

/**
 * SubscriptionScreen with correct star/ribbon and selected-bullet highlight.
 */

export function SubscriptionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { refreshCustomerInfo } = useRevenueCat();
  const {
    monthlyPackage,
    yearlyPackage,
    lifetimePackage,
    purchaseSubscription,
  } = useSubscription();

  const packages = {
    monthly: monthlyPackage,
    yearly: yearlyPackage,
    lifetime: lifetimePackage,
  };

  const { feature, from } = useLocalSearchParams<{
    feature?: string;
    from?: string;
  }>();

  useEffect(() => {
    logEvent("subscription_screen_view", {
      feature: feature ?? null,
      from: from ?? "unknown",
    });
  }, [feature, from]);

  // Default selection: prefer yearly, fallback to monthly or lifetime
  const defaultSelection = yearlyPackage
    ? "yearly"
    : monthlyPackage
      ? "monthly"
      : lifetimePackage
        ? "lifetime"
        : "monthly";
  const [selected, setSelected] = useState<"monthly" | "yearly" | "lifetime">(
    defaultSelection,
  );

  const selectedPackage = packages[selected];

  const onPressPrimary = async () => {
    logEvent("paywall_cta_tap", {
      variant: "select-and-pay",
      selection: selected,
    });
    if (!selectedPackage) {
      logEvent("paywall_error_no_package", { selection: selected });
      return;
    }
    try {
      const success = await purchaseSubscription(selectedPackage, false);
      if (success) {
        logEvent("subscription_purchase_success", { selection: selected });
        try {
          await refreshCustomerInfo();
        } catch (e) {
          console.warn("refreshCustomerInfo failed:", e);
        }
        await new Promise((r) => setTimeout(r, 800));
        if (from === "filter") {
          router.replace("/(tabs)");
        } else {
          router.back();
        }
      } else {
        logEvent("subscription_purchase_cancelled", { selection: selected });
      }
    } catch (e) {
      logEvent("subscription_purchase_error", {
        selection: selected,
        error: String(e),
      });
      console.error("Purchase error", e);
    }
  };

  const onDismiss = () => {
    logEvent("subscription_screen_dismissed", {
      feature: feature ?? null,
      from: from ?? "unknown",
    });
    if (from === "filter") {
      router.replace("/(tabs)");
    } else {
      router.back();
    }
  };

  // Render the highlighted detailed card for the currently selected plan
  const renderHighlightedCard = () => {
    const key = selected; // "monthly" | "yearly" | "lifetime"
    const pkg = packages[key];
    const title = key.charAt(0).toUpperCase() + key.slice(1);
    const priceLabel = pkg?.priceString ?? "$--";

    const bullets = [
      "Download unlimited original resolution images",
      "Free use of all gallery filters",
      "View and manage unlimited favorites & collections",
      "No ads — ad free experience",
    ];

    return (
      <Pressable
        onPress={() => setSelected(key)}
        style={[styles.bigCardContainer, styles.shadow]}
        accessibilityRole={"button" as AccessibilityRole}
        accessibilityLabel={`${title} plan details`}
      >
        {/* Only show a star/ribbon for lifetime */}
        {key === "lifetime" && (
          <ThemedView style={styles.starRibbon}>
            <ThemedText style={styles.starText}>★</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.bigCardInner}>
          <ThemedView style={styles.bigCardHeader}>
            <ThemedView style={styles.radioAndLabel}>
              {/* The highlighted card should always display its radio as selected */}
              <ThemedView style={[styles.radioCircle, styles.radioSelected]} />
              <ThemedText style={styles.bigCardTitle}>{title}</ThemedText>
            </ThemedView>

            <ThemedText style={styles.bigCardPrice}>
              {priceLabel}{" "}
              {key === "monthly" ? "/m" : key === "yearly" ? "/y" : ""}
            </ThemedText>
          </ThemedView>

          <ThemedText style={styles.bigCardSub}>
            {key === "monthly"
              ? "Pay monthly, cancel anytime"
              : key === "yearly"
                ? "Pay for a year"
                : "One-time payment • No recurring fees"}
          </ThemedText>

          <ThemedView style={styles.bullets}>
            {bullets.map((b, i) => (
              <ThemedView key={i} style={styles.bulletRow}>
                <ThemedView style={styles.bulletDot} />
                <ThemedText style={styles.bulletText}>{b}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      </Pressable>
    );
  };

  const renderCompactCard = (key: "monthly" | "yearly" | "lifetime") => {
    const pkg = packages[key];
    const title =
      key === "monthly" ? "Monthly" : key === "yearly" ? "Yearly" : "Lifetime";
    const priceLabel = pkg?.priceString ?? "$--";
    const isSelected = selected === key;

    return (
      <Pressable
        key={key}
        onPress={() => setSelected(key)}
        style={[
          styles.compactCard,
          isSelected ? styles.compactCardSelected : null,
        ]}
        accessibilityRole={"button" as AccessibilityRole}
        accessibilityLabel={`${title} plan`}
      >
        <ThemedView style={styles.compactLeft}>
          <ThemedView
            style={[
              styles.radioSmall,
              isSelected ? styles.radioSmallSelected : null,
            ]}
          />
          <ThemedView style={{ marginLeft: 10 }}>
            <ThemedText style={styles.compactTitle}>{title}</ThemedText>
            <ThemedText style={styles.compactSub}>
              {key === "monthly"
                ? "Pay monthly, cancel anytime"
                : key === "yearly"
                  ? "Pay for a year"
                  : "One-time payment"}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.compactPrice}>
          {priceLabel}
          {key === "monthly" ? "/m" : key === "yearly" ? "/y" : ""}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.background }]}
      edges={["top", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.headerRow}>
          <Pressable onPress={onDismiss} style={styles.backTouchable}>
            <ThemedText style={styles.backText}>‹</ThemedText>
          </Pressable>

          <ThemedView style={styles.headerTextWrap}>
            <ThemedText style={styles.h1}>Choose a plan</ThemedText>
            <ThemedText style={styles.h2}>All features, No limits.</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          style={{
            paddingHorizontal: 20,
            marginTop: 18,
          }}
        >
          {renderHighlightedCard()}
          {/* Highlighted card bottom shadow */}
          <View style={{ height: 14 }} />
          <ThemedView>
            {(["monthly", "yearly", "lifetime"] as const)
              .filter((k) => k !== selected)
              .map((k) => renderCompactCard(k))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={{ height: 140 }} />
      </ScrollView>

      <ThemedView style={styles.bottom}>
        <PrimaryButton
          title="Make Payment"
          onPress={onPressPrimary}
          style={styles.makePayment}
        />
        <SecondaryButton
          title="Maybe Later"
          onPress={onDismiss}
          style={styles.maybeLater}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

export default SubscriptionScreen;
