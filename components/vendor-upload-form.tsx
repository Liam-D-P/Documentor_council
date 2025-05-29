"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react"
import DocumentAnalysisResults from "@/components/document-analysis-results"

type UploadStatus = "idle" | "uploading" | "processing" | "completed" | "error"

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

export default function VendorUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
        "application/msword",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please select a valid document file (DOCX or PDF)")
        return
      }

      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const simulateAnalysis = useCallback(async () => {
    // Simulate file upload
    setStatus("uploading")
    setProgress(0)

    for (let i = 0; i <= 30; i++) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    // Simulate processing
    setStatus("processing")

    for (let i = 30; i <= 100; i++) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Simulate completion with mock results
    const mockResult: AnalysisResult = {
      id: "analysis-" + Date.now(),
      filename: file?.name || "document.pdf",
      overallScore: 78,
      sections: [
        {
          name: "Executive Summary",
          score: 85,
          feedback: "Good coverage of main points. Consider adding more specific metrics and timeline details.",
          status: "good",
        },
        {
          name: "Project Scope",
          score: 72,
          feedback:
            "Missing detailed risk assessment section. The scope is well-defined but lacks contingency planning details.",
          status: "warning",
        },
        {
          name: "Budget Analysis",
          score: 45,
          feedback:
            "Insufficient detail in cost breakdown. Missing labor costs and material specifications required by the gold standard.",
          status: "error",
        },
        {
          name: "Timeline",
          score: 90,
          feedback: "Excellent timeline with clear milestones. Well-aligned with gold standard requirements.",
          status: "good",
        },
        {
          name: "Stakeholder Impact",
          score: 68,
          feedback:
            "Good identification of stakeholders but missing community engagement plan and communication strategy.",
          status: "warning",
        },
      ],
      summary:
        "The proposal demonstrates good understanding of project requirements with strong timeline planning. Key areas for improvement include budget detail and risk assessment. The executive summary effectively communicates the project vision.",
      uploadedAt: new Date().toISOString(),
    }

    setAnalysisResult(mockResult)
    setStatus("completed")
  }, [file])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setError(null)
    await simulateAnalysis()
  }

  const handleReset = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    setAnalysisResult(null)
  }

  if (status === "completed" && analysisResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
          </div>
          <Button onClick={handleReset} variant="outline">
            Upload Another Document
          </Button>
        </div>
        <DocumentAnalysisResults result={analysisResult} />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-6 w-6" />
          <span>Upload Document for Analysis</span>
        </CardTitle>
        <CardDescription>
          Upload your planning proposal document (DOCX or PDF) to compare against the gold standard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document">Select Document</Label>
            <Input
              id="document"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              disabled={status !== "idle"}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500">Supported formats: PDF, DOCX (max 10MB)</p>
          </div>

          {file && (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-sm text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}

          {status !== "idle" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2">
                  {status === "uploading" && (
                    <>
                      <Upload className="h-4 w-4 animate-pulse" />
                      <span>Uploading document...</span>
                    </>
                  )}
                  {status === "processing" && (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>Analyzing document...</span>
                    </>
                  )}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!file || status !== "idle"}>
            {status === "idle" ? "Analyze Document" : "Processing..."}
          </Button>
        </form>

        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-medium">What happens next:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Your document will be parsed and structured</li>
            <li>AI will compare each section against the gold standard</li>
            <li>You'll receive detailed feedback and improvement suggestions</li>
            <li>Analysis typically takes 30-60 seconds</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
