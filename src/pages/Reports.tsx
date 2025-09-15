import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Eye, MessageSquare, Filter, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- IMPORT LINK

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  // Fully implemented fetchReports function
  const fetchReports = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const queryParams = new URLSearchParams(activeFilters).toString();
      const response = await fetch(`http://localhost:5001/api/reports?${queryParams}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    handleFilterChange('category', value === 'all' ? '' : value);
  };
  
  const handleStatusChange = (value: string) => {
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
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="pothole">Pothole</SelectItem>
              <SelectItem value="streetlight">Streetlight</SelectItem>
              <SelectItem value="litter">Litter</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
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
        {reports.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No reports found.</p>
        ) : (
          reports.map((report) => {
            const imageUrls = report.image_url ? report.image_url.split(',') : [];
            return (
              <Card key={report.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg capitalize">{report.category} issue</CardTitle>
                    <Badge variant={report.status === "Resolved" ? "default" : report.status === "In Progress" ? "secondary" : "outline"}>
                      {report.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-sm pt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(report.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 truncate"><MapPin className="h-4 w-4 flex-shrink-0" />{report.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{report.description}</p>
                  
                  {imageUrls.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {imageUrls.map((path, index) => (
                        <a href={`http://localhost:5001/${path}`} target="_blank" rel="noopener noreferrer" key={index}>
                          <img
                            src={`http://localhost:5001/${path}`}
                            alt={`Report image ${index + 1}`}
                            className="h-28 w-28 object-cover rounded-md border hover:opacity-80 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="outline" className="capitalize">{report.category}</Badge>
                    <div className="flex gap-2">
                      {report.map_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={report.map_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-1" />View on Map</a>
                        </Button>
                      )}
                      {/* --- THIS BUTTON IS NOW A FUNCTIONAL LINK --- */}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/report/${report.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}