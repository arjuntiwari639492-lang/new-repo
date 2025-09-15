import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mic, MapPin, AlertTriangle, LocateFixed } from "lucide-react";
import potholeIcon from "@/assets/pothole-icon.jpg";
import streetlightIcon from "@/assets/streetlight-icon.jpg";
import litterIcon from "@/assets/litter-icon.jpg";

export const IssueReporting = () => {
  const [activeCategory, setActiveCategory] = useState("pothole");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    description: "",
    latitude: null as number | null,
    longitude: null as number | null,
    map_url: ""
  });

  const categories = [
    {
      id: "pothole",
      title: "Pothole Reporting",
      description: "Report dangerous road conditions and potholes",
      icon: potholeIcon,
    },
    {
      id: "streetlight",
      title: "Streetlight Issues",
      description: "Report malfunctioning or broken streetlights",
      icon: streetlightIcon,
    },
    {
      id: "litter",
      title: "Waste & Litter",
      description: "Report overflowing bins and litter issues",
      icon: litterIcon,
    },
  ];

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        
        // FIX: Corrected the template literal from {latitude} to ${latitude}
        const mapUrl = `https://www.google.com/maps?q=$${latitude},${longitude}`;
        
        setFormData({
          ...formData,
          location: mapUrl, 
          latitude,
          longitude,
          map_url: mapUrl
        });
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please enter it manually.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5001/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: activeCategory, ...formData }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.msg);
        setFormData({
            name: "",
            phone: "",
            location: "",
            description: "",
            latitude: null,
            longitude: null,
            map_url: ""
        });
      } else {
        alert('Error: ' + result.msg);
      }
    } catch (error) {
      console.error('Failed to connect to server:', error);
      alert('An error occurred. Could not connect to the server.');
    }
  };

  return (
    <section id="report" className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Report Civic Issues
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us make our city better. Choose a category and report issues in your neighborhood.
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col p-4 h-auto data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <img
                  src={category.icon}
                  alt={category.title}
                  className="w-12 h-12 mb-2 rounded-lg object-cover"
                />
                <span className="font-medium">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <img
                      src={category.icon}
                      alt={category.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                  <CardTitle className="text-2xl">{category.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {category.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Issue Location</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Enter address or use GPS"
                            className="pl-10"
                            required
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={handleLocation} className="shrink-0">
                          <LocateFixed className="h-4 w-4 mr-2" />
                          Use My Current Location
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button type="button" variant="outline" className="h-20 flex flex-col gap-2">
                        <Camera className="h-6 w-6" />
                        <span>Upload Photo</span>
                      </Button>
                      <Button type="button" variant="outline" className="h-20 flex flex-col gap-2">
                        <Mic className="h-6 w-6" />
                        <span>Record Voice Note</span>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Issue Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the issue in detail..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Reporting Guidelines</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Provide accurate location information</li>
                            <li>• Use respectful language in your description</li>
                            <li>• Include photos for better understanding</li>
                            <li>• Report genuine issues that affect the community</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark text-lg py-6">
                      Submit Report
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};