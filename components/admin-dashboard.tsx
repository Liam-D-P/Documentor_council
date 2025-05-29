"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Search, FileText, Users, TrendingUp, Download, Eye, Clock } from "lucide-react"
import UserMenu from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"

// Mock data for the dashboard
const mockSubmissions = [
  {
    id: "SUB-001",
    vendor: "GreenTech Solutions",
    document: "Solar Panel Installation Proposal.pdf",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "completed",
    overallScore: 85,
    sections: 5,
    flagged: false,
  },
  {
    id: "SUB-002",
    vendor: "Urban Planning Co.",
    document: "City Center Renovation Plan.docx",
    submittedAt: "2024-01-14T14:22:00Z",
    status: "completed",
    overallScore: 72,
    sections: 6,
    flagged: true,
  },
  {
    id: "SUB-003",
    vendor: "Infrastructure Ltd.",
    document: "Bridge Maintenance Proposal.pdf",
    submittedAt: "2024-01-14T09:15:00Z",
    status: "processing",
    overallScore: null,
    sections: null,
    flagged: false,
  },
  {
    id: "SUB-004",
    vendor: "EcoBuilders Inc.",
    document: "Sustainable Housing Project.docx",
    submittedAt: "2024-01-13T16:45:00Z",
    status: "completed",
    overallScore: 91,
    sections: 7,
    flagged: false,
  },
]

const scoreDistribution = [
  { range: "90-100%", count: 1, color: "#10b981" },
  { range: "80-89%", count: 1, color: "#3b82f6" },
  { range: "70-79%", count: 1, color: "#f59e0b" },
  { range: "60-69%", count: 0, color: "#ef4444" },
  { range: "<60%", count: 0, color: "#dc2626" },
]

const weeklySubmissions = [
  { day: "Mon", submissions: 12 },
  { day: "Tue", submissions: 8 },
  { day: "Wed", submissions: 15 },
  { day: "Thu", submissions: 10 },
  { day: "Fri", submissions: 18 },
  { day: "Sat", submissions: 3 },
  { day: "Sun", submissions: 2 },
]

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)

  const filteredSubmissions = mockSubmissions.filter(
    (submission) =>
      submission.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getScoreBadge = (score: number | null) => {
    if (score === null) return null

    if (score >= 90) return <Badge className="bg-green-100 text-green-800">{score}%</Badge>
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">{score}%</Badge>
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">{score}%</Badge>
    return <Badge variant="destructive">{score}%</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">DocuMentor</h1>
              <Badge variant="default" className="ml-3">
                {profile?.role === "admin" ? "Admin Portal" : "Reviewer Portal"}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Monitor and manage document submissions.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82.7%</div>
              <p className="text-xs text-muted-foreground">+5.2% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Currently analyzing</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="gold-standard">Gold Standard</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Document Submissions</CardTitle>
                <CardDescription>Review and manage vendor document submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by vendor, document, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.id}
                          {submission.flagged && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Flagged
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{submission.vendor}</TableCell>
                        <TableCell className="max-w-xs truncate">{submission.document}</TableCell>
                        <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>{getScoreBadge(submission.overallScore)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Submissions Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Submissions</CardTitle>
                  <CardDescription>Document submissions over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklySubmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="submissions" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Distribution of submission scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ range, count }) => `${range}: ${count}`}
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gold-standard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gold Standard Management</CardTitle>
                <CardDescription>Manage the reference documents used for comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Planning Proposal Template v2.1</h4>
                        <p className="text-sm text-gray-600">Last updated: January 10, 2024</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button>Upload New Gold Standard</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest document submissions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No recent activity to display.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
