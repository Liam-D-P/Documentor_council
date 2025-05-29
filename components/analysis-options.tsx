"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { FileText, Zap, CheckCircle, AlertTriangle } from "lucide-react"

export default function AnalysisOptions() {
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("standard")
  const [enabledOptions, setEnabledOptions] = useState({
    toneAnalysis: true,
    structuralCheck: true,
    complianceCheck: true,
    readabilityScore: false,
    plagiarismCheck: false,
  })
  const [thoroughness, setThoroughness] = useState([75])

  const handleOptionToggle = (option: keyof typeof enabledOptions) => {
    setEnabledOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Analysis Options
        </CardTitle>
        <CardDescription>Customize how your document will be analyzed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedAnalysisType} onValueChange={setSelectedAnalysisType}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="standard">
              <CheckCircle className="h-4 w-4 mr-2" />
              Standard
            </TabsTrigger>
            <TabsTrigger value="thorough">
              <FileText className="h-4 w-4 mr-2" />
              Thorough
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="pt-4">
            <p className="text-sm text-gray-600">
              Standard analysis compares your document against the gold standard template, checking for content coverage
              and basic structural alignment.
            </p>
          </TabsContent>

          <TabsContent value="thorough" className="pt-4">
            <p className="text-sm text-gray-600">
              Thorough analysis includes everything in standard plus detailed tone analysis, readability scoring, and
              more comprehensive feedback.
            </p>
          </TabsContent>

          <TabsContent value="compliance" className="pt-4">
            <p className="text-sm text-gray-600">
              Compliance-focused analysis emphasizes regulatory requirements, mandatory sections, and legal terminology
              alignment with council standards.
            </p>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tone-analysis">Tone Analysis</Label>
              <p className="text-xs text-gray-500">Check writing style and formality</p>
            </div>
            <Switch
              id="tone-analysis"
              checked={enabledOptions.toneAnalysis}
              onCheckedChange={() => handleOptionToggle("toneAnalysis")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="structural-check">Structural Check</Label>
              <p className="text-xs text-gray-500">Verify document organization</p>
            </div>
            <Switch
              id="structural-check"
              checked={enabledOptions.structuralCheck}
              onCheckedChange={() => handleOptionToggle("structuralCheck")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compliance-check">Compliance Check</Label>
              <p className="text-xs text-gray-500">Verify regulatory requirements</p>
            </div>
            <Switch
              id="compliance-check"
              checked={enabledOptions.complianceCheck}
              onCheckedChange={() => handleOptionToggle("complianceCheck")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="readability-score">Readability Score</Label>
              <p className="text-xs text-gray-500">Assess reading level and clarity</p>
            </div>
            <Switch
              id="readability-score"
              checked={enabledOptions.readabilityScore}
              onCheckedChange={() => handleOptionToggle("readabilityScore")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="plagiarism-check">Plagiarism Check</Label>
              <p className="text-xs text-gray-500">Check for copied content</p>
            </div>
            <Switch
              id="plagiarism-check"
              checked={enabledOptions.plagiarismCheck}
              onCheckedChange={() => handleOptionToggle("plagiarismCheck")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Analysis Thoroughness</Label>
            <span className="text-sm font-medium">{thoroughness[0]}%</span>
          </div>
          <Slider value={thoroughness} onValueChange={setThoroughness} max={100} step={5} />
          <p className="text-xs text-gray-500">
            Higher thoroughness provides more detailed feedback but may take longer to process
          </p>
        </div>

        <Button className="w-full">Apply Settings</Button>
      </CardContent>
    </Card>
  )
}
