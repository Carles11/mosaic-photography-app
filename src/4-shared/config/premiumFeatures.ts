/**
 * Premium Features Configuration
 *
 * Centralized place to manage which features require Pro subscription.
 * Toggle features between free and premium by changing the `enabled` flag.
 */

export interface PremiumFeatureConfig {
  enabled: boolean;
  feature: string;
  displayName: string;
  description: string;
}

/**
 * Premium Features Registry
 *
 * Set `enabled: false` to make a feature free
 * Set `enabled: true` to make a feature premium (Pro only)
 */
export const PREMIUM_FEATURES_CONFIG: Record<string, PremiumFeatureConfig> = {
  // Filter Features
  ADVANCED_SEARCH: {
    enabled: true, // 🔒 Premium
    feature: "advanced_search",
    displayName: "Keyword Search",
    description: "Search photos by keywords and descriptions",
  },

  PRINT_QUALITY_FILTER: {
    enabled: true, // 🔒 Premium
    feature: "print_quality_filter",
    displayName: "Print Quality Filter",
    description:
      "Filter by print quality levels (standard, good, excellent, professional)",
  },

  YEAR_RANGE_FILTER: {
    enabled: true, // 🔒 Premium
    feature: "year_range_filter",
    displayName: "Year Range Filter",
    description: "Filter photos by year range",
  },

  // Favorites Features
  FAVORITES_UNLIMITED: {
    enabled: true, // 🔒 Premium (unlimited favorites)
    feature: "favorites_unlimited",
    displayName: "Unlimited Favorites",
    description: "Save unlimited photos to favorites (free users limited to 5)",
  },

  // Gallery Features
  HIGH_RESOLUTION_DOWNLOADS: {
    enabled: true, // 🔒 Premium
    feature: "high_resolution_downloads",
    displayName: "High-Resolution Downloads",
    description: "Download photos in original high resolution",
  },

  ADVANCED_FILTERS: {
    enabled: false, // 🆓 Currently free (can be toggled to premium)
    feature: "advanced_filters",
    displayName: "Advanced Filters",
    description: "Access to all advanced filtering options",
  },

  // Content Features
  EXCLUSIVE_CONTENT: {
    enabled: true, // 🔒 Premium
    feature: "exclusive_content",
    displayName: "Exclusive Content",
    description: "Access to premium photographer collections",
  },

  // Experience Features
  AD_FREE_EXPERIENCE: {
    enabled: true, // 🔒 Premium
    feature: "ad_free_experience",
    displayName: "Ad-Free Experience",
    description: "Browse without advertisements",
  },
} as const;

/**
 * Helper Functions
 */

/**
 * Check if a feature is currently premium
 */
export const isFeaturePremium = (featureKey: string): boolean => {
  const config = PREMIUM_FEATURES_CONFIG[featureKey.toUpperCase()];
  return config?.enabled ?? false;
};

/**
 * Get all enabled premium features
 */
export const getEnabledPremiumFeatures = (): PremiumFeatureConfig[] => {
  return Object.values(PREMIUM_FEATURES_CONFIG).filter(
    (config) => config.enabled,
  );
};

/**
 * Get feature configuration by key
 */
export const getFeatureConfig = (
  featureKey: string,
): PremiumFeatureConfig | null => {
  return PREMIUM_FEATURES_CONFIG[featureKey.toUpperCase()] || null;
};

/**
 * Get feature display name
 */
export const getFeatureDisplayName = (featureKey: string): string => {
  const config = getFeatureConfig(featureKey);
  return config?.displayName || featureKey.replace(/_/g, " ");
};

// Export feature constants for easy access
export const PREMIUM_FEATURE_KEYS = Object.keys(
  PREMIUM_FEATURES_CONFIG,
) as (keyof typeof PREMIUM_FEATURES_CONFIG)[];
export type PremiumFeatureKey = keyof typeof PREMIUM_FEATURES_CONFIG;
