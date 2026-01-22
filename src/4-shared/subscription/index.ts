// Services
export { revenueCatService } from "../services/revenueCat";

// Context and Hooks
export {
  RevenueCatProvider,
  useHasProSubscription,
  useRevenueCat,
  useSubscriptionInfo,
} from "../context/subscription/RevenueCatContext";
export { useSubscription } from "../hooks/useSubscription";

// Components
export { CustomerCenter } from "../components/subscription/CustomerCenter";
export { Paywall } from "../components/subscription/Paywall";
export {
  RevenueCatFooterPaywall,
  RevenueCatPaywall,
} from "../components/subscription/RevenueCatPaywall";
export {
  AdvancedFiltersSection,
  ProfileSubscriptionSection,
  ProtectedDownloadButton,
} from "../components/subscription/SubscriptionExamples";
export {
  SimpleSubscriptionGate,
  SubscriptionBadge,
  SubscriptionGate,
} from "../components/subscription/SubscriptionGate";

// Utilities
export {
  ENTITLEMENTS,
  EntitlementManager,
  FEATURES,
  FREE_TIER_LIMITS,
  FreeTierLimits,
  PRODUCTS,
  createFeatureGatedFunction,
  requiresSubscription,
} from "../utility/entitlements";

// Types
export type { SubscriptionPackageInfo } from "../hooks/useSubscription";
