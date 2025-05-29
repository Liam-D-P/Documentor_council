"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Clock, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total Submissions",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Active Vendors",
    value: "8",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Avg. Processing Time",
    value: "2.3 min",
    change: "-15%",
    changeType: "positive" as const,
    icon: Clock,
  },
  {
    title: "Compliance Rate",
    value: "78%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

const recentActivity = [
  {
    id: 1,
    type: "submission",
    message: "New submission from Acme Construction",
    time: "5 minutes ago",
    status: "processing",
  },
  {
    id: 2,
    type: "completion",
    message: "Analysis completed for BuildCorp proposal",
    time: "15 minutes ago",
    status: "completed",
  },
  {
    id: 3,
    type: "review",
    message: "Admin review required for UrbanDev submission",
    time: "1 hour ago",
    status: "attention",
  },
  {
    id: 4,
    type: "submission",
    message: "New submission from GreenSpaces Ltd",
    time: "2 hours ago",
    status: "completed",
  },
]

export default function AdminOverview() {
  const getActivityIcon = (type: string, status: string) => {
    if (status === "attention") return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />
    return <Clock className="h-4 w-4 text-blue-500" />
  }

  return (
    <div className="grid gap-6 mb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="mt-4 flex items-center">
                  <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest submissions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                {getActivityIcon(activity.type, activity.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                {activity.status === "attention" && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    Review Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
