"use client"

import { useAuth } from "@/lib/auth-context"
import LoginForm from "@/components/login-form"
import ProtectedRoute from "@/components/protected-route"
import VendorDashboard from "@/components/vendor-dashboard"
import AdminDashboard from "@/components/admin-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, BarChart3, Shield } from "lucide-react"

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">DocuMentor</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Automated document comparison platform for planning proposals. AI-powered analysis against gold standard
            references with detailed section-level feedback.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Smart Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Support for DOCX and PDF formats with intelligent content extraction and structure preservation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced LLM-powered comparison with semantic similarity scoring and detailed feedback generation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Secure & Scalable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enterprise-grade security with role-based access control and cloud-native architecture.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Login Section */}
        <LoginForm />
      </div>
    </div>
  )
}

function AuthenticatedApp() {
  const { profile } = useAuth()

  if (profile?.role === "admin" || profile?.role === "reviewer") {
    return (
      <ProtectedRoute requiredRole={["admin", "reviewer"]}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="vendor">
      <VendorDashboard />
    </ProtectedRoute>
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return <AuthenticatedApp />
}
