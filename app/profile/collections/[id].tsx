/**
 * Purpose: This route file enables universal deep linking for the web-app URL pattern `/profile/collections/:id`.
 * By exporting your CollectionDetailScreen, you ensure that tapping a shared link like
 * `https://www.mosaic.photography/profile/collections/<collection-id>`
 * will open the correct collection detail view in the mobile app, using Expo Router.
 *
 * This allows both mobile and web users to share the same collection URLs and have them open natively in-app when possible.
 */
import CollectionDetailScreen from "@/1-pages/collections/collection-detail/ui/CollectionDetail";
export default CollectionDetailScreen;
