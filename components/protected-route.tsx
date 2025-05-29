"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/types/supabase"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { user, profile, loading, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600">Please sign in to access this page.</p>
          </div>
        </div>
      )
    )
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Insufficient Permissions</h2>
            <p className="text-gray-600">You don't have the required permissions to access this page.</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
