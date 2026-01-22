import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

import { useRevenueCat } from "@/4-shared/context/subscription/RevenueCatContext";
import { logEvent } from "@/4-shared/firebase";

/**
 * RevenueCat UI Paywall Props
 */
interface RevenueCatPaywallProps {
  onDismiss?: () => void;
  onPurchaseSuccess?: () => void;
  onRestoreSuccess?: () => void;
  presentedFrom?: string;
  feature?: string;
  displayCloseButton?: boolean;
}

/**
 * RevenueCat Native UI Paywall Component
 * Uses RevenueCat's native paywall UI with your configured offerings
 */
export const RevenueCatPaywall: React.FC<RevenueCatPaywallProps> = ({
  onDismiss,
  onPurchaseSuccess,
  onRestoreSuccess,
  presentedFrom = "unknown",
  feature,
  displayCloseButton = true,
}) => {
  const { currentOffering, isInitializing, refreshCustomerInfo } =
    useRevenueCat();

  // Log paywall presentation
  useEffect(() => {
    logEvent("revenuecat_paywall_presented", {
      presented_from: presentedFrom,
      feature: feature || null,
      offering_id: currentOffering?.identifier || null,
    });
  }, [presentedFrom, feature, currentOffering]);

  /**
   * Handle paywall result
   */
  const handlePaywallResult = useCallback(
    async (result: any) => {
      console.log("Paywall result:", result);

      try {
        await logEvent("revenuecat_paywall_result", {
          result_type: result.result,
          presented_from: presentedFrom,
          feature: feature || null,
        });

        switch (result.result) {
          case PAYWALL_RESULT.PURCHASED:
            // Refresh customer info to get latest entitlements
            await refreshCustomerInfo();
            await logEvent("revenuecat_paywall_purchase_success", {
              presented_from: presentedFrom,
              feature: feature || null,
            });
            onPurchaseSuccess?.();
            break;

          case PAYWALL_RESULT.RESTORED:
            // Refresh customer info to get latest entitlements
            await refreshCustomerInfo();
            await logEvent("revenuecat_paywall_restore_success", {
              presented_from: presentedFrom,
            });
            onRestoreSuccess?.();
            break;

          case PAYWALL_RESULT.CANCELLED:
            await logEvent("revenuecat_paywall_cancelled", {
              presented_from: presentedFrom,
            });
            onDismiss?.();
            break;

          case PAYWALL_RESULT.ERROR:
            await logEvent("revenuecat_paywall_error", {
              presented_from: presentedFrom,
              error: result.error?.message || "Unknown error",
            });

            Alert.alert(
              "Purchase Error",
              result.error?.message ||
                "An error occurred during purchase. Please try again.",
              [{ text: "OK", onPress: onDismiss }],
            );
            break;

          default:
            console.warn("Unknown paywall result:", result.result);
            break;
        }
      } catch (error) {
        console.error("Error handling paywall result:", error);
      }
    },
    [
      presentedFrom,
      feature,
      refreshCustomerInfo,
      onPurchaseSuccess,
      onRestoreSuccess,
      onDismiss,
    ],
  );

  /**
   * Handle close button press
   */
  const handleClosePress = useCallback(() => {
    logEvent("revenuecat_paywall_close_pressed", {
      presented_from: presentedFrom,
    });
    onDismiss?.();
  }, [presentedFrom, onDismiss]);

  // Show loading while initializing
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show error if no offering available
  if (!currentOffering) {
    // Show alert when no offering is available
    useEffect(() => {
      Alert.alert(
        "Unable to Load Subscription Options",
        "Please check your internet connection and try again.",
        [{ text: "OK", onPress: onDismiss }],
      );
    }, [onDismiss]);

    return <View style={styles.errorContainer}></View>;
  }

  return (
    <View style={styles.container}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={handlePaywallResult}
        onRestoreCompleted={handlePaywallResult}
        onPurchaseError={handlePaywallResult}
        onDismiss={handleClosePress}
      />
    </View>
  );
};

/**
 * RevenueCat Footer Paywall Component
 * Uses RevenueCat's programmatic presentation for inline use
 */
export const RevenueCatFooterPaywall: React.FC<{
  onPurchase?: () => void;
  onDismiss?: () => void;
}> = ({ onPurchase, onDismiss }) => {
  const { currentOffering, isInitializing } = useRevenueCat();

  const handlePresentPaywall = useCallback(async () => {
    if (!currentOffering) return;

    try {
      const result = await RevenueCatUI.presentPaywall({
        offering: currentOffering,
      });

      if (result === PAYWALL_RESULT.PURCHASED) {
        onPurchase?.();
      } else if (result === PAYWALL_RESULT.CANCELLED) {
        onDismiss?.();
      }
    } catch (error) {
      console.error("Footer paywall presentation failed:", error);
      onDismiss?.();
    }
  }, [currentOffering, onPurchase, onDismiss]);

  if (isInitializing || !currentOffering) {
    return (
      <View style={styles.footerLoadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={handlePresentPaywall}
        style={styles.footerButton}
      >
        <Text style={styles.footerButtonText}>Upgrade to Pro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  footerLoadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  footerContainer: {
    maxHeight: 200,
  },
  footerButton: {
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
