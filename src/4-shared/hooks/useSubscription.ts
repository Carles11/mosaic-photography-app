import { useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { PurchasesPackage } from "react-native-purchases";

import { logEvent } from "@/4-shared/firebase";
import { useRouter } from "expo-router";
import { useAuthSession } from "../context/auth/AuthSessionContext";
import { useRevenueCat } from "../context/subscription/RevenueCatContext";

/**
 * Package info for easier access
 */
export interface SubscriptionPackageInfo {
  identifier: string;
  productId: string;
  title: string;
  description: string;
  price: string;
  currencyCode: string;
  priceString: string;
  period: string;
  periodUnit: string;
  periodNumberOfUnits: number;
  isRecommended?: boolean;
  savings?: string;
  package: PurchasesPackage;
}

/**
 * Subscription management hook
 * Provides easy access to subscription functionality with enhanced features
 */
export const useSubscription = () => {
  const {
    isInitializing,
    isLoading,
    isPurchasing,
    isRestoring,
    customerInfo,
    currentOffering,
    hasProSubscription,
    hasActiveSubscription,
    subscriptionType,
    subscriptionExpirationDate,
    error,
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
    clearError,
  } = useRevenueCat();

  const { user, signOut } = useAuthSession();
  const router = useRouter();

  /**
   * Get formatted packages with additional info
   */
  const availablePackages = useMemo((): SubscriptionPackageInfo[] => {
    if (!currentOffering?.availablePackages) return [];

    return currentOffering.availablePackages.map((pkg) => {
      const product = pkg.product;
      const id = pkg.identifier.toLowerCase();

      // Improved package type detection
      const isMonthly =
        id.includes("monthly") ||
        id.includes("month") ||
        id.includes("$rc_monthly");
      const isYearly =
        id.includes("yearly") ||
        id.includes("annual") ||
        id.includes("year") ||
        id.includes("$rc_annual");
      const isLifetime =
        id.includes("lifetime") ||
        id.includes("life") ||
        id.includes("permanent");

      let period = "";
      let savings = "";

      if (isMonthly) {
        period = "Monthly";
      } else if (isYearly) {
        period = "Yearly";
        // Calculate savings if monthly package exists
        const monthlyPkg = currentOffering.availablePackages.find((p) => {
          const monthlyId = p.identifier.toLowerCase();
          return (
            monthlyId.includes("monthly") ||
            monthlyId.includes("month") ||
            monthlyId.includes("$rc_monthly")
          );
        });
        if (monthlyPkg) {
          const monthlyPrice = monthlyPkg.product.price;
          const yearlyPrice = product.price;
          const monthlyCost = monthlyPrice * 12;
          const savingsAmount = monthlyCost - yearlyPrice;
          const savingsPercent = Math.round(
            (savingsAmount / monthlyCost) * 100,
          );
          savings = `Save ${savingsPercent}%`;
        }
      } else if (isLifetime) {
        period = "Lifetime";
        savings = "Best Value";
      }

      return {
        identifier: pkg.identifier,
        productId: product.identifier,
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        currencyCode: product.currencyCode,
        priceString: product.priceString,
        period,
        periodUnit: "",
        periodNumberOfUnits: 0,
        isRecommended: isYearly, // Mark yearly as recommended
        savings,
        package: pkg,
      };
    });
  }, [currentOffering]);

  /**
   * Get specific package by type
   */
  const getPackageByType = useCallback(
    (type: "monthly" | "yearly" | "lifetime") => {
      return availablePackages.find((pkg) => {
        const id = pkg.identifier.toLowerCase();

        switch (type) {
          case "monthly":
            return (
              id.includes("monthly") ||
              id.includes("month") ||
              id.includes("$rc_monthly")
            );
          case "yearly":
            return (
              id.includes("yearly") ||
              id.includes("annual") ||
              id.includes("year") ||
              id.includes("$rc_annual")
            );
          case "lifetime":
            return (
              id.includes("lifetime") ||
              id.includes("life") ||
              id.includes("permanent")
            );
          default:
            return false;
        }
      });
    },
    [availablePackages],
  );

  /**
   * Purchase subscription with confirmation
   */
  const purchaseSubscription = useCallback(
    async (
      packageInfo: SubscriptionPackageInfo,
      showConfirmation: boolean = true,
    ): Promise<boolean> => {
      if (showConfirmation) {
        return new Promise((resolve) => {
          Alert.alert(
            "Confirm Purchase",
            `Purchase ${packageInfo.period} subscription for ${packageInfo.priceString}?`,
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => resolve(false),
              },
              {
                text: "Purchase",
                onPress: async () => {
                  const success = await purchasePackage(packageInfo.package);
                  if (success) {
                    await logEvent("subscription_purchase_completed", {
                      package_type: packageInfo.period.toLowerCase(),
                      price: packageInfo.price,
                      currency: packageInfo.currencyCode,
                    });
                  }
                  resolve(success);
                },
              },
            ],
          );
        });
      } else {
        const success = await purchasePackage(packageInfo.package);
        if (success) {
          await logEvent("subscription_purchase_completed", {
            package_type: packageInfo.period.toLowerCase(),
            price: packageInfo.price,
            currency: packageInfo.currencyCode,
          });
        }
        return success;
      }
    },
    [purchasePackage],
  );

  /**
   * Restore purchases with confirmation
   */
  const restoreSubscriptions = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        "Restore Purchases",
        "This will restore any previous purchases made with this Apple ID or Google account.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Restore",
            onPress: async () => {
              const success = await restorePurchases();
              if (success) {
                await logEvent("subscription_restored_success", {});
                Alert.alert(
                  "Success",
                  "Your purchases have been restored successfully!",
                  [{ text: "OK" }],
                );
              } else {
                Alert.alert(
                  "No Purchases Found",
                  "No previous purchases were found for this account.",
                  [{ text: "OK" }],
                );
              }
              resolve(success);
            },
          },
        ],
      );
    });
  }, [restorePurchases]);

  /**
   * Get subscription status info
   */
  const subscriptionStatus = useMemo(() => {
    if (!hasProSubscription) {
      return {
        status: "inactive",
        message: "No active subscription",
        color: "#666666",
      };
    }

    const now = new Date();
    const isExpired =
      subscriptionExpirationDate && subscriptionExpirationDate < now;
    const isExpiringSoon =
      subscriptionExpirationDate &&
      subscriptionExpirationDate.getTime() - now.getTime() <
        7 * 24 * 60 * 60 * 1000; // 7 days

    if (isExpired) {
      return {
        status: "expired",
        message: "Subscription expired",
        color: "#ff4444",
      };
    }

    if (isExpiringSoon && subscriptionType !== "lifetime") {
      return {
        status: "expiring",
        message: "Expires soon",
        color: "#ff8800",
      };
    }

    if (subscriptionType === "lifetime") {
      return {
        status: "lifetime",
        message: "Lifetime subscription",
        color: "#00aa44",
      };
    }

    return {
      status: "active",
      message: `${subscriptionType} subscription`,
      color: "#00aa44",
    };
  }, [hasProSubscription, subscriptionType, subscriptionExpirationDate]);

  /**
   * Format expiration date
   */
  const formattedExpirationDate = useMemo(() => {
    if (!subscriptionExpirationDate) return null;

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return subscriptionExpirationDate.toLocaleDateString(undefined, options);
  }, [subscriptionExpirationDate]);

  /**
   * Check if subscription feature is available
   */
  const canAccessFeature = useCallback(
    (feature: string): boolean => {
      // For now, all Pro features are gated behind the Pro subscription
      // You can extend this logic for different tiers
      switch (feature) {
        case "unlimited_downloads":
        case "high_resolution_images":
        case "advanced_filters":
        case "advanced_search":
        case "print_quality_filter":
        case "year_range_filter":
        case "favorites_unlimited":
        case "priority_support":
        case "ad_free_experience":
        case "exclusive_content":
          return hasProSubscription;
        default:
          return true; // Free features
      }
    },
    [hasProSubscription],
  );

  /**
   * Get feature gate message
   */
  const getFeatureGateMessage = useCallback((feature: string): string => {
    return `This feature is only available with Mosaic Pro subscription. Upgrade to access ${feature.replace(/_/g, " ")}.`;
  }, []);

  /**
   * Show upgrade prompt
   */
  const showUpgradePrompt = useCallback(
    (feature?: string) => {
      // Check if user is logged in first
      if (!user) {
        Alert.alert(
          "Login Required",
          "Please create an account or login to purchase a subscription and unlock premium features.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Login",
              onPress: () => {
                logEvent("login_required_for_purchase", { feature });
                // Navigate to login with subscription context
                router.push({
                  pathname: "/auth/login",
                  params: {
                    returnTo: "subscription",
                    feature: feature || "",
                    from: "filter",
                  },
                });
              },
            },
          ],
        );
        return;
      }

      const message = feature
        ? getFeatureGateMessage(feature)
        : "Upgrade to Mosaic Pro to unlock all premium features.";

      Alert.alert("Upgrade to Pro", message, [
        { text: "Later", style: "cancel" },
        {
          text: "View Plans",
          onPress: () => {
            logEvent("upgrade_prompt_tapped", { feature });

            // Navigate directly to subscription screen
            router.push({
              pathname: "/subscription",
              params: {
                feature: feature || "",
                from: "upgrade_prompt",
              },
            });
          },
        },
      ]);
    },
    [getFeatureGateMessage, user, router],
  );

  /**
   * Handle subscription errors
   */
  const handleError = useCallback(
    (error: string) => {
      Alert.alert("Subscription Error", error, [
        { text: "OK", onPress: clearError },
      ]);
    },
    [clearError],
  );

  return {
    // State
    isInitializing,
    isLoading,
    isPurchasing,
    isRestoring,
    error,

    // Customer data
    customerInfo,

    // Subscription status
    hasProSubscription,
    hasActiveSubscription,
    subscriptionType,
    subscriptionExpirationDate,
    formattedExpirationDate,
    subscriptionStatus,

    // Packages
    availablePackages,
    monthlyPackage: getPackageByType("monthly"),
    yearlyPackage: getPackageByType("yearly"),
    lifetimePackage: getPackageByType("lifetime"),

    // Actions
    purchaseSubscription,
    restoreSubscriptions,
    refreshCustomerInfo,

    // Feature gating
    canAccessFeature,
    getFeatureGateMessage,
    showUpgradePrompt,

    // Utilities
    getPackageByType,
    handleError,
    clearError,
  };
};
