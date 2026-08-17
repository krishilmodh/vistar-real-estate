import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a mock client for build-time rendering
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        insert: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        update: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        delete: () => Promise.resolve({ error: new Error("Supabase not configured") }),
      }),
    } as unknown as SupabaseClient;
  }

  return createBrowserClient(url, key);
}