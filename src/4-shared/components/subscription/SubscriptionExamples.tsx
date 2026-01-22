import { useTheme } from "@/4-shared/theme/ThemeProvider";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomerCenter } from "@/4-shared/components/subscription/CustomerCenter";
import { Paywall } from "@/4-shared/components/subscription/Paywall";
import { SubscriptionGate } from "@/4-shared/components/subscription/SubscriptionGate";
import { useSubscription } from "@/4-shared/hooks/useSubscription";

/**
 * Example Profile Settings Component showing subscription integration
 */
export const ProfileSubscriptionSection: React.FC = () => {
  const { theme } = useTheme();
  const {
    hasProSubscription,
    subscriptionType,
    subscriptionStatus,
    formattedExpirationDate,
  } = useSubscription();

  const [showPaywall, setShowPaywall] = useState(false);
  const [showCustomerCenter, setShowCustomerCenter] = useState(false);

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  const handleManageSubscription = () => {
    setShowCustomerCenter(true);
  };

  const handlePurchaseSuccess = () => {
    setShowPaywall(false);
    Alert.alert(
      "Welcome to Pro!",
      "Thank you for upgrading to Mosaic Pro. You now have access to all premium features.",
      [{ text: "Get Started" }],
    );
  };

  return (
    <View style={styles.container}>
      {/* Subscription Status Card */}
      <View
        style={[styles.subscriptionCard, { backgroundColor: theme.surface }]}
      >
        <View style={styles.subscriptionHeader}>
          <Text style={[styles.subscriptionTitle, { color: theme.text }]}>
            Subscription
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: subscriptionStatus.color + "20" },
            ]}
          >
            <Text
              style={[styles.statusText, { color: subscriptionStatus.color }]}
            >
              {subscriptionStatus.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {hasProSubscription ? (
          <>
            <Text style={[styles.subscriptionDetails, { color: theme.text }]}>
              Mosaic Pro - {subscriptionType}
            </Text>
            {formattedExpirationDate && subscriptionType !== "lifetime" && (
              <Text
                style={[styles.expirationText, { color: theme.textSecondary }]}
              >
                {subscriptionType === "monthly" ? "Renews" : "Expires"}:{" "}
                {formattedExpirationDate}
              </Text>
            )}
            {subscriptionType === "lifetime" && (
              <Text
                style={[styles.expirationText, { color: theme.textSecondary }]}
              >
                Lifetime access - never expires
              </Text>
            )}
            <TouchableOpacity
              style={[styles.manageButton, { backgroundColor: theme.primary }]}
              onPress={handleManageSubscription}
            >
              <Text style={[styles.manageButtonText, { color: theme.surface }]}>
                Manage Subscription
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text
              style={[
                styles.subscriptionDetails,
                { color: theme.textSecondary },
              ]}
            >
              Free Plan
            </Text>
            <Text
              style={[
                styles.upgradeDescription,
                { color: theme.textSecondary },
              ]}
            >
              Upgrade to unlock unlimited downloads, high-resolution images, and
              exclusive content
            </Text>
            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
              onPress={handleUpgrade}
            >
              <Text
                style={[styles.upgradeButtonText, { color: theme.surface }]}
              >
                Upgrade to Pro
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Premium Features Preview */}
      {!hasProSubscription && (
        <View style={styles.featuresPreview}>
          <Text style={[styles.featuresTitle, { color: theme.text }]}>
            Pro Features
          </Text>
          <View style={styles.featuresList}>
            {[
              "🎨 Unlimited Downloads",
              "⚡ Advanced Filters",
              "🚫 Ad-Free Experience",
              "⭐ Exclusive Content",
            ].map((feature, index) => (
              <Text
                key={index}
                style={[styles.featureItem, { color: theme.textSecondary }]}
              >
                {feature}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Paywall Modal */}
      <Modal
        visible={showPaywall}
        presentationStyle="pageSheet"
        animationType="slide"
      >
        <Paywall
          onDismiss={() => setShowPaywall(false)}
          onPurchaseSuccess={handlePurchaseSuccess}
          presentedFrom="profile_settings"
        />
      </Modal>

      {/* Customer Center Modal */}
      <Modal
        visible={showCustomerCenter}
        presentationStyle="pageSheet"
        animationType="slide"
      >
        <CustomerCenter onDismiss={() => setShowCustomerCenter(false)} />
      </Modal>
    </View>
  );
};

/**
 * Example Download Button with subscription gating
 */
export const ProtectedDownloadButton: React.FC<{
  onDownload: () => void;
  imageId: string;
}> = ({ onDownload, imageId }) => {
  const { theme } = useTheme();
  const { canAccessFeature, showUpgradePrompt } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleDownload = () => {
    if (canAccessFeature("unlimited_downloads")) {
      onDownload();
    } else {
      setShowPaywall(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.downloadButton, { backgroundColor: theme.primary }]}
        onPress={handleDownload}
      >
        <Text style={[styles.downloadButtonText, { color: theme.surface }]}>
          Download HD
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showPaywall}
        presentationStyle="pageSheet"
        animationType="slide"
      >
        <Paywall
          onDismiss={() => setShowPaywall(false)}
          onPurchaseSuccess={() => {
            setShowPaywall(false);
            onDownload();
          }}
          presentedFrom="download_button"
          feature="unlimited_downloads"
        />
      </Modal>
    </>
  );
};

/**
 * Example Advanced Filters with subscription gate
 */
export const AdvancedFiltersSection: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SubscriptionGate
      feature="advanced_filters"
      customMessage="Access professional-grade filters and effects with Mosaic Pro"
    >
      <View
        style={[styles.filtersContainer, { backgroundColor: theme.surface }]}
      >
        <Text style={[styles.filtersTitle, { color: theme.text }]}>
          Advanced Filters
        </Text>

        <View style={styles.filtersList}>
          {["Vintage", "HDR", "Portrait", "Cinematic"].map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterChip, { backgroundColor: theme.background }]}
            >
              <Text style={[styles.filterChipText, { color: theme.text }]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SubscriptionGate>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  subscriptionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  subscriptionDetails: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  expirationText: {
    fontSize: 14,
    marginBottom: 16,
  },
  upgradeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  manageButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  featuresPreview: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  downloadButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filtersContainer: {
    borderRadius: 12,
    padding: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  filtersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
