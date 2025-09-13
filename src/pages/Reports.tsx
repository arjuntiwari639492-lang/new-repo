import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Eye, MessageSquare } from "lucide-react";

const mockReports = [
  {
    id: "RPT-001",
    title: "Pothole on Main Street",
    category: "Pothole",
    status: "In Progress",
    date: "2024-01-15",
    location: "Main Street, Block A",
    description: "Large pothole causing traffic issues"
  },
  {
    id: "RPT-002", 
    title: "Broken Streetlight",
    category: "Streetlight",
    status: "Resolved",
    date: "2024-01-10",
    location: "Park Avenue, Near Bus Stop",
    description: "Streetlight not working, creating safety concerns"
  },
  {
    id: "RPT-003",
    title: "Overflowing Trash Bin",
    category: "Litter",
    status: "Pending",
    date: "2024-01-20",
    location: "Central Market Area",
    description: "Trash bin overflowing, attracting pests"
  }
];

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
        <p className="text-muted-foreground mt-2">Track all your submitted civic issue reports</p>
      </div>

      <div className="grid gap-4">
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <Badge 
                  variant={
                    report.status === "Resolved" ? "default" : 
                    report.status === "In Progress" ? "secondary" : "outline"
                  }
                >
                  {report.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {report.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {report.location}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{report.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{report.category}</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}