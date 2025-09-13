import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  FileText, 
  Building2, 
  CheckCircle, 
  Wrench, 
  ArrowRight 
} from "lucide-react";

export const ProcessFlow = () => {
  const steps = [
    {
      id: 1,
      title: "Citizen Identifies Issue",
      description: "Community member spots a civic problem that needs attention",
      icon: User,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Report Submission",
      description: "Issue is reported through our platform with details and evidence",
      icon: FileText,
      color: "bg-indigo-500",
    },
    {
      id: 3,
      title: "Authority Notification",
      description: "Report is automatically routed to the relevant municipal department",
      icon: Building2,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Issue Validation",
      description: "Municipal employee verifies and prioritizes the reported issue",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      id: 5,
      title: "Resolution & Update",
      description: "Issue is resolved and status is updated for the reporter",
      icon: Wrench,
      color: "bg-emerald-500",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From issue identification to resolution - see how your reports create positive change
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <Card className="group hover:shadow-float transition-all duration-500 hover:scale-105 cursor-pointer">
                      <CardContent className="p-6 text-center w-48">
                        <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {index < steps.length - 1 && (
                      <div className="flex-1 flex items-center justify-center mx-4">
                        <div className="w-full h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
                        <ArrowRight className="h-6 w-6 text-primary mx-2 animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-6">
              {steps.map((step, index) => (
                <div key={step.id}>
                  <Card className="group hover:shadow-card transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-4">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="bg-gradient-civic text-white shadow-civic">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Make a Difference?
                </h3>
                <p className="text-lg mb-6 text-gray-100">
                  Join thousands of citizens who are actively improving their communities
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Report Your First Issue
                  </button>
                  <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                    View Community Impact
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};