import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, Users, AlertTriangle } from "lucide-react";

const trendingIssues = [
  {
    id: 1,
    title: "Potholes on Highway 101",
    location: "Highway 101, Multiple Locations", 
    reports: 47,
    trend: "+12",
    severity: "High",
    category: "Road Infrastructure",
    description: "Multiple reports of dangerous potholes affecting traffic flow"
  },
  {
    id: 2,
    title: "Streetlight Outages in Downtown",
    location: "Downtown District",
    reports: 23,
    trend: "+8",
    severity: "Medium",
    category: "Public Safety",
    description: "Several streetlights not functioning, creating safety concerns"
  },
  {
    id: 3,
    title: "Overflowing Bins Near Schools",
    location: "School District Areas",
    reports: 18,
    trend: "+5",
    severity: "Low",
    category: "Waste Management", 
    description: "Trash bins near schools consistently overflowing"
  },
  {
    id: 4,
    title: "Broken Traffic Signals",
    location: "Main Street Intersection",
    reports: 34,
    trend: "+15",
    severity: "Critical",
    category: "Traffic Safety",
    description: "Traffic signal malfunction causing congestion and safety risks"
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "destructive";
    case "High": return "default";
    case "Medium": return "secondary";
    case "Low": return "outline";
    default: return "outline";
  }
};

const getSeverityIcon = (severity: string) => {
  if (severity === "Critical" || severity === "High") {
    return <AlertTriangle className="h-4 w-4" />;
  }
  return <TrendingUp className="h-4 w-4" />;
};

export default function Trending() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trending Issues</h1>
        <p className="text-muted-foreground mt-2">Most reported civic issues in your area</p>
      </div>

      <div className="grid gap-4">
        {trendingIssues.map((issue, index) => (
          <Card key={issue.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {issue.location}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={getSeverityColor(issue.severity) as any} className="flex items-center gap-1">
                  {getSeverityIcon(issue.severity)}
                  {issue.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{issue.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{issue.reports} reports</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{issue.trend} this week</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{issue.category}</Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Help Address These Issues
          </CardTitle>
          <CardDescription>
            These trending issues need community attention and action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button>Report Similar Issue</Button>
            <Button variant="outline">Join Discussion</Button>
            <Button variant="outline">Share with Friends</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}