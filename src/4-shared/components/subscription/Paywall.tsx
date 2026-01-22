import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { logEvent } from "../../firebase";
import { useSubscription } from "../../hooks/useSubscription";

/**
 * Paywall Props
 */
interface PaywallProps {
  onDismiss?: () => void;
  onPurchaseSuccess?: () => void;
  presentedFrom?: string;
  feature?: string;
}

/**
 * Premium features list
 */
const PREMIUM_FEATURES = [
  {
    icon: "🎨",
    title: "Unlimited Downloads",
    description: "Download any image in high resolution without limits",
  },
  {
    icon: "⚡",
    title: "Advanced Filters",
    description: "Access to professional-grade image filters and effects",
  },
  {
    icon: "🚫",
    title: "Ad-Free Experience",
    description: "Enjoy the app without any interruptions or advertisements",
  },
  {
    icon: "⭐",
    title: "Exclusive Content",
    description: "Access premium photographers and exclusive collections",
  },
  {
    icon: "🎯",
    title: "Priority Support",
    description: "Get faster support and direct access to our team",
  },
  {
    icon: "☁️",
    title: "Cloud Sync",
    description: "Sync your favorites and collections across all devices",
  },
];

/**
 * Paywall Component
 * Beautiful subscription screen using RevenueCat packages
 */
export const Paywall: React.FC<PaywallProps> = ({
  onDismiss,
  onPurchaseSuccess,
  presentedFrom = "unknown",
  feature,
}) => {
  const { theme } = useTheme();
  const {
    availablePackages,
    monthlyPackage,
    yearlyPackage,
    lifetimePackage,
    isPurchasing,
    isLoading,
    purchaseSubscription,
    restoreSubscriptions,
    error,
    handleError,
  } = useSubscription();

  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // Auto-select yearly package as recommended
  useEffect(() => {
    if (yearlyPackage && !selectedPackage) {
      setSelectedPackage(yearlyPackage.identifier);
    }
  }, [yearlyPackage, selectedPackage]);

  // Log paywall presentation
  useEffect(() => {
    logEvent("paywall_presented", {
      presented_from: presentedFrom,
      feature: feature || null,
    });
  }, [presentedFrom, feature]);

  // Handle errors
  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error, handleError]);

  /**
   * Handle package selection
   */
  const handlePackageSelect = useCallback(
    (packageId: string) => {
      setSelectedPackage(packageId);
      logEvent("paywall_package_selected", {
        package_id: packageId,
        presented_from: presentedFrom,
      });
    },
    [presentedFrom],
  );

  /**
   * Handle purchase
   */
  const handlePurchase = useCallback(async () => {
    const packageToPurchase = availablePackages.find(
      (pkg) => pkg.identifier === selectedPackage,
    );

    if (!packageToPurchase) return;

    try {
      const success = await purchaseSubscription(packageToPurchase, false);

      if (success) {
        await logEvent("paywall_purchase_success", {
          package_id: selectedPackage,
          presented_from: presentedFrom,
          feature: feature || null,
        });

        onPurchaseSuccess?.();
      }
    } catch (err) {
      console.error("Purchase failed:", err);
    }
  }, [
    selectedPackage,
    availablePackages,
    purchaseSubscription,
    presentedFrom,
    feature,
    onPurchaseSuccess,
  ]);

  /**
   * Handle restore purchases
   */
  const handleRestore = useCallback(async () => {
    try {
      await logEvent("paywall_restore_tapped", {
        presented_from: presentedFrom,
      });

      const success = await restoreSubscriptions();
      if (success) {
        onPurchaseSuccess?.();
      }
    } catch (err) {
      console.error("Restore failed:", err);
    }
  }, [restoreSubscriptions, presentedFrom, onPurchaseSuccess]);

  /**
   * Handle dismiss
   */
  const handleDismiss = useCallback(() => {
    logEvent("paywall_dismissed", {
      presented_from: presentedFrom,
      selected_package: selectedPackage || null,
    });
    onDismiss?.();
  }, [onDismiss, presentedFrom, selectedPackage]);

  /**
   * Render package option
   */
  const renderPackageOption = useCallback(
    (packageInfo: any) => {
      const isSelected = selectedPackage === packageInfo.identifier;
      const isRecommended = packageInfo.isRecommended;

      return (
        <TouchableOpacity
          key={packageInfo.identifier}
          style={[
            styles.packageOption,
            {
              backgroundColor: isSelected
                ? theme.primary + "20"
                : theme.surface,
              borderColor: isSelected ? theme.primary : theme.border,
              borderWidth: isSelected ? 2 : 1,
            },
          ]}
          onPress={() => handlePackageSelect(packageInfo.identifier)}
          activeOpacity={0.7}
        >
          {isRecommended && (
            <View
              style={[
                styles.recommendedBadge,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={[styles.recommendedText, { color: theme.surface }]}>
                RECOMMENDED
              </Text>
            </View>
          )}

          <View style={styles.packageHeader}>
            <Text style={[styles.packagePeriod, { color: theme.text }]}>
              {packageInfo.period}
            </Text>
            {packageInfo.savings && (
              <Text style={[styles.savingsText, { color: theme.primary }]}>
                {packageInfo.savings}
              </Text>
            )}
          </View>

          <Text style={[styles.packagePrice, { color: theme.text }]}>
            {packageInfo.priceString}
          </Text>

          {packageInfo.period !== "Lifetime" && (
            <Text
              style={[
                styles.packageDescription,
                { color: theme.textSecondary },
              ]}
            >
              {`${packageInfo.priceString}/${packageInfo.period.toLowerCase()}`}
            </Text>
          )}

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={[styles.checkmark, { color: theme.primary }]}>
                ✓
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [selectedPackage, theme, handlePackageSelect],
  );

  /**
   * Render feature item
   */
  const renderFeatureItem = useCallback(
    ({ item }: { item: (typeof PREMIUM_FEATURES)[0] }) => (
      <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>{item.icon}</Text>
        <View style={styles.featureContent}>
          <Text style={[styles.featureTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text
            style={[styles.featureDescription, { color: theme.textSecondary }]}
          >
            {item.description}
          </Text>
        </View>
      </View>
    ),
    [theme],
  );

  if (isLoading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading subscription options...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.closeText, { color: theme.textSecondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Text style={styles.logoText}>📸</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            Upgrade to Mosaic Pro
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Unlock the full potential of photography
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          {PREMIUM_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Package Options */}
        <View style={styles.packagesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Choose Your Plan
          </Text>

          <View style={styles.packagesList}>
            {lifetimePackage && renderPackageOption(lifetimePackage)}
            {yearlyPackage && renderPackageOption(yearlyPackage)}
            {monthlyPackage && renderPackageOption(monthlyPackage)}
          </View>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            {
              backgroundColor: theme.primary,
              opacity: !selectedPackage || isPurchasing ? 0.6 : 1,
            },
          ]}
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
          activeOpacity={0.8}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color={theme.surface} />
          ) : (
            <Text style={[styles.purchaseButtonText, { color: theme.surface }]}>
              Start Free Trial
            </Text>
          )}
        </TouchableOpacity>

        {/* Restore Button */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isPurchasing}
        >
          <Text
            style={[styles.restoreButtonText, { color: theme.textSecondary }]}
          >
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={[styles.termsText, { color: theme.textSecondary }]}>
            Free trial for new users. Cancel anytime.{"\n"}
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  packagesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  packagesList: {
    gap: 12,
  },
  packageOption: {
    borderRadius: 16,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  recommendedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  packagePeriod: {
    fontSize: 20,
    fontWeight: "bold",
  },
  savingsText: {
    fontSize: 14,
    fontWeight: "600",
  },
  packagePrice: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: 16,
    right: 20,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: "bold",
  },
  purchaseButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  restoreButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  restoreButtonText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  termsSection: {
    paddingBottom: 32,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
