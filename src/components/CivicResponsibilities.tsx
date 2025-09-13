import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Users, Heart, Lightbulb, TreePine, HandHeart, Phone, Mail, MapPin } from "lucide-react"

export const CivicResponsibilities = () => {
  const responsibilities = [
    {
      title: "Keep Your Environment Clean",
      description: "Dispose of waste properly and participate in community cleanup drives",
      icon: Recycle,
      color: "bg-green-500",
      tips: ["Use designated bins", "Avoid littering", "Join cleanup events"],
    },
    {
      title: "Be a Responsible Neighbor",
      description: "Look out for your community and help create a safe environment",
      icon: Users,
      color: "bg-blue-500",
      tips: ["Check on elderly neighbors", "Report suspicious activities", "Maintain noise levels"],
    },
    {
      title: "Support Local Initiatives",
      description: "Volunteer for community projects and support local businesses",
      icon: Heart,
      color: "bg-red-500",
      tips: ["Volunteer regularly", "Support local shops", "Attend community meetings"],
    },
    {
      title: "Conserve Resources",
      description: "Use water, electricity, and other resources mindfully",
      icon: Lightbulb,
      color: "bg-yellow-500",
      tips: ["Turn off lights", "Fix water leaks", "Use public transport"],
    },
    {
      title: "Protect Green Spaces",
      description: "Help maintain parks and plant trees in your neighborhood",
      icon: TreePine,
      color: "bg-emerald-500",
      tips: ["Plant native trees", "Don't damage plants", "Create community gardens"],
    },
    {
      title: "Help Those in Need",
      description: "Assist vulnerable community members and promote inclusivity",
      icon: HandHeart,
      color: "bg-purple-500",
      tips: ["Help disabled persons", "Support food drives", "Mentor youth"],
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Your Civic Responsibilities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Small actions create big changes. Here's how you can contribute to a better community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {responsibilities.map((item, index) => (
            <Card key={index} className="group hover:shadow-float transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div
                  className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-center">{item.description}</p>
                <div className="space-y-2">
                  {item.tips.map((tip, tipIndex) => (
                    <Badge key={tipIndex} variant="outline" className="text-xs mr-1 mb-1">
                      {tip}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div id="contact" className="max-w-4xl mx-auto">
          <Card className="bg-gradient-civic text-white shadow-civic">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
                <p className="text-lg text-gray-100">
                  Have questions or need assistance? We're here to help make your community better.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="text-gray-200">+1 (555) 123-4567</p>
                  <p className="text-gray-200">24/7 Emergency Line</p>
                </div>

                <div className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <p className="text-gray-200">support@civicvoice.com</p>
                  <p className="text-gray-200">Response within 24hrs</p>
                </div>

                <div className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Visit Us</h4>
                  <p className="text-gray-200">City Hall, Room 201</p>
                  <p className="text-gray-200">Mon-Fri, 9AM-5PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
