"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, Download } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface FileWithStatus {
  file: File
  id: string
  status: "queued" | "processing" | "completed" | "error"
  progress: number
  result?: {
    score: number
    status: "passed" | "warning" | "failed"
  }
  error?: string
}

export default function BulkUpload() {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 11),
        status: "queued" as const,
        progress: 0,
      }))
      setFiles((prev) => [...prev, ...newFiles])
    },
  })

  const processFiles = async () => {
    if (files.length === 0 || isProcessing) return

    setIsProcessing(true)
    setOverallProgress(0)

    // Process files sequentially for demo
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "queued") continue

      // Update status to processing
      setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, status: "processing" } : f)))

      // Simulate processing with progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((r) => setTimeout(r, 300))
        setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, progress } : f)))
      }

      // Set final status (randomly success or error for demo)
      const success = Math.random() > 0.2
      const result = success
        ? {
            score: Math.floor(Math.random() * 30) + 70,
            status: Math.random() > 0.5 ? ("passed" as const) : ("warning" as const),
          }
        : undefined

      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i
            ? {
                ...f,
                status: success ? "completed" : "error",
                result,
                error: success ? undefined : "Failed to process document. Format may be unsupported.",
              }
            : f,
        ),
      )

      // Update overall progress
      setOverallProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setIsProcessing(false)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "completed"))
  }

  const getStatusIcon = (status: string, result?: { status: string }) => {
    switch (status) {
      case "queued":
        return <FileText className="h-4 w-4 text-gray-400" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed":
        if (result?.status === "passed") return <CheckCircle className="h-4 w-4 text-green-500" />
        if (result?.status === "warning") return <AlertCircle className="h-4 w-4 text-yellow-500" />
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string, result?: { status: string }) => {
    switch (status) {
      case "queued":
        return <Badge variant="outline">Queued</Badge>
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "completed":
        if (result?.status === "passed") return <Badge className="bg-green-100 text-green-800">Passed</Badge>
        if (result?.status === "warning") return <Badge className="bg-yellow-100 text-yellow-800">Warnings</Badge>
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Document Processing
        </CardTitle>
        <CardDescription>Upload multiple documents for batch analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Drag & drop files here</p>
          <p className="text-sm text-gray-500 mt-1">or click to select files</p>
          <p className="text-xs text-gray-400 mt-4">Supported formats: PDF, DOCX (max 10MB per file)</p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="flex items-center gap-2">
                      {getStatusIcon(file.status, file.result)}
                      <span className="font-medium truncate max-w-[200px]">{file.file.name}</span>
                    </TableCell>
                    <TableCell>{(file.file.size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(file.status, file.result)}
                        {file.status === "processing" && <Progress value={file.progress} className="h-1 w-20" />}
                        {file.error && <p className="text-xs text-red-500">{file.error}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {file.result?.score ? (
                        <span
                          className={`font-bold ${
                            file.result.score >= 80
                              ? "text-green-600"
                              : file.result.score >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {file.result.score}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {file.status === "completed" && (
                          <Button variant="ghost" size="icon" title="Download Report">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === "processing"}
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Overall Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {files.length > 0 && (
            <p className="text-sm text-gray-500">
              {files.length} file{files.length !== 1 ? "s" : ""} •{files.filter((f) => f.status === "completed").length}{" "}
              completed •{files.filter((f) => f.status === "error").length} failed
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {files.some((f) => f.status === "completed") && (
            <Button variant="outline" onClick={clearCompleted}>
              Clear Completed
            </Button>
          )}
          <Button
            onClick={processFiles}
            disabled={isProcessing || files.filter((f) => f.status === "queued").length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Files"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
