import { Button } from "@/components/ui/button";
import { Menu, Bell, User, ShieldCheck } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto pl-3 pr-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Trigger */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-foreground hover:text-primary" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                {/* Placeholder Logo */}
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-foreground font-bold text-xl">CivicSync</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            <a href="#home" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#report" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Report Issue
            </a>
            <a href="#track" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Track Progress
            </a>
            <a href="#community" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            {/* --- THIS BUTTON IS NOW A LINK --- */}
            <Button asChild variant="outline">
              <a href="/Signuplogin/login.html">
                <User className="h-4 w-4 mr-2" />
                LogIn
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/Signuplogin/signup.html">
                <User className="h-4 w-4 mr-2" />
                SignUp
              </a>
            </Button>
          </div>

          {/* Mobile Menu (now always shows the main trigger) */}
          <div className="md:hidden">
             {/* The main SidebarTrigger is now always visible */}
          </div>
        </div>
      </div>
    </nav>
  );
};

