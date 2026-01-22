import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesStoreTransaction,
} from "react-native-purchases";

import { logEvent } from "@/4-shared/firebase";

/**
 * RevenueCat Service - Centralized service for managing subscriptions and purchases
 * This service handles initialization, configuration, and core subscription functionality
 */
class RevenueCatService {
  private isInitialized = false;
  private readonly API_KEY = process.env.REVENUECAT_PUBLIC_API_KEY || "";

  /**
   * Initialize RevenueCat with configuration
   * Call this early in your app lifecycle
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log("RevenueCat already initialized");
      return;
    }

    if (!this.API_KEY) {
      console.error(
        "RevenueCat API key not found. Please set REVENUECAT_PUBLIC_API_KEY in your .env file",
      );
      return;
    }

    try {
      // Configure SDK
      Purchases.configure({
        apiKey: this.API_KEY,
        appUserID: null, // Use anonymous user ID initially, can be set later with login
        userDefaultsSuiteName: undefined, // iOS only
      });

      // Set debug logs in development
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Set up listeners
      this.setupListeners();

      this.isInitialized = true;
      console.log("RevenueCat initialized successfully");

      // Log initialization event
      await logEvent("revenuecat_initialized", {});
    } catch (error) {
      console.error("Failed to initialize RevenueCat:", error);
      throw error;
    }
  }

  /**
   * Set up RevenueCat listeners for purchase updates
   */
  private setupListeners(): void {
    // Listen to customer info updates
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log("Customer info updated:", customerInfo);
      this.handleCustomerInfoUpdate(customerInfo);
    });
  }

  /**
   * Handle customer info updates
   */
  private async handleCustomerInfoUpdate(
    customerInfo: CustomerInfo,
  ): Promise<void> {
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);

    // Log analytics event
    await logEvent("customer_info_updated", {
      active_entitlements: activeEntitlements,
      has_pro_subscription: this.hasProEntitlement(customerInfo),
    });
  }

  /**
   * Get current customer info
   */
  public async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error("Failed to get customer info:", error);
      throw error;
    }
  }

  /**
   * Get available offerings
   */
  public async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
      return await Purchases.getOfferings();
    } catch (error) {
      console.error("Failed to get offerings:", error);
      throw error;
    }
  }

  /**
   * Purchase a package
   */
  public async purchasePackage(purchasePackage: PurchasesPackage): Promise<{
    customerInfo: CustomerInfo;
    transaction?: PurchasesStoreTransaction;
  }> {
    try {
      console.log("Starting purchase for package:", purchasePackage.identifier);

      // Log purchase attempt
      await logEvent("subscription_purchase_attempt", {
        package_id: purchasePackage.identifier,
        product_id: purchasePackage.product.identifier,
        price: purchasePackage.product.price,
        currency: purchasePackage.product.currencyCode,
      });

      const result = await Purchases.purchasePackage(purchasePackage);

      // Log successful purchase
      await logEvent("subscription_purchase_success", {
        package_id: purchasePackage.identifier,
        product_id: purchasePackage.product.identifier,
        price: purchasePackage.product.price,
        currency: purchasePackage.product.currencyCode,
        transaction_id: result.transaction?.transactionIdentifier,
      });

      console.log("Purchase successful:", result);
      return result;
    } catch (error) {
      console.error("Purchase failed:", error);

      // Log failed purchase
      await logEvent("subscription_purchase_failed", {
        package_id: purchasePackage.identifier,
        product_id: purchasePackage.product.identifier,
        error_message: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }

  /**
   * Restore purchases
   */
  public async restorePurchases(): Promise<CustomerInfo> {
    try {
      console.log("Restoring purchases...");
      const customerInfo = await Purchases.restorePurchases();

      await logEvent("purchases_restored", {
        active_entitlements: Object.keys(customerInfo.entitlements.active),
      });

      console.log("Purchases restored successfully");
      return customerInfo;
    } catch (error) {
      console.error("Failed to restore purchases:", error);
      throw error;
    }
  }

  /**
   * Check if user has Pro entitlement
   */
  public hasProEntitlement(customerInfo?: CustomerInfo): boolean {
    if (!customerInfo) return false;
    return customerInfo.entitlements.active["mosaic Pro"] != null;
  }

  /**
   * Check if user has any active subscription
   */
  public hasActiveSubscription(customerInfo?: CustomerInfo): boolean {
    if (!customerInfo) return false;
    return Object.keys(customerInfo.entitlements.active).length > 0;
  }

  /**
   * Get subscription type (monthly, yearly, lifetime)
   */
  public getSubscriptionType(customerInfo?: CustomerInfo): string | null {
    if (!customerInfo || !this.hasProEntitlement(customerInfo)) return null;

    const proEntitlement = customerInfo.entitlements.active["mosaic Pro"];
    if (!proEntitlement) return null;

    const productIdentifier = proEntitlement.productIdentifier;

    if (productIdentifier.includes("monthly")) return "monthly";
    if (productIdentifier.includes("yearly")) return "yearly";
    if (productIdentifier.includes("lifetime")) return "lifetime";

    return "unknown";
  }

  /**
   * Get subscription expiration date
   */
  public getSubscriptionExpirationDate(
    customerInfo?: CustomerInfo,
  ): Date | null {
    if (!customerInfo || !this.hasProEntitlement(customerInfo)) return null;

    const proEntitlement = customerInfo.entitlements.active["mosaic Pro"];
    return proEntitlement?.expirationDate
      ? new Date(proEntitlement.expirationDate)
      : null;
  }

  /**
   * Set user ID for RevenueCat
   * Call this when user logs in
   */
  public async setUserID(userID: string): Promise<void> {
    try {
      await Purchases.logIn(userID);
      console.log("RevenueCat user ID set:", userID);

      await logEvent("revenuecat_user_logged_in", {
        user_id: userID,
      });
    } catch (error) {
      console.error("Failed to set RevenueCat user ID:", error);
      throw error;
    }
  }

  /**
   * Clear user ID (logout)
   */
  public async clearUserID(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log("RevenueCat user logged out");

      await logEvent("revenuecat_user_logged_out", {});
    } catch (error) {
      console.error("Failed to clear RevenueCat user ID:", error);
      throw error;
    }
  }

  /**
   * Check if error is user cancelled
   */
  public static isUserCancelledError(error: any): boolean {
    return error && error.code === "USER_CANCELLED";
  }

  /**
   * Check if error is network error
   */
  public static isNetworkError(error: any): boolean {
    return (
      error &&
      error.code &&
      (error.code === "NETWORK_ERROR" || error.code === "API_ENDPOINT_BLOCKED")
    );
  }

  /**
   * Get user-friendly error message
   */
  public static getErrorMessage(error: any): string {
    if (!error || !error.code) {
      return "An unexpected error occurred";
    }

    switch (error.code) {
      case "USER_CANCELLED":
        return "Purchase was cancelled";
      case "NETWORK_ERROR":
        return "Network error. Please check your connection";
      case "API_ENDPOINT_BLOCKED":
        return "Unable to connect to subscription service";
      case "PRODUCT_NOT_AVAILABLE_FOR_PURCHASE":
        return "This product is not available for purchase";
      case "PAYMENT_PENDING":
        return "Payment is pending approval";
      case "INVALID_RECEIPT":
        return "Invalid receipt";
      case "MISSING_RECEIPT_FILE":
        return "Receipt file missing";
      case "PURCHASE_NOT_ALLOWED":
        return "Purchase not allowed";
      case "PURCHASE_INVALID":
        return "Invalid purchase";
      default:
        return error.message || "An error occurred with your purchase";
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
