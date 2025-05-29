"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Download, Filter, Search, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockSubmissions = [
  {
    id: "SUB-ABC123",
    vendor: "Acme Construction Ltd",
    filename: "planning-proposal-v2.pdf",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "completed",
    overallScore: 85,
    sectionsAnalyzed: 8,
    flaggedSections: 1,
    reviewRequired: false,
  },
  {
    id: "SUB-DEF456",
    vendor: "BuildCorp Solutions",
    filename: "revised-proposal.docx",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "completed",
    overallScore: 72,
    sectionsAnalyzed: 6,
    flaggedSections: 2,
    reviewRequired: true,
  },
  {
    id: "SUB-GHI789",
    vendor: "UrbanDev Partners",
    filename: "initial-draft.pdf",
    submittedAt: "2024-01-13T09:15:00Z",
    status: "processing",
    overallScore: null,
    sectionsAnalyzed: null,
    flaggedSections: null,
    reviewRequired: false,
  },
  {
    id: "SUB-JKL012",
    vendor: "GreenSpaces Ltd",
    filename: "sustainability-proposal.docx",
    submittedAt: "2024-01-12T16:45:00Z",
    status: "completed",
    overallScore: 91,
    sectionsAnalyzed: 9,
    flaggedSections: 0,
    reviewRequired: false,
  },
  {
    id: "SUB-MNO345",
    vendor: "Metro Planning Inc",
    filename: "commercial-development.pdf",
    submittedAt: "2024-01-11T11:20:00Z",
    status: "error",
    overallScore: null,
    sectionsAnalyzed: null,
    flaggedSections: null,
    reviewRequired: true,
  },
]

export default function AdminSubmissionsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)

  const filteredSubmissions = mockSubmissions.filter((submission) => {
    const matchesSearch =
      submission.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || submission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400"
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Submissions</CardTitle>
        <CardDescription>Manage and review vendor document submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by vendor, filename, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submissions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className={`cursor-pointer hover:bg-gray-50 ${submission.reviewRequired ? "bg-yellow-50" : ""}`}
                  onClick={() => setSelectedSubmission(submission.id)}
                >
                  <TableCell className="font-medium">
                    {submission.id}
                    {submission.reviewRequired && (
                      <Badge variant="outline" className="ml-2 text-xs text-yellow-600 border-yellow-200">
                        Review Required
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{submission.vendor}</TableCell>
                  <TableCell className="max-w-48 truncate">{submission.filename}</TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getScoreColor(submission.overallScore)}`}>
                      {submission.overallScore ? `${submission.overallScore}%` : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {submission.flaggedSections !== null ? (
                      <span className={submission.flaggedSections > 0 ? "text-red-600" : "text-green-600"}>
                        {submission.flaggedSections} flagged
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </DropdownMenuItem>
                        {submission.reviewRequired && <DropdownMenuItem>Mark as Reviewed</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No submissions found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
