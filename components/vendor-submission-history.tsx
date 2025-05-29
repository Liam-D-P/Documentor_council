"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react"

const mockSubmissions = [
  {
    id: "SUB-ABC123",
    filename: "planning-proposal-v2.pdf",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "completed",
    overallScore: 85,
    sectionsAnalyzed: 8,
  },
  {
    id: "SUB-DEF456",
    filename: "revised-proposal.docx",
    submittedAt: "2024-01-10T14:20:00Z",
    status: "completed",
    overallScore: 72,
    sectionsAnalyzed: 6,
  },
  {
    id: "SUB-GHI789",
    filename: "initial-draft.pdf",
    submittedAt: "2024-01-05T09:15:00Z",
    status: "completed",
    overallScore: 58,
    sectionsAnalyzed: 7,
  },
]

export default function VendorSubmissionHistory() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Submissions
        </CardTitle>
        <CardDescription>Track your document submissions and their analysis results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSubmissions.map((submission) => (
            <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <span className="font-medium text-sm">{submission.filename}</span>
                </div>
                {getStatusBadge(submission.status)}
              </div>

              <div className="text-xs text-gray-500 mb-3">
                Submitted: {new Date(submission.submittedAt).toLocaleDateString()} at{" "}
                {new Date(submission.submittedAt).toLocaleTimeString()}
              </div>

              {submission.status === "completed" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-semibold ${getScoreColor(submission.overallScore)}`}>
                      Score: {submission.overallScore}%
                    </span>
                    <span className="text-gray-600">{submission.sectionsAnalyzed} sections analyzed</span>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </div>
              )}
            </div>
          ))}

          {mockSubmissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No submissions yet</p>
              <p className="text-sm">Upload your first document to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
