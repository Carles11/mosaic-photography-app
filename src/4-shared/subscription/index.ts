// Services
export { revenueCatService } from "@/4-shared/services/revenueCat";

// Context and Hooks
export {
  RevenueCatProvider,
  useHasProSubscription,
  useRevenueCat,
  useSubscriptionInfo,
} from "@/4-shared/context/subscription/RevenueCatContext";
export { useSubscription } from "@/4-shared/hooks/useSubscription";

// Components
export { CustomerCenter } from "@/4-shared/components/subscription/CustomerCenter";
export { Paywall } from "@/4-shared/components/subscription/Paywall";
export {
  RevenueCatFooterPaywall,
  RevenueCatPaywall,
} from "@/4-shared/components/subscription/RevenueCatPaywall";
export {
  AdvancedFiltersSection,
  ProfileSubscriptionSection,
  ProtectedDownloadButton,
} from "@/4-shared/components/subscription/SubscriptionExamples";
export {
  SimpleSubscriptionGate,
  SubscriptionBadge,
  SubscriptionGate,
  SubtleSubscriptionGate,
} from "@/4-shared/components/subscription/SubscriptionGate";

// Utilities
export {
  createFeatureGatedFunction,
  EntitlementManager,
  ENTITLEMENTS,
  FEATURES,
  FREE_TIER_LIMITS,
  FreeTierLimits,
  PRODUCTS,
  requiresSubscription,
} from "@/4-shared/utility/entitlements";

// Types
export type { SubscriptionPackageInfo } from "@/4-shared/hooks/useSubscription";
