# RevenueCat Integration Guide

This guide covers the complete RevenueCat integration for the Mosaic Photography App, including subscription management, feature gating, and customer support.

## Overview

The integration provides:

- ✅ RevenueCat SDK initialization and configuration
- ✅ Subscription state management with React Context
- ✅ Beautiful custom Paywall UI
- ✅ RevenueCat native Paywall UI support
- ✅ Customer Center for subscription management
- ✅ Feature gating and entitlement checking
- ✅ Free tier limits and usage tracking
- ✅ Error handling and analytics
- ✅ TypeScript support throughout

## Quick Start

### 1. Import and Setup

The RevenueCat provider is already added to your app layout. All subscription functionality is available throughout your app.

```tsx
import {
  useSubscription,
  SubscriptionGate,
  Paywall,
  CustomerCenter,
} from "@/4-shared/subscription";
```

### 2. Basic Subscription Check

```tsx
import { useHasProSubscription } from "@/4-shared/subscription";

function MyComponent() {
  const hasProAccess = useHasProSubscription();

  return (
    <View>
      {hasProAccess ? (
        <Text>Welcome, Pro user! 🎉</Text>
      ) : (
        <Text>Upgrade to Pro for premium features</Text>
      )}
    </View>
  );
}
```

### 3. Feature Gating

```tsx
import { SubscriptionGate } from "@/4-shared/subscription";

function AdvancedFilters() {
  return (
    <SubscriptionGate feature="advanced_filters">
      {/* This content only shows for Pro users */}
      <FilterControls />
    </SubscriptionGate>
  );
}
```

## Core Components

### 1. useSubscription Hook

The main hook providing all subscription functionality:

```tsx
const {
  // State
  hasProSubscription,
  hasActiveSubscription,
  subscriptionType, // 'monthly' | 'yearly' | 'lifetime'
  subscriptionStatus,
  isLoading,
  isPurchasing,

  // Packages
  availablePackages,
  monthlyPackage,
  yearlyPackage,
  lifetimePackage,

  // Actions
  purchaseSubscription,
  restoreSubscriptions,
  canAccessFeature,
  showUpgradePrompt,
} = useSubscription();
```

### 2. Paywall Component

Beautiful custom paywall with your branding:

```tsx
import { Paywall } from "@/4-shared/subscription";

function MyScreen() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <>
      <Button onPress={() => setShowPaywall(true)}>Upgrade to Pro</Button>

      <Modal visible={showPaywall}>
        <Paywall
          onDismiss={() => setShowPaywall(false)}
          onPurchaseSuccess={() => {
            setShowPaywall(false);
            // Handle success
          }}
          presentedFrom="settings_screen"
          feature="unlimited_downloads"
        />
      </Modal>
    </>
  );
}
```

### 3. RevenueCat Native Paywall

Use RevenueCat's native paywall UI:

```tsx
import { RevenueCatPaywall } from "@/4-shared/subscription";

<Modal visible={showPaywall}>
  <RevenueCatPaywall
    onDismiss={() => setShowPaywall(false)}
    onPurchaseSuccess={handlePurchaseSuccess}
    presentedFrom="download_button"
  />
</Modal>;
```

### 4. Customer Center

Let users manage their subscriptions:

```tsx
import { CustomerCenter } from "@/4-shared/subscription";

<Modal visible={showCustomerCenter}>
  <CustomerCenter onDismiss={() => setShowCustomerCenter(false)} />
</Modal>;
```

## Feature Gating Strategies

### 1. Component Level Gating

```tsx
import { SubscriptionGate, SimpleSubscriptionGate } from '@/4-shared/subscription';

// Full gate with upgrade prompt
<SubscriptionGate feature="high_resolution_images">
  <HDImageViewer />
</SubscriptionGate>

// Simple show/hide
<SimpleSubscriptionGate feature="exclusive_content">
  <ExclusivePhotos />
</SimpleSubscriptionGate>
```

### 2. Conditional Rendering

```tsx
const { canAccessFeature } = useSubscription();

return (
  <View>
    {canAccessFeature("unlimited_downloads") ? (
      <DownloadButton onPress={handleDownload} />
    ) : (
      <UpgradePrompt feature="unlimited_downloads" />
    )}
  </View>
);
```

### 3. Function Level Gating

```tsx
import { EntitlementManager } from "@/4-shared/subscription";

async function downloadImage(imageId: string) {
  const canDownload = await EntitlementManager.canAccessFeature(
    "unlimited_downloads",
  );

  if (!canDownload) {
    throw new Error("Upgrade to Pro for unlimited downloads");
  }

  // Proceed with download
  return performDownload(imageId);
}
```

## Available Features

Configure these feature gates throughout your app:

```tsx
const FEATURES = {
  UNLIMITED_DOWNLOADS: "unlimited_downloads",
  HIGH_RESOLUTION_IMAGES: "high_resolution_images",
  ADVANCED_FILTERS: "advanced_filters",
  PRIORITY_SUPPORT: "priority_support",
  AD_FREE_EXPERIENCE: "ad_free_experience",
  EXCLUSIVE_CONTENT: "exclusive_content",
  CLOUD_SYNC: "cloud_sync",
  COLLECTIONS_UNLIMITED: "collections_unlimited",
  FAVORITES_UNLIMITED: "favorites_unlimited",
};
```

## Free Tier Limits

Enforce usage limits for free users:

```tsx
import { FreeTierLimits } from "@/4-shared/subscription";

// Check if user can download
const canDownload = await FreeTierLimits.canDownload();
const remainingDownloads = await FreeTierLimits.getRemainingDownloads();

if (!canDownload) {
  showUpgradePrompt("unlimited_downloads");
  return;
}

// Increment counter after successful download
await FreeTierLimits.incrementDownloadCount();
```

## User Management

### Setting User ID on Login

```tsx
import { revenueCatService } from "@/4-shared/subscription";

// When user logs in
await revenueCatService.setUserID(user.id);

// When user logs out
await revenueCatService.clearUserID();
```

### Customer Info Access

```tsx
const { customerInfo, subscriptionExpirationDate, formattedExpirationDate } =
  useSubscription();

// Check trial status
const isInTrial =
  customerInfo?.entitlements.active["mosaic Pro"]?.willRenew === false;
```

## Error Handling

```tsx
const { error, handleError, clearError } = useSubscription();

// Handle purchase errors
useEffect(() => {
  if (error) {
    handleError(error);
  }
}, [error, handleError]);

// Check error types
if (revenueCatService.isUserCancelledError(error)) {
  // User cancelled - don't show error
  return;
}

if (revenueCatService.isNetworkError(error)) {
  // Show network error message
  showNetworkError();
}
```

## Analytics Integration

All subscription events are automatically logged:

- `revenuecat_initialized`
- `paywall_presented`
- `subscription_purchase_attempt`
- `subscription_purchase_success`
- `subscription_purchase_failed`
- `purchases_restored`
- `customer_center_presented`
- `upgrade_prompt_tapped`

## Best Practices

### 1. Graceful Degradation

Always provide a good experience for free users:

```tsx
<SubscriptionGate feature="advanced_filters" fallback={<BasicFilters />}>
  <AdvancedFilters />
</SubscriptionGate>
```

### 2. Contextual Upgrades

Show relevant upgrade prompts:

```tsx
<ProtectedDownloadButton
  onDownload={handleDownload}
  imageId={image.id}
  // Automatically shows paywall for free users
/>
```

### 3. Clear Value Proposition

Always explain what users get with Pro:

```tsx
<SubscriptionGate
  feature="exclusive_content"
  customMessage="Access exclusive photographer collections and premium content with Mosaic Pro"
>
  <ExclusiveGallery />
</SubscriptionGate>
```

## Testing

### Test in Development

1. Use test API key (already configured in .env)
2. Test purchases won't charge real money
3. Use sandbox accounts for testing

### Verify Integration

```tsx
// Check if RevenueCat is properly initialized
const { isInitializing, error } = useRevenueCat();

if (error) {
  console.error("RevenueCat initialization failed:", error);
}
```

## Configuration

### Environment Variables

```env
REVENUECAT_PUBLIC_API_KEY=test_NDLnUwdJstbkJpzIhigIRQbrnjG
```

### Product IDs

Configure these in RevenueCat dashboard:

- Monthly: `monthly`
- Yearly: `yearly`
- Lifetime: `lifetime`

### Entitlement

- Name: `mosaic Pro`
- Products: All subscription products

## Support

### Customer Support Flow

```tsx
const handleContactSupport = () => {
  const subject = "Mosaic App - Support Request";
  const body = `
    User ID: ${customerInfo?.originalAppUserId}
    Subscription: ${subscriptionType || "None"}
    
    Describe your issue:
  `;

  Linking.openURL(
    `mailto:support@mosaicapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );
};
```

### Subscription Management

Users can manage subscriptions through:

1. Customer Center component
2. Platform-specific subscription management (App Store/Play Store)
3. RevenueCat dashboard (for support)

## Troubleshooting

### Common Issues

1. **No offerings available**: Check internet connection and RevenueCat configuration
2. **Purchase not working**: Verify test account setup and sandbox mode
3. **Entitlements not updating**: Call `refreshCustomerInfo()` after purchase

### Debug Mode

Development builds automatically enable debug logging. Check console for RevenueCat logs.

---

Your RevenueCat integration is now complete! The system provides comprehensive subscription management with beautiful UI components, robust error handling, and detailed analytics.
