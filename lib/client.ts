import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// For development/demo purposes, we'll create a mock client if env vars are missing
let supabase: any

if (supabaseUrl && supabaseAnonKey) {
  // Real Supabase client
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
} else {
  // Mock Supabase client for demo purposes
  console.warn("Supabase environment variables not found. Running in demo mode.")

  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: ({ email, password }: any) => {
        // Mock authentication for demo accounts
        const demoAccounts = {
          "vendor@demo.com": { role: "vendor", full_name: "Demo Vendor" },
          "admin@demo.com": { role: "admin", full_name: "Demo Admin" },
          "reviewer@demo.com": { role: "reviewer", full_name: "Demo Reviewer" },
        }

        if (email in demoAccounts && password === "demo123") {
          const userData = demoAccounts[email as keyof typeof demoAccounts]
          return Promise.resolve({
            data: {
              user: {
                id: `demo-${userData.role}`,
                email,
                user_metadata: userData,
              },
              session: {
                user: {
                  id: `demo-${userData.role}`,
                  email,
                  user_metadata: userData,
                },
                access_token: "demo-token",
              },
            },
            error: null,
          })
        }

        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Invalid credentials" },
        })
      },
      signUp: () =>
        Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Sign up not available in demo mode" },
        }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Mock auth state change listener
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => {
            // Mock profile data
            if (table === "profiles") {
              return Promise.resolve({
                data: {
                  id: "demo-user",
                  email: "demo@example.com",
                  full_name: "Demo User",
                  role: "vendor",
                  organization: "Demo Organization",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                error: null,
              })
            }
            return Promise.resolve({ data: null, error: null })
          },
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  }
}

export { supabase }

// Export a flag to check if we're in demo mode
export const isDemoMode = !supabaseUrl || !supabaseAnonKey
