import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, CheckCircle, AlertCircle, Users, Calendar, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const AnalyticsDashboard = () => {
  const stats = [
    {
      title: "Total Reports Submitted",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Issues Resolved",
      value: "987",
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Resolution",
      value: "147",
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Urgent Issues",
      value: "23",
      change: "-15%",
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const recentReports = [
    {
      id: "RPT-001",
      type: "Pothole",
      location: "Main Street & 5th Ave",
      status: "In Progress",
      priority: "High",
      date: "2024-01-15",
    },
    {
      id: "RPT-002",
      type: "Streetlight",
      location: "Park Avenue",
      status: "Resolved",
      priority: "Medium",
      date: "2024-01-14",
    },
    {
      id: "RPT-003",
      type: "Litter",
      location: "Downtown Plaza",
      status: "Pending",
      priority: "Low",
      date: "2024-01-13",
    },
  ];

  const pieData = [
    { name: 'Potholes', value: 400 },
    { name: 'Streetlights', value: 300 },
    { name: 'Littering', value: 300 },
    { name: 'Water Logging', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100); // Start animation shortly after mount
    return () => clearTimeout(timer);
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-lift border-0 shadow-card bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm mt-2 font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* New Pie Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-card border-0 bg-gradient-to-br from-white to-indigo-50 lg:col-span-1">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <PieChartIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    Report Breakdown by Type
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                endAngle={-progress * 3.6}
                                startAngle={0}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-to-br from-white to-blue-50 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              Resolution Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-3 font-medium">
                  <span className="text-gray-700">Potholes Fixed</span>
                  <span className="text-blue-600">245/280 (87%)</span>
                </div>
                <Progress value={87} className="h-3 bg-gray-200" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-3 font-medium">
                  <span className="text-gray-700">Streetlights Repaired</span>
                  <span className="text-green-600">156/180 (87%)</span>
                </div>
                <Progress value={87} className="h-3 bg-gray-200" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-3 font-medium">
                  <span className="text-gray-700">Litter Issues Resolved</span>
                  <span className="text-orange-600">98/120 (82%)</span>
                </div>
                <Progress value={82} className="h-3 bg-gray-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Card className="shadow-card border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{report.id}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {report.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{report.location}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={`${getStatusColor(report.status)} font-medium`}>{report.status}</Badge>
                    <br />
                    <Badge className={`${getPriorityColor(report.priority)} font-medium`}>{report.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-0 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            Community Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-3">12,543</div>
              <div className="text-gray-600 font-medium">Active Community Members</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-3">98.2%</div>
              <div className="text-gray-600 font-medium">Citizen Satisfaction Rate</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-orange-600 mb-3">2.3 days</div>
              <div className="text-gray-600 font-medium">Average Resolution Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
