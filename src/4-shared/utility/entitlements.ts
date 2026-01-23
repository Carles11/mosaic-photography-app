import { getFeatureDisplayName } from "../config/premiumFeatures";
import { revenueCatService } from "../services/revenueCat";

/**
 * Entitlement identifiers
 */
export const ENTITLEMENTS = {
  MOSAIC_PRO: "mosaic Pro",
} as const;

/**
 * Product identifiers
 */
export const PRODUCTS = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
  LIFETIME: "lifetime",
} as const;

/**
 * Feature identifiers for subscription gating
 * Note: Now managed centrally in premiumFeatures.ts
 */
export const FEATURES = {
  UNLIMITED_DOWNLOADS: "unlimited_downloads",
  HIGH_RESOLUTION_IMAGES: "high_resolution_images",
  ADVANCED_FILTERS: "advanced_filters",
  ADVANCED_SEARCH: "advanced_search",
  PRINT_QUALITY_FILTER: "print_quality_filter",
  YEAR_RANGE_FILTER: "year_range_filter",
  PRIORITY_SUPPORT: "priority_support",
  AD_FREE_EXPERIENCE: "ad_free_experience",
  EXCLUSIVE_CONTENT: "exclusive_content",
  CLOUD_SYNC: "cloud_sync",
  COLLECTIONS_UNLIMITED: "collections_unlimited",
  FAVORITES_UNLIMITED: "favorites_unlimited",
} as const;

/**
 * Get feature display names from centralized config
 */
export const getFeatureTitle = (feature: string): string => {
  return getFeatureDisplayName(feature) || feature.replace(/_/g, " ");
};

/**
 * Entitlement utility functions
 */
export class EntitlementManager {
  /**
   * Check if user has Pro entitlement
   */
  static async hasProEntitlement(): Promise<boolean> {
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      return revenueCatService.hasProEntitlement(customerInfo);
    } catch (error) {
      console.error("Failed to check Pro entitlement:", error);
      return false;
    }
  }

  /**
   * Check if user can access a specific feature
   */
  static async canAccessFeature(feature: string): Promise<boolean> {
    try {
      const hasProAccess = await this.hasProEntitlement();

      // Define which features require Pro subscription
      const proFeatures = Object.values(FEATURES);

      if (proFeatures.includes(feature as any)) {
        return hasProAccess;
      }

      // Feature doesn't require subscription
      return true;
    } catch (error) {
      console.error("Failed to check feature access:", error);
      return false;
    }
  }

  /**
   * Get subscription type
   */
  static async getSubscriptionType(): Promise<string | null> {
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      return revenueCatService.getSubscriptionType(customerInfo);
    } catch (error) {
      console.error("Failed to get subscription type:", error);
      return null;
    }
  }

  /**
   * Check if subscription is active
   */
  static async hasActiveSubscription(): Promise<boolean> {
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      return revenueCatService.hasActiveSubscription(customerInfo);
    } catch (error) {
      console.error("Failed to check subscription status:", error);
      return false;
    }
  }

  /**
   * Get expiration date
   */
  static async getExpirationDate(): Promise<Date | null> {
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      return revenueCatService.getSubscriptionExpirationDate(customerInfo);
    } catch (error) {
      console.error("Failed to get expiration date:", error);
      return null;
    }
  }

  /**
   * Check if subscription is expiring soon (within 7 days)
   */
  static async isExpiringSoon(): Promise<boolean> {
    try {
      const expirationDate = await this.getExpirationDate();
      if (!expirationDate) return false;

      const now = new Date();
      const daysUntilExpiration = Math.ceil(
        (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
    } catch (error) {
      console.error("Failed to check expiration status:", error);
      return false;
    }
  }

  /**
   * Get days until expiration
   */
  static async getDaysUntilExpiration(): Promise<number | null> {
    try {
      const expirationDate = await this.getExpirationDate();
      if (!expirationDate) return null;

      const now = new Date();
      const daysUntilExpiration = Math.ceil(
        (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      return daysUntilExpiration;
    } catch (error) {
      console.error("Failed to get days until expiration:", error);
      return null;
    }
  }

  /**
   * Check trial status
   */
  static async isInTrial(): Promise<boolean> {
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      const proEntitlement =
        customerInfo?.entitlements.active[ENTITLEMENTS.MOSAIC_PRO];

      // A user is in trial if they have an active entitlement that won't renew
      return proEntitlement != null && proEntitlement.willRenew === false;
    } catch (error) {
      console.error("Failed to check trial status:", error);
      return false;
    }
  }

  /**
   * Get trial end date
   */
  static async getTrialEndDate(): Promise<Date | null> {
    try {
      const isInTrial = await this.isInTrial();
      if (!isInTrial) return null;

      return await this.getExpirationDate();
    } catch (error) {
      console.error("Failed to get trial end date:", error);
      return null;
    }
  }

  /**
   * Check if subscription has grace period (Android)
   */
  static async isInGracePeriod(): Promise<boolean> {
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      const proEntitlement =
        customerInfo?.entitlements.active[ENTITLEMENTS.MOSAIC_PRO];

      // Check if there's an active entitlement with billing issues
      return (
        proEntitlement != null && proEntitlement.billingIssueDetectedAt != null
      );
    } catch (error) {
      console.error("Failed to check grace period status:", error);
      return false;
    }
  }
}

/**
 * Feature access decorator for functions
 */
export function requiresSubscription(feature: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const hasAccess = await EntitlementManager.canAccessFeature(feature);
      if (!hasAccess) {
        throw new Error(`Feature ${feature} requires Pro subscription`);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Create a feature-gated version of a function
 */
export function createFeatureGatedFunction<T extends (...args: any[]) => any>(
  feature: string,
  fn: T,
  fallback?: () => ReturnType<T>,
): T {
  return (async (...args: any[]) => {
    const hasAccess = await EntitlementManager.canAccessFeature(feature);
    if (!hasAccess) {
      if (fallback) {
        return fallback();
      }
      throw new Error(`Feature ${feature} requires Pro subscription`);
    }
    return fn(...args);
  }) as T;
}

/**
 * Usage limits for free tier
 */
export const FREE_TIER_LIMITS = {
  MAX_DOWNLOADS_PER_DAY: 5,
  MAX_COLLECTIONS: 3,
  MAX_FAVORITES: 50,
} as const;

/**
 * Check if user has exceeded free tier limits
 */
export class FreeTierLimits {
  private static STORAGE_KEYS = {
    DAILY_DOWNLOADS: "daily_downloads",
    LAST_DOWNLOAD_RESET: "last_download_reset",
  };

  /**
   * Check if user can download (respects daily limit for free users)
   */
  static async canDownload(): Promise<boolean> {
    try {
      const hasProAccess = await EntitlementManager.hasProEntitlement();
      if (hasProAccess) return true;

      // Check daily download limit for free users
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem(
        this.STORAGE_KEYS.LAST_DOWNLOAD_RESET,
      );

      if (lastReset !== today) {
        // Reset daily counter
        localStorage.setItem(this.STORAGE_KEYS.DAILY_DOWNLOADS, "0");
        localStorage.setItem(this.STORAGE_KEYS.LAST_DOWNLOAD_RESET, today);
        return true;
      }

      const dailyDownloads = parseInt(
        localStorage.getItem(this.STORAGE_KEYS.DAILY_DOWNLOADS) || "0",
        10,
      );

      return dailyDownloads < FREE_TIER_LIMITS.MAX_DOWNLOADS_PER_DAY;
    } catch (error) {
      console.error("Failed to check download limit:", error);
      return false;
    }
  }

  /**
   * Increment download counter
   */
  static async incrementDownloadCount(): Promise<void> {
    try {
      const hasProAccess = await EntitlementManager.hasProEntitlement();
      if (hasProAccess) return; // No limits for Pro users

      const dailyDownloads = parseInt(
        localStorage.getItem(this.STORAGE_KEYS.DAILY_DOWNLOADS) || "0",
        10,
      );

      localStorage.setItem(
        this.STORAGE_KEYS.DAILY_DOWNLOADS,
        (dailyDownloads + 1).toString(),
      );
    } catch (error) {
      console.error("Failed to increment download count:", error);
    }
  }

  /**
   * Get remaining downloads for today
   */
  static async getRemainingDownloads(): Promise<number> {
    try {
      const hasProAccess = await EntitlementManager.hasProEntitlement();
      if (hasProAccess) return Infinity;

      const today = new Date().toDateString();
      const lastReset = localStorage.getItem(
        this.STORAGE_KEYS.LAST_DOWNLOAD_RESET,
      );

      if (lastReset !== today) {
        return FREE_TIER_LIMITS.MAX_DOWNLOADS_PER_DAY;
      }

      const dailyDownloads = parseInt(
        localStorage.getItem(this.STORAGE_KEYS.DAILY_DOWNLOADS) || "0",
        10,
      );

      return Math.max(
        0,
        FREE_TIER_LIMITS.MAX_DOWNLOADS_PER_DAY - dailyDownloads,
      );
    } catch (error) {
      console.error("Failed to get remaining downloads:", error);
      return 0;
    }
  }
}
