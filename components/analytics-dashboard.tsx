"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { useState } from "react"

// Mock data
const monthlySubmissions = [
  { month: "Jan", submissions: 65, avgScore: 76 },
  { month: "Feb", submissions: 59, avgScore: 79 },
  { month: "Mar", submissions: 80, avgScore: 72 },
  { month: "Apr", submissions: 81, avgScore: 78 },
  { month: "May", submissions: 56, avgScore: 81 },
  { month: "Jun", submissions: 55, avgScore: 84 },
  { month: "Jul", submissions: 40, avgScore: 85 },
]

const sectionScores = [
  { section: "Executive Summary", score: 82 },
  { section: "Project Scope", score: 76 },
  { section: "Budget", score: 65 },
  { section: "Timeline", score: 90 },
  { section: "Risk Assessment", score: 58 },
  { section: "Stakeholder Analysis", score: 72 },
]

const vendorPerformance = [
  { name: "GreenTech Solutions", submissions: 12, avgScore: 87, improvement: 8 },
  { name: "Urban Planning Co.", submissions: 8, avgScore: 72, improvement: 5 },
  { name: "Infrastructure Ltd.", submissions: 15, avgScore: 79, improvement: 12 },
  { name: "EcoBuilders Inc.", submissions: 6, avgScore: 91, improvement: 3 },
  { name: "Metro Planning Inc.", submissions: 9, avgScore: 68, improvement: 15 },
]

const scoreDistribution = [
  { name: "90-100%", value: 15, color: "#10b981" },
  { name: "80-89%", value: 25, color: "#3b82f6" },
  { name: "70-79%", value: 35, color: "#f59e0b" },
  { name: "60-69%", value: 18, color: "#f97316" },
  { name: "<60%", value: 7, color: "#ef4444" },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">436</div>
            <p className="text-xs text-muted-foreground">+28% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.3%</div>
            <p className="text-xs text-muted-foreground">+5.2% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+8% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Submission Trends</TabsTrigger>
          <TabsTrigger value="sections">Section Analysis</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Volume & Quality</CardTitle>
              <CardDescription>Monthly submissions and average scores</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="submissions" fill="#3b82f6" name="Submissions" />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#10b981" name="Avg Score %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Distribution of submission scores</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Performance Analysis</CardTitle>
              <CardDescription>Average scores by document section</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="section" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6">
                    {sectionScores.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score >= 80 ? "#10b981" : entry.score >= 70 ? "#f59e0b" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section Compliance Radar</CardTitle>
              <CardDescription>Multi-dimensional view of section performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sectionScores}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="section" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Vendor Performance</CardTitle>
              <CardDescription>Submission quality by vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {vendorPerformance.map((vendor, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-sm text-gray-500">{vendor.submissions} submissions</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${vendor.avgScore >= 80 ? "text-green-600" : vendor.avgScore >= 70 ? "text-yellow-600" : "text-red-600"}`}
                        >
                          {vendor.avgScore}%
                        </p>
                        <p className="text-sm text-green-600">+{vendor.improvement}% improvement</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${vendor.avgScore >= 80 ? "bg-green-600" : vendor.avgScore >= 70 ? "bg-yellow-500" : "bg-red-600"}`}
                        style={{ width: `${vendor.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
