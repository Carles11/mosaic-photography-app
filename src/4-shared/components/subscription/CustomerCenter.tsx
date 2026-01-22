import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
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
 * Customer Center Props
 */
interface CustomerCenterProps {
  onDismiss?: () => void;
}

/**
 * Customer Center Component
 * Allows users to manage their subscription, view billing info, and get support
 */
export const CustomerCenter: React.FC<CustomerCenterProps> = ({
  onDismiss,
}) => {
  const { theme } = useTheme();
  const {
    hasProSubscription,
    subscriptionType,
    subscriptionStatus,
    formattedExpirationDate,
    restoreSubscriptions,
    refreshCustomerInfo,
    isLoading,
    customerInfo,
  } = useSubscription();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Log customer center presentation
  useEffect(() => {
    logEvent("customer_center_presented", {
      has_subscription: hasProSubscription,
      subscription_type: subscriptionType || "none",
    });
  }, [hasProSubscription, subscriptionType]);

  /**
   * Refresh customer info
   */
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshCustomerInfo();
      await logEvent("customer_center_refreshed", {});
    } catch (error) {
      console.error("Failed to refresh customer info:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshCustomerInfo]);

  /**
   * Handle restore purchases
   */
  const handleRestore = useCallback(async () => {
    try {
      await logEvent("customer_center_restore_tapped", {});
      await restoreSubscriptions();
    } catch (error) {
      console.error("Failed to restore purchases:", error);
    }
  }, [restoreSubscriptions]);

  /**
   * Handle subscription management
   */
  const handleManageSubscription = useCallback(() => {
    logEvent("customer_center_manage_subscription_tapped", {
      platform: Platform.OS,
    });

    const title = "Manage Subscription";
    let message: string;
    let actions: any[];

    if (Platform.OS === "ios") {
      message = "You can manage your subscription in the App Store settings.";
      actions = [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openURL("itms-apps://apps.apple.com/account/subscriptions");
          },
        },
      ];
    } else {
      message = "You can manage your subscription in the Google Play Store.";
      actions = [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Play Store",
          onPress: () => {
            Linking.openURL(
              "https://play.google.com/store/account/subscriptions",
            );
          },
        },
      ];
    }

    Alert.alert(title, message, actions);
  }, []);

  /**
   * Handle contact support
   */
  const handleContactSupport = useCallback(() => {
    logEvent("customer_center_contact_support_tapped", {});

    Alert.alert(
      "Contact Support",
      "How would you like to contact our support team?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Email",
          onPress: () => {
            const subject = "Mosaic App - Support Request";
            const body = `User ID: ${customerInfo?.originalAppUserId || "Anonymous"}\nSubscription: ${subscriptionType || "None"}\n\nDescribe your issue:\n`;
            const emailUrl = `mailto:support@mosaicapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            Linking.openURL(emailUrl);
          },
        },
      ],
    );
  }, [customerInfo, subscriptionType]);

  /**
   * Handle privacy policy
   */
  const handlePrivacyPolicy = useCallback(() => {
    logEvent("customer_center_privacy_policy_tapped", {});
    Linking.openURL("https://mosaicapp.com/privacy");
  }, []);

  /**
   * Handle terms of service
   */
  const handleTermsOfService = useCallback(() => {
    logEvent("customer_center_terms_tapped", {});
    Linking.openURL("https://mosaicapp.com/terms");
  }, []);

  /**
   * Render subscription info card
   */
  const renderSubscriptionInfo = () => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>
        Subscription Status
      </Text>

      <View style={styles.subscriptionRow}>
        <View style={styles.subscriptionInfo}>
          <Text
            style={[
              styles.subscriptionStatus,
              { color: subscriptionStatus.color },
            ]}
          >
            {subscriptionStatus.status.toUpperCase()}
          </Text>
          {hasProSubscription && (
            <>
              <Text style={[styles.subscriptionType, { color: theme.text }]}>
                Mosaic Pro - {subscriptionType}
              </Text>
              {formattedExpirationDate && subscriptionType !== "lifetime" && (
                <Text
                  style={[
                    styles.expirationDate,
                    { color: theme.textSecondary },
                  ]}
                >
                  {subscriptionType === "monthly" ? "Renews" : "Expires"}:{" "}
                  {formattedExpirationDate}
                </Text>
              )}
              {subscriptionType === "lifetime" && (
                <Text
                  style={[
                    styles.expirationDate,
                    { color: theme.textSecondary },
                  ]}
                >
                  Never expires
                </Text>
              )}
            </>
          )}
          {!hasProSubscription && (
            <Text
              style={[styles.subscriptionType, { color: theme.textSecondary }]}
            >
              No active subscription
            </Text>
          )}
        </View>

        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: subscriptionStatus.color },
          ]}
        />
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.background }]}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={[styles.actionButtonText, { color: theme.primary }]}>
              Refresh
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.background }]}
          onPress={handleRestore}
        >
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>
            Restore
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render action item
   */
  const renderActionItem = (
    title: string,
    subtitle: string,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      style={[styles.actionItem, { backgroundColor: theme.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionItemContent}>
        <Text style={[styles.actionItemTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text
          style={[styles.actionItemSubtitle, { color: theme.textSecondary }]}
        >
          {subtitle}
        </Text>
      </View>
      <Text style={[styles.actionItemArrow, { color: theme.textSecondary }]}>
        →
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Account & Billing
        </Text>
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.closeText, { color: theme.textSecondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Subscription Info */}
        {renderSubscriptionInfo()}

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Manage Account
          </Text>

          {hasProSubscription &&
            renderActionItem(
              "Manage Subscription",
              `Cancel, change, or view billing details for your ${subscriptionType} plan`,
              handleManageSubscription,
            )}

          {renderActionItem(
            "Contact Support",
            "Get help with your account or subscription",
            handleContactSupport,
          )}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Legal & Privacy
          </Text>

          {renderActionItem(
            "Privacy Policy",
            "View our privacy policy and data handling practices",
            handlePrivacyPolicy,
          )}

          {renderActionItem(
            "Terms of Service",
            "Read our terms and conditions",
            handleTermsOfService,
          )}
        </View>

        {/* Account Info */}
        {customerInfo && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Account Information
            </Text>

            <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, { color: theme.textSecondary }]}
                >
                  User ID
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {customerInfo.originalAppUserId}
                </Text>
              </View>

              {customerInfo.originalPurchaseDate && (
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, { color: theme.textSecondary }]}
                  >
                    Customer Since
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>
                    {new Date(
                      customerInfo.originalPurchaseDate,
                    ).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subscriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionStatus: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subscriptionType: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  expirationDate: {
    fontSize: 14,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionItemContent: {
    flex: 1,
  },
  actionItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionItemSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionItemArrow: {
    fontSize: 18,
    marginLeft: 12,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
});
