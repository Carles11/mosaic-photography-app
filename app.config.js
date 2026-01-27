// app.config.js
const fs = require("fs");
const dotenv = require("dotenv");

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
}

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      // preserve any existing extras from app.json/app.config
      ...(config.extra || {}),
      // bring SENTRY_DSN into expo.extra for runtime access
      SENTRY_DSN: process.env.SENTRY_DSN || "",
      // You can add other env vars you want here:
      // EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    },
  };
};
