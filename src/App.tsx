import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CivicSidebar } from "./components/CivicSidebar";
import CivicDashboard from "./pages/CivicDashboard";
import Reports from "./pages/Reports";
import ProgressPage from "./pages/Progress";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import LeaderboardPage from "./pages/LeaderboardPage";
import Trending from "./pages/Trending";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <CivicSidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<CivicDashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/community" element={<Community />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
