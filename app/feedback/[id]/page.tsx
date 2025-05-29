"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, FileText, CheckCircle, AlertTriangle, XCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

// Mock feedback data
const mockFeedback = {
  submissionId: "SUB-ABC123",
  filename: "planning-proposal-v2.pdf",
  vendor: "Acme Construction Ltd",
  submittedAt: "2024-01-15T10:30:00Z",
  overallScore: 85,
  overallSummary:
    "Overall, the submitted proposal aligns well with the gold standard in structure and content, with a few exceptions: missing risk analysis and a less formal tone in the executive summary. The technical specifications are comprehensive and well-documented.",
  sections: [
    {
      id: 1,
      title: "Executive Summary",
      status: "good",
      similarityScore: 92,
      feedback:
        "The executive summary covers all key points from the gold standard. The content is comprehensive and well-structured.",
      missingPoints: [],
      toneIssues: ["Consider adopting a more formal tone to match council standards"],
    },
    {
      id: 2,
      title: "Project Description",
      status: "excellent",
      similarityScore: 95,
      feedback:
        "Excellent coverage of project scope and objectives. All required elements are present and well-detailed.",
      missingPoints: [],
      toneIssues: [],
    },
    {
      id: 3,
      title: "Technical Specifications",
      status: "good",
      similarityScore: 88,
      feedback: "Technical specifications are comprehensive. Minor gaps in environmental impact details.",
      missingPoints: ["Environmental impact assessment details", "Sustainability measures"],
      toneIssues: [],
    },
    {
      id: 4,
      title: "Budget and Timeline",
      status: "warning",
      similarityScore: 72,
      feedback: "Budget breakdown is present but lacks detail in contingency planning. Timeline is adequate.",
      missingPoints: ["Contingency planning details", "Risk mitigation costs"],
      toneIssues: [],
    },
    {
      id: 5,
      title: "Risk Analysis",
      status: "missing",
      similarityScore: 15,
      feedback:
        "This section is largely missing from the submission. The gold standard requires comprehensive risk analysis.",
      missingPoints: ["Risk identification", "Risk mitigation strategies", "Impact assessment"],
      toneIssues: [],
    },
    {
      id: 6,
      title: "Stakeholder Engagement",
      status: "good",
      similarityScore: 85,
      feedback: "Good coverage of stakeholder consultation process. Community engagement plan is well-defined.",
      missingPoints: ["Follow-up engagement timeline"],
      toneIssues: [],
    },
  ],
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const [showGoldStandard, setShowGoldStandard] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "good":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "missing":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Needs Improvement
          </Badge>
        )
      case "missing":
        return <Badge variant="destructive">Missing/Inadequate</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Analysis Results</h1>
                <p className="text-sm text-gray-600">Submission ID: {mockFeedback.submissionId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowGoldStandard(!showGoldStandard)}>
                {showGoldStandard ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showGoldStandard ? "Hide" : "Show"} Gold Standard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Document</p>
                <p className="font-semibold">{mockFeedback.filename}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendor</p>
                <p className="font-semibold">{mockFeedback.vendor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-semibold">{new Date(mockFeedback.submittedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(mockFeedback.overallScore)}`}>
                  {mockFeedback.overallScore}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription className="text-base">{mockFeedback.overallSummary}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Section Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Section-by-Section Analysis</CardTitle>
            <CardDescription>Detailed feedback for each section of your document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockFeedback.sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(section.status)}
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      {getStatusBadge(section.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Similarity Score</p>
                      <p className={`text-lg font-bold ${getScoreColor(section.similarityScore)}`}>
                        {section.similarityScore}%
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Progress value={section.similarityScore} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Analysis</h4>
                      <p className="text-gray-700">{section.feedback}</p>
                    </div>

                    {section.missingPoints.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-red-700">Missing or Inadequate Points</h4>
                        <ul className="list-disc list-inside space-y-1 text-red-600">
                          {section.missingPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.toneIssues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-yellow-700">Tone and Style Suggestions</h4>
                        <ul className="list-disc list-inside space-y-1 text-yellow-600">
                          {section.toneIssues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {showGoldStandard && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium mb-2">Gold Standard Reference</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          This section should include: [Gold standard content would be displayed here for comparison]
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
