"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import VendorUploadForm from "@/components/vendor-upload-form"
import UserMenu from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { FileText } from "lucide-react"

export default function VendorDashboard() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">DocuMentor</h1>
              <Badge variant="secondary" className="ml-3">
                Vendor Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {profile?.full_name || "User"}</span>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Proposal</h2>
          <p className="text-gray-600">
            Upload your planning document to receive automated feedback against council standards.
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
            <TabsTrigger value="history">Submission History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <VendorUploadForm />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Submissions</CardTitle>
                <CardDescription>View analysis results for your submitted documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Upload a document to see analysis results here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
