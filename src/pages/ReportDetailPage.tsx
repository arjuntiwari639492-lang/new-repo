import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

export default function ReportDetailPage() {
  const { id } = useParams(); // Gets the report ID from the URL
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/reports/${id}`);
        if (!response.ok) {
          throw new Error('Report not found');
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading report...</div>;
  }

  if (!report) {
    return <div className="p-6">Report not found.</div>;
  }
  
  const imageUrls = report.image_url ? report.image_url.split(',') : [];

  return (
    <div className="p-6 space-y-4">
      <Link to="/reports" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to All Reports
      </Link>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl capitalize">{report.category} Issue</CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm pt-2">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(report.created_at).toLocaleString()}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{report.location}</span>
              </CardDescription>
            </div>
            <Badge>{report.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{report.description}</p>
          </div>
          
          {imageUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Submitted Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageUrls.map((path, index) => (
                  <a href={`http://localhost:5001/${path}`} target="_blank" rel="noopener noreferrer" key={index}>
                    <img
                      src={`http://localhost:5001/${path}`}
                      alt={`Report evidence ${index + 1}`}
                      className="rounded-lg object-cover aspect-square hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* We will add the comment section here in the next part */}
    </div>
  );
}