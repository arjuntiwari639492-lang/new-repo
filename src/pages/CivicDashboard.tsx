import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";

import { ProcessFlow } from "@/components/ProcessFlow";
import { CivicResponsibilities } from "@/components/CivicResponsibilities";

const CivicDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        
        <ProcessFlow />
        <CivicResponsibilities />
      </main>
    </div>
  );
};

export default CivicDashboard;