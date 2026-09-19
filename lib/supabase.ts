import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Polyfill WebSocket in Node.js 20 runtime where native WebSocket is disabled
if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class DummyWebSocket {} as unknown as typeof WebSocket;
}

let _publicClient: SupabaseClient | null = null;
let _adminClient: SupabaseClient | null = null;

/**
 * Public client — safe to use client-side. Uses anon key with RLS applied.
 * Initialized lazily to avoid throwing during build or before env vars are populated.
 */
export function getSupabasePublic(): SupabaseClient {
  if (_publicClient) return _publicClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in your .env.local file."
    );
  }

  _publicClient = createClient(url, anonKey);
  return _publicClient;
}

/**
 * Direct proxy for public client (lazy initialized on property access)
 */
export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabasePublic();
    return (client as unknown as Record<string, unknown>)[prop as string];
  },
});

/**
 * Admin client — server-only. Uses SERVICE_ROLE_KEY which bypasses RLS.
 * NEVER import this in a client component or expose it to the browser.
 * Initialized lazily to avoid throwing during module import.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env.local file."
    );
  }

  _adminClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _adminClient;
}

/** Type for a registrations row */
export interface Registration {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
  role: string;
  ticket_id: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

/** Type for a volunteers row */
export interface Volunteer {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
  role: string;
  motivation?: string | null;
  ticket_id: string;
  created_at: string;
}

/** Type for a media row (event-media bucket + media table) */
export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  caption?: string | null;
  uploaded_at: string;
}

/** Type for event_status single row */
export interface EventStatus {
  id: number;
  current_item_id: number | null;
  updated_at: string;
}

