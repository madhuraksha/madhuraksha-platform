import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const isValidUrl = Boolean(rawUrl && rawUrl.startsWith("https://") && !rawUrl.includes("REPLACE_WITH"));

const supabaseUrl = isValidUrl ? rawUrl : "";
const supabaseAnonKey = isValidUrl ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "") : "";
const supabaseServiceKey = isValidUrl ? (process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey) : "";

// Client for frontend browser operations (reads, realtime subscriptions)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Admin client for backend server routes (/api/telemetry ingestion)
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
