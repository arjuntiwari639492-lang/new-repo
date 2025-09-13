import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export default function Analytics() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Comprehensive data insights and statistics</p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}