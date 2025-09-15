import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Eye, MessageSquare, Filter, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const fetchReports = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const queryParams = new URLSearchParams(activeFilters).toString();
      const response = await fetch(`http://127.0.0.1:5001/api/reports?${queryParams}`);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };
  
  const handleCategoryChange = (value) => {
    handleFilterChange('category', value === 'all' ? '' : value);
  };
  
  const handleStatusChange = (value) => {
    handleFilterChange('status', value === 'all' ? '' : value);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
        <p className="text-muted-foreground mt-2">Track all your submitted civic issue reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5"/> Filter Reports</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="pothole">Pothole</SelectItem>
              <SelectItem value="streetlight">Streetlight</SelectItem>
              <SelectItem value="litter">Litter</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" placeholder="Start Date" onChange={(e) => handleFilterChange('startDate', e.target.value)} />
          <Input type="date" placeholder="End Date" onChange={(e) => handleFilterChange('endDate', e.target.value)} />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {reports.map((report: any) => (
          <Card key={report.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{report.category} issue</CardTitle>
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
                  {new Date(report.created_at).toLocaleDateString()}
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
                  {report.map_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={report.map_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on Map
                      </a>
                    </Button>
                  )}
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