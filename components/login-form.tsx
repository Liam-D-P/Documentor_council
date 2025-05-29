"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Shield, AlertCircle, Eye, EyeOff, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/types/supabase"

export default function LoginForm() {
  const { signIn, signUp, loading, isDemoMode } = useAuth()
  const [activeTab, setActiveTab] = useState("signin")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    organization: "",
    role: "vendor" as UserRole,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const { error } = await signIn(formData.email, formData.password)

    if (error) {
      setError(error.message)
    }

    setIsSubmitting(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isDemoMode) {
      setError("Sign up is not available in demo mode. Please use the demo login buttons below.")
      return
    }

    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      role: formData.role,
      organization: formData.organization || undefined,
    })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      alert("Account created successfully! Please check your email to verify your account.")
    }

    setIsSubmitting(false)
  }

  const handleDemoLogin = async (role: UserRole) => {
    const demoCredentials = {
      vendor: { email: "vendor@demo.com", password: "demo123" },
      admin: { email: "admin@demo.com", password: "demo123" },
      reviewer: { email: "reviewer@demo.com", password: "demo123" },
    }

    const credentials = demoCredentials[role]
    setFormData((prev) => ({ ...prev, email: credentials.email, password: credentials.password }))

    setIsSubmitting(true)
    const { error } = await signIn(credentials.email, credentials.password)
    if (error) {
      setError(`Demo login failed: ${error.message}`)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {isDemoMode && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Demo Mode</Badge>
              <span className="text-sm">Running without Supabase connection</span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup" disabled={isDemoMode}>
            Sign Up {isDemoMode && "(Disabled)"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </CardTitle>
              <CardDescription>
                {isDemoMode ? "Demo mode - use the demo buttons below" : "Access your DocuMentor account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {isDemoMode ? "Demo accounts" : "Or try demo"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("vendor")} disabled={isSubmitting}>
                  <User className="mr-2 h-4 w-4" />
                  Vendor Demo
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("admin")} disabled={isSubmitting}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Demo
                </Button>
              </div>

              {isDemoMode && (
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>Demo credentials:</p>
                  <p>vendor@demo.com / demo123</p>
                  <p>admin@demo.com / demo123</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Create Account</span>
              </CardTitle>
              <CardDescription>Join DocuMentor to start analyzing documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDemoMode ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Sign up is not available in demo mode. Use the demo login buttons on the Sign In tab to explore the
                    application.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-role">Role</Label>
                        <select
                          id="signup-role"
                          value={formData.role}
                          onChange={(e) => handleInputChange("role", e.target.value)}
                          disabled={isSubmitting}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="vendor">Vendor</option>
                          <option value="admin">Admin</option>
                          <option value="reviewer">Reviewer</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-organization">Organization (Optional)</Label>
                      <Input
                        id="signup-organization"
                        placeholder="Your Company Name"
                        value={formData.organization}
                        onChange={(e) => handleInputChange("organization", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
