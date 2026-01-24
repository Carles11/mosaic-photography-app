// Safe, minimal QA/event logger for Supabase
// Place at: src/lib/qaLogger.ts
//
// Usage:
//  - If your project already exports a `supabase` client, this file will try to import it.
//  - Otherwise it will create a client using environment variables:
//      SUPABASE_URL and SUPABASE_ANON_KEY (or EXPO constants if you use them).
//
// Example call:
//   await logEvent('agegate_confirmed', { userType: 'reviewer', appVersion: 'v1.0', deviceOs: 'iOS' });

import { Platform } from "react-native";

let supabaseClient: any = null;

try {
  // Try to use an existing exported client if your app already has one
  // Adjust the import path if your supabase client is located elsewhere
  // e.g. import { supabase } from '../supabaseClient';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const existing = require("../supabase").supabase;
  if (existing) supabaseClient = existing;
} catch (err) {
  // ignore if no existing client
}

if (!supabaseClient) {
  // fallback: create a client using env vars (ensure these are available to the app)
  // If you use expo constants or a config file, adjust accordingly.
  // NOTE: This fallback uses the anon key; the table has RLS allowing authenticated inserts.
  // Make sure your reviewer signs in before calling the logger.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require("@supabase/supabase-js");
  const SUPABASE_URL =
    process.env.SUPABASE_URL || (global as any).__SUPABASE_URL__;
  const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY || (global as any).__SUPABASE_ANON_KEY__;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Console warning for developers — the function will still be safe (no-op)
    // but will not write logs until vars are provided.
    // In expo you can pass these via app config or use an existing client import above.
    // eslint-disable-next-line no-console
    console.warn(
      "[qaLogger] Supabase config missing. Set SUPABASE_URL and SUPABASE_ANON_KEY.",
    );
  } else {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
}

type LogOpts = {
  userType?: string;
  imageFilename?: string | null;
  appVersion?: string | null;
  deviceOs?: string | null;
  metadata?: Record<string, unknown>;
  source?: string | null;
};

export async function logEvent(
  eventName: string,
  opts: LogOpts = {},
): Promise<boolean> {
  if (!supabaseClient) {
    // No client available — fail gracefully.
    // eslint-disable-next-line no-console
    console.warn(
      "[qaLogger] supabase client not initialized; skipping log:",
      eventName,
      opts,
    );
    return false;
  }

  try {
    const payload = {
      event_name: eventName,
      user_type: opts.userType ?? "anonymous",
      image_cdn_filename: opts.imageFilename ?? null,
      app_version: opts.appVersion ?? null,
      device_os: opts.deviceOs ?? Platform.OS ?? null,
      metadata: opts.metadata ?? {},
      source: opts.source ?? "client",
    };

    const { error } = await supabaseClient.from("qa_logs").insert([payload]);

    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[qaLogger] insert error", error);
      return false;
    }

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[qaLogger] unexpected error", err);
    return false;
  }
}

export default logEvent;
