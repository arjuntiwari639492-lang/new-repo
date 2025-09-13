import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, MapPin } from "lucide-react";

const progressUpdates = [
  {
    id: "RPT-001",
    title: "Pothole on Main Street",
    progress: 75,
    status: "In Progress",
    lastUpdate: "2024-01-18",
    updates: [
      { date: "2024-01-15", message: "Report submitted and acknowledged", type: "submitted" },
      { date: "2024-01-16", message: "Issue validated by city inspector", type: "validated" },
      { date: "2024-01-17", message: "Work crew assigned", type: "assigned" },
      { date: "2024-01-18", message: "Repair materials ordered", type: "progress" }
    ]
  },
  {
    id: "RPT-002",
    title: "Broken Streetlight",
    progress: 100,
    status: "Resolved",
    lastUpdate: "2024-01-12",
    updates: [
      { date: "2024-01-10", message: "Report submitted", type: "submitted" },
      { date: "2024-01-11", message: "Electrician dispatched", type: "assigned" },
      { date: "2024-01-12", message: "Streetlight repaired and tested", type: "resolved" }
    ]
  }
];

const getStatusIcon = (type: string) => {
  switch (type) {
    case "resolved": return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "progress": return <Clock className="h-4 w-4 text-blue-600" />;
    case "assigned": return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default: return <MapPin className="h-4 w-4 text-gray-600" />;
  }
};

export default function ProgressPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
        <p className="text-muted-foreground mt-2">Real-time updates on your reported issues</p>
      </div>

      <div className="grid gap-6">
        {progressUpdates.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <Badge 
                  variant={item.status === "Resolved" ? "default" : "secondary"}
                >
                  {item.status}
                </Badge>
              </div>
              <CardDescription>
                Last updated: {item.lastUpdate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recent Updates</h4>
                {item.updates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    {getStatusIcon(update.type)}
                    <div className="flex-1">
                      <p className="text-sm">{update.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}