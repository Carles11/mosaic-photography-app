// Safe, minimal QA/event logger for Supabase
// Place at: src/lib/qaLogger.ts
//
// Usage:
//  - This file re-uses your app's existing exported `supabase` client:
//      import { supabase } from "@/4-shared/api/supabaseClient";
//  - Example call:
//      await logEvent('agegate_confirmed', { userType: 'reviewer', appVersion: 'v1.0', deviceOs: 'iOS' });

import { supabase } from "@/4-shared/api/supabaseClient"; // <- reuse your app client
import { Platform } from "react-native";

let supabaseClient: any = null;

// Use the imported client if available
if (supabase) {
  supabaseClient = supabase;
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

    // Debug log so we can see exactly what is being sent to Supabase
    // (temporary — remove when you confirm it works)

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
