import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function signUp(email: string, password: string, metadata: { role: string; organization: string }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}

export async function getUserRole() {
  const { data } = await supabase.auth.getUser()
  return data.user?.user_metadata?.role
}
