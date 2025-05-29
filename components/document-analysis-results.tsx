"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle, XCircle, Download, Calendar } from "lucide-react"

interface AnalysisResult {
  id: string
  filename: string
  overallScore: number
  sections: Array<{
    name: string
    score: number
    feedback: string
    status: "good" | "warning" | "error"
  }>
  summary: string
  uploadedAt: string
}

interface DocumentAnalysisResultsProps {
  result: AnalysisResult
}

export default function DocumentAnalysisResults({ result }: DocumentAnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Good Match
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Needs Improvement
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Missing Content</Badge>
      default:
        return null
    }
  }

  const handleDownloadReport = () => {
    // In a real implementation, this would generate and download a PDF report
    const reportData = {
      filename: result.filename,
      analysisDate: new Date(result.uploadedAt).toLocaleDateString(),
      overallScore: result.overallScore,
      sections: result.sections,
      summary: result.summary,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analysis-report-${result.filename}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Overall Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Analysis Results</CardTitle>
              <CardDescription className="flex items-center space-x-2 mt-1">
                <Calendar className="h-4 w-4" />
                <span>Analyzed on {new Date(result.uploadedAt).toLocaleDateString()}</span>
              </CardDescription>
            </div>
            <Button onClick={handleDownloadReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Document: {result.filename}</h3>
            <div className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}%</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Compliance Score</span>
              <span>{result.overallScore}%</span>
            </div>
            <Progress value={result.overallScore} className="h-2" />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Executive Summary</h4>
            <p className="text-blue-800 text-sm leading-relaxed">{result.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section-by-Section Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Section Analysis</CardTitle>
          <CardDescription>Detailed feedback for each section of your document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.sections.map((section, index) => (
              <div key={index}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(section.status)}
                    <h4 className="font-semibold text-lg">{section.name}</h4>
                    {getStatusBadge(section.status)}
                  </div>
                  <div className={`text-xl font-bold ${getScoreColor(section.score)}`}>{section.score}%</div>
                </div>

                <div className="ml-8 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Section Score</span>
                      <span>{section.score}%</span>
                    </div>
                    <Progress value={section.score} className="h-1" />
                  </div>

                  <div className={`p-3 rounded-lg ${getScoreBgColor(section.score)}`}>
                    <p className="text-sm leading-relaxed">{section.feedback}</p>
                  </div>
                </div>

                {index < result.sections.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Recommendations to improve your proposal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              {result.sections
                .filter((section) => section.status !== "good")
                .map((section, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(section.status)}
                    <div>
                      <h5 className="font-medium">{section.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Focus on addressing the feedback provided to improve your score from {section.score}% to meet
                        the gold standard requirements.
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {result.sections.every((section) => section.status === "good") && (
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-900">Excellent Work!</h3>
                <p className="text-green-700">
                  Your proposal meets all the gold standard requirements. You're ready to submit.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
