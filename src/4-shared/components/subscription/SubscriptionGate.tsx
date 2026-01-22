import React, { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useSubscription } from "../../hooks/useSubscription";
import { useTheme } from "../../theme/ThemeProvider";

/**
 * Subscription Gate Props
 */
interface SubscriptionGateProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
  showUpgradeButton?: boolean;
  customMessage?: string;
  onUpgradePress?: () => void;
  style?: ViewStyle;
}

/**
 * Feature gate messages
 */
const FEATURE_MESSAGES: Record<string, string> = {
  unlimited_downloads: "Unlimited Downloads",
  high_resolution_images: "High Resolution Images",
  advanced_filters: "Advanced Filters",
  priority_support: "Priority Support",
  ad_free_experience: "Ad-Free Experience",
  exclusive_content: "Exclusive Content",
  cloud_sync: "Cloud Sync",
  collections_unlimited: "Unlimited Collections",
  favorites_unlimited: "Unlimited Favorites",
};

/**
 * Subscription Gate Component
 * Conditionally renders content based on subscription status
 */
export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  feature,
  fallback,
  showUpgradeButton = true,
  customMessage,
  onUpgradePress,
  style,
}) => {
  const { theme } = useTheme();
  const { canAccessFeature, showUpgradePrompt } = useSubscription();

  // Check if user can access the feature
  const hasAccess = canAccessFeature(feature);

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  const featureTitle = FEATURE_MESSAGES[feature] || feature.replace(/_/g, " ");
  const message =
    customMessage || `Upgrade to Mosaic Pro to unlock ${featureTitle}`;

  const handleUpgradePress = () => {
    if (onUpgradePress) {
      onUpgradePress();
    } else {
      showUpgradePrompt(feature);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }, style]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.primary + "20" },
          ]}
        >
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Premium Feature
        </Text>

        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>

        {showUpgradeButton && (
          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
            onPress={handleUpgradePress}
            activeOpacity={0.8}
          >
            <Text style={[styles.upgradeButtonText, { color: theme.surface }]}>
              Upgrade to Pro
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Simple subscription gate that only shows/hides content
 */
export const SimpleSubscriptionGate: React.FC<{
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
}> = ({ children, feature, fallback = null }) => {
  const { canAccessFeature } = useSubscription();

  return canAccessFeature(feature) ? <>{children}</> : <>{fallback}</>;
};

/**
 * Subscription badge component
 */
export const SubscriptionBadge: React.FC<{
  feature: string;
  style?: ViewStyle;
}> = ({ feature, style }) => {
  const { theme } = useTheme();
  const { canAccessFeature } = useSubscription();

  if (canAccessFeature(feature)) return null;

  return (
    <View style={[styles.badge, { backgroundColor: theme.primary }, style]}>
      <Text style={[styles.badgeText, { color: theme.surface }]}>PRO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  content: {
    alignItems: "center",
    maxWidth: 280,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  lockIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  upgradeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    position: "absolute",
    top: 8,
    right: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
