"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase, isDemoMode } from "@/lib/client"
import type { Profile, UserRole } from "@/types/supabase"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (
    email: string,
    password: string,
    userData: { full_name: string; role: UserRole; organization?: string },
  ) => Promise<{ error: any }>
  signOut: () => Promise<void>
  hasRole: (role: UserRole | UserRole[]) => boolean
  isAdmin: boolean
  isVendor: boolean
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          if (isDemoMode) {
            // Create mock profile for demo mode
            const mockProfile: Profile = {
              id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name || "Demo User",
              role: session.user.user_metadata?.role || "vendor",
              organization: session.user.user_metadata?.organization || "Demo Organization",
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            setProfile(mockProfile)
          } else {
            await fetchProfile(session.user.id)
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        if (isDemoMode) {
          // Create mock profile for demo mode
          const mockProfile: Profile = {
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || "Demo User",
            role: session.user.user_metadata?.role || "vendor",
            organization: session.user.user_metadata?.organization || "Demo Organization",
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          setProfile(mockProfile)
        } else {
          await fetchProfile(session.user.id)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    if (isDemoMode) return // Skip real database calls in demo mode

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (
    email: string,
    password: string,
    userData: { full_name: string; role: UserRole; organization?: string },
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!profile) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(profile.role)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") }

    if (isDemoMode) {
      // Mock profile update in demo mode
      if (profile) {
        setProfile({ ...profile, ...updates })
      }
      return { error: null }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (!error && profile) {
      setProfile({ ...profile, ...updates })
    }

    return { error }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    isDemoMode,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAdmin: hasRole("admin"),
    isVendor: hasRole("vendor"),
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
