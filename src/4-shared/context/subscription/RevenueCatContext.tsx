import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CustomerInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

import { revenueCatService } from "../../services/revenueCat";

/**
 * Helper function to get user-friendly error messages
 */
function getErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred";

  // Check for RevenueCat error codes
  if (error.code) {
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

  return error.message || "An unexpected error occurred";
}

/**
 * RevenueCat Context State Interface
 */
interface RevenueCatContextState {
  // Loading states
  isInitializing: boolean;
  isLoading: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;

  // Customer and subscription data
  customerInfo: CustomerInfo | undefined;
  offerings: PurchasesOfferings | null;
  currentOffering: PurchasesOffering | null;

  // Subscription status
  hasProSubscription: boolean;
  hasActiveSubscription: boolean;
  subscriptionType: string | null;
  subscriptionExpirationDate: Date | null;

  // Error state
  error: string | null;

  // Actions
  refreshCustomerInfo: () => Promise<void>;
  refreshOfferings: () => Promise<void>;
  purchasePackage: (purchasePackage: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  clearError: () => void;
}

/**
 * Default context state
 */
const defaultState: RevenueCatContextState = {
  isInitializing: true,
  isLoading: false,
  isPurchasing: false,
  isRestoring: false,
  customerInfo: undefined,
  offerings: null,
  currentOffering: null,
  hasProSubscription: false,
  hasActiveSubscription: false,
  subscriptionType: null,
  subscriptionExpirationDate: null,
  error: null,
  refreshCustomerInfo: async () => {},
  refreshOfferings: async () => {},
  purchasePackage: async () => false,
  restorePurchases: async () => false,
  clearError: () => {},
};

/**
 * RevenueCat Context
 */
const RevenueCatContext = createContext<RevenueCatContextState>(defaultState);

/**
 * RevenueCat Provider Props
 */
interface RevenueCatProviderProps {
  children: ReactNode;
}

/**
 * RevenueCat Context Provider
 * Manages subscription state and provides actions for the entire app
 */
export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({
  children,
}) => {
  // State
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | undefined>(
    undefined,
  );
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const hasProSubscription = revenueCatService.hasProEntitlement(customerInfo);
  const hasActiveSubscription =
    revenueCatService.hasActiveSubscription(customerInfo);
  const subscriptionType = revenueCatService.getSubscriptionType(customerInfo);
  const subscriptionExpirationDate =
    revenueCatService.getSubscriptionExpirationDate(customerInfo);
  const currentOffering = offerings?.current || null;

  /**
   * Initialize RevenueCat and load initial data
   */
  const initialize = useCallback(async () => {
    try {
      setIsInitializing(true);
      setError(null);

      // Initialize RevenueCat
      await revenueCatService.initialize();

      // Load initial data
      await Promise.all([
        refreshCustomerInfoInternal(),
        refreshOfferingsInternal(),
      ]);

      console.log("RevenueCat provider initialized successfully");
    } catch (err) {
      console.error("Failed to initialize RevenueCat provider:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsInitializing(false);
    }
  }, []);

  /**
   * Internal customer info refresh
   */
  const refreshCustomerInfoInternal = useCallback(async () => {
    try {
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err) {
      console.error("Failed to refresh customer info:", err);
      throw err;
    }
  }, []);

  /**
   * Internal offerings refresh
   */
  const refreshOfferingsInternal = useCallback(async () => {
    try {
      const offeringsData = await revenueCatService.getOfferings();
      setOfferings(offeringsData);
    } catch (err) {
      console.error("Failed to refresh offerings:", err);
      throw err;
    }
  }, []);

  /**
   * Public customer info refresh
   */
  const refreshCustomerInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await refreshCustomerInfoInternal();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfoInternal]);

  /**
   * Public offerings refresh
   */
  const refreshOfferings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await refreshOfferingsInternal();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshOfferingsInternal]);

  /**
   * Purchase a package
   */
  const purchasePackage = useCallback(
    async (purchasePackage: PurchasesPackage): Promise<boolean> => {
      try {
        setIsPurchasing(true);
        setError(null);

        const result = await revenueCatService.purchasePackage(purchasePackage);
        setCustomerInfo(result.customerInfo);

        return revenueCatService.hasProEntitlement(result.customerInfo);
      } catch (err) {
        console.error("Purchase failed:", err);

        // Don't show error for user cancellation
        if (!(err && (err as any).code === "USER_CANCELLED")) {
          setError(getErrorMessage(err));
        }

        return false;
      } finally {
        setIsPurchasing(false);
      }
    },
    [],
  );

  /**
   * Restore purchases
   */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setIsRestoring(true);
      setError(null);

      const restoredCustomerInfo = await revenueCatService.restorePurchases();
      setCustomerInfo(restoredCustomerInfo);

      return revenueCatService.hasProEntitlement(restoredCustomerInfo);
    } catch (err) {
      console.error("Restore failed:", err);
      setError(getErrorMessage(err));
      return false;
    } finally {
      setIsRestoring(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Context value
   */
  const contextValue: RevenueCatContextState = {
    isInitializing,
    isLoading,
    isPurchasing,
    isRestoring,
    customerInfo,
    offerings,
    currentOffering,
    hasProSubscription,
    hasActiveSubscription,
    subscriptionType,
    subscriptionExpirationDate,
    error,
    refreshCustomerInfo,
    refreshOfferings,
    purchasePackage,
    restorePurchases,
    clearError,
  };

  return (
    <RevenueCatContext.Provider value={contextValue}>
      {children}
    </RevenueCatContext.Provider>
  );
};

/**
 * Hook to use RevenueCat context
 */
export const useRevenueCat = (): RevenueCatContextState => {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error("useRevenueCat must be used within a RevenueCatProvider");
  }
  return context;
};

/**
 * Hook to check if user has Pro subscription
 */
export const useHasProSubscription = (): boolean => {
  const { hasProSubscription } = useRevenueCat();
  return hasProSubscription;
};

/**
 * Hook to get subscription info
 */
export const useSubscriptionInfo = () => {
  const {
    hasProSubscription,
    hasActiveSubscription,
    subscriptionType,
    subscriptionExpirationDate,
    customerInfo,
  } = useRevenueCat();

  return {
    hasProSubscription,
    hasActiveSubscription,
    subscriptionType,
    subscriptionExpirationDate,
    isTrialing:
      customerInfo?.entitlements.active["mosaic Pro"]?.willRenew === false,
    originalPurchaseDate: customerInfo?.originalPurchaseDate
      ? new Date(customerInfo.originalPurchaseDate)
      : null,
  };
};
