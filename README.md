# Mosaic Photography App

Mosaic is a curated mobile gallery for public-domain vintage photography. It lets users browse historical images, filter by metadata, view photographer biographies, save favorites, organize collections, comment, report content, and download optimized image files.

The app is built with Expo, React Native, Expo Router, Supabase, Firebase Analytics, and Sentry.

## Features

- Curated vintage photography gallery
- Photographer profile pages with biographies, timelines, links, and galleries
- Responsive image sizing backed by CDN/S3 resize folders
- Daily seeded gallery ordering while preserving featured first-block images
- Filters for search text, photographer, gender, orientation, color, print quality, year, and nudity visibility
- Age-gated historical/artistic nudity mode, hidden by default
- Favorites and user-created collections
- Comments with optimistic create, update, and delete flows
- Image zoom carousel with download options
- Image and comment reporting
- Profile editing, theme selection, logout, and account deletion
- Firebase Analytics, Sentry monitoring, and EAS OTA updates

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router
- Expo Native Tabs
- Supabase Auth and Database
- Supabase Edge Functions
- Firebase Analytics
- Sentry React Native
- Gorhom Bottom Sheet
- Expo EAS Build and Update

## Project Structure

```text
app/                       Expo Router routes and navigation shells
src/1-pages/               Screen-level page composition
src/2-features/            Feature UI and feature-specific API logic
src/3-entities/            Domain entities and models
src/4-shared/              Shared APIs, components, hooks, contexts, theme, types, utilities
supabase/functions/        Supabase Edge Functions
android/                   Generated native Android project
ios/                       Generated native iOS project
```

The app follows a feature-sliced layout. Route files in `app/` should stay thin and delegate real screen behavior to `src/1-pages` and `src/2-features`.

## Requirements

- Node.js
- npm
- Expo CLI / EAS CLI
- Android Studio or Xcode for native builds
- A Supabase project
- Firebase app configuration files for analytics
- Sentry project credentials for release monitoring

## Environment Variables

Create local environment files as needed. Do not commit secrets.

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

The Supabase `delete-user` edge function also requires:

```bash
SERVICE_ROLE_KEY=
EXPO_PUBLIC_SUPABASE_URL=
```

## Installation

```bash
npm install
```

## Development

Start the Expo development server:

```bash
npm run start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run the web target:

```bash
npm run web
```

## Quality Checks

Type-check the project:

```bash
npx tsc --noEmit
```

Run lint:

```bash
npm run lint
```

## App Configuration

Primary app configuration lives in `app.config.js`.

Important settings include:

- App name: `Iconic Photography by Mosaic`
- Slug: `mosaic-photography-app`
- Scheme: `mosaicphotographyapp`
- iOS bundle identifier: `com.carlosdelrio.mosaicphotographyapp`
- Android package: `com.carlos_delrio.mosaicphotographyapp`
- EAS project ID: `2989e5c6-09a8-4746-ba94-44b2ec60b552`
- OTA runtime version policy: `appVersion`

## Data Model Notes

The app reads gallery data from Supabase tables and views such as:

- `images_resize`
- `photographers`
- `photographers_with_portrait`
- `favorites`
- `collections`
- `collection_favorites`
- `comments`
- `reports`
- `user_profiles`

Images are expected to expose `base_url`, `filename`, and dimensions. Shared helpers select the best CDN folder for the current display size, such as `w400`, `w600`, `w1200`, `originalsWEBP`, and `originals`.

## Authentication

Supabase Auth powers email/password login, magic links, password reset, email verification, persistent sessions, and account deletion.

The client stores Supabase sessions with AsyncStorage. Account deletion is handled through the Supabase Edge Function at:

```text
supabase/functions/delete-user
```

## Filters And Age Gate

Nudity is hidden by default with `nudity: "not-nude"`.

Users can choose:

- `not-nude`: hide nude images
- `nude`: show only nude images
- `all`: include nude and non-nude images

Selecting `nude` or `all` requires an 18+ confirmation. Logged-in users store consent in `user_profiles.filters`; anonymous users use local device storage when available.

## Builds

EAS build profiles are configured in `eas.json`.

Development build:

```bash
eas build --profile development
```

Internal APK:

```bash
eas build --profile internal --platform android
```

Production build:

```bash
eas build --profile production
```

Production submit:

```bash
eas submit --profile production
```

## OTA Updates

If a change only affects JavaScript or TypeScript and does not require native code changes, publish an OTA update:

```bash
eas update --channel production --message "Brief description of the change"
```

Native dependency changes, config plugin changes, app icon/splash changes, native permissions, and generated native project changes require a new store build.

## Release Checklist

1. Update `version` in `package.json` and `app.config.js`.
2. Run `npx tsc --noEmit`.
3. Run `npm run lint`.
4. Test login, filters, age gate, downloads, favorites, collections, comments, reports, and profile flows.
5. Confirm Sentry and Firebase configuration.
6. Build with EAS.
7. Submit or publish OTA depending on the change type.

## Troubleshooting

If Supabase calls fail, confirm `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are available in the Expo environment.

If Firebase Analytics is unavailable in development, the shared analytics wrapper falls back to a no-op logger.

If image downloads fail, confirm media-library permission is granted and the selected CDN URL exists.

If profile deletion fails, confirm the Supabase Edge Function is deployed and `SERVICE_ROLE_KEY` is configured in the function environment.

## Repository Notes

Generated native folders and build artifacts should be kept out of source control unless intentionally regenerated for a native release.

Local secrets and service account files should never be committed.
