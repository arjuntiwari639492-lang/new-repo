import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mic, MapPin, LocateFixed, AlertTriangle, Siren } from "lucide-react";
import potholeIcon from "@/assets/pothole-icon.jpg";
import streetlightIcon from "@/assets/streetlight-icon.jpg";
import litterIcon from "@/assets/litter-icon.jpg";

interface ReportDetails {
  potholeSize?: string;
  potholeDepth?: string;
  roadLocation?: string;
  lightIssueType?: string;
  poleNumber?: string;
  wasteType?: string;
  binStatus?: string;
}

export const ReportIssuePage = () => {
  const [activeCategory, setActiveCategory] = useState("pothole");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    description: "",
    latitude: null as number | null,
    longitude: null as number | null,
    map_url: "",
  });
  const [details, setDetails] = useState<ReportDetails>({});

  const categories = [
    { id: "pothole", title: "Pothole", icon: potholeIcon },
    { id: "streetlight", title: "Streetlight", icon: streetlightIcon },
    { id: "litter", title: "Waste Bin", icon: litterIcon },
  ];

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapUrl = `https://www.google.com/maps?q=$${latitude},${longitude}`;
        
        setFormData({
          ...formData,
          // This ensures the input field shows the full URL
          location: mapUrl, 
          latitude,
          longitude,
          map_url: mapUrl
        });
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please enter it manually or use localhost.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullReport = {
      category: activeCategory,
      ...formData,
      details: details,
    };
    console.log("Submitting Full Report:", fullReport);
    alert("Detailed report submitted successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Siren className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Report a Community Issue</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-2">
          Provide detailed information to help us resolve the problem faster.
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-auto">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex flex-col gap-2 p-4 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <img src={cat.icon} alt={cat.title} className="w-10 h-10 rounded-md object-cover" />
              <span className="font-semibold">{cat.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <Card className="shadow-lg border-border/40">
              <CardHeader>
                <CardTitle className="text-2xl">Details for: {cat.title}</CardTitle>
                <CardDescription>All fields in this section are required for a complete report.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    {activeCategory === 'pothole' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Pothole Size (Approx.)</Label>
                          <Select onValueChange={(value) => setDetails({ ...details, potholeSize: value })}>
                            <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small (Motorcycle Tyre)</SelectItem>
                              <SelectItem value="medium">Medium (Car Tyre)</SelectItem>
                              <SelectItem value="large">Large (Wider than a car)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                         <div className="space-y-2">
                          <Label>Pothole Depth</Label>
                           <Select onValueChange={(value) => setDetails({ ...details, potholeDepth: value })}>
                            <SelectTrigger><SelectValue placeholder="Select depth" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="shallow">Shallow (Less than 3 inches)</SelectItem>
                              <SelectItem value="deep">Deep (More than 3 inches)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {activeCategory === 'streetlight' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>What is the issue?</Label>
                          <RadioGroup onValueChange={(value) => setDetails({ ...details, lightIssueType: value })}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="out" id="r1" /><Label htmlFor="r1">Light is completely out</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="flickering" id="r2" /><Label htmlFor="r2">Light is flickering</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="on_day" id="r3" /><Label htmlFor="r3">Light is on during the day</Label></div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="poleNumber">Streetlight Pole Number (if visible)</Label>
                           <Input id="poleNumber" placeholder="e.g., P-12345" onChange={(e) => setDetails({...details, poleNumber: e.target.value})} />
                        </div>
                      </div>
                    )}
                    
                    {activeCategory === 'litter' && (
                      <div className="space-y-4">
                         <div className="space-y-2">
                          <Label>What is the status of the bin?</Label>
                          <RadioGroup onValueChange={(value) => setDetails({ ...details, binStatus: value })}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="full" id="b1" /><Label htmlFor="b1">Bin is full</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="overflowing" id="b2" /><Label htmlFor="b2">Waste is overflowing onto the ground</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="damaged" id="b3" /><Label htmlFor="b3">The bin is damaged</Label></div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Primary Type of Waste</Label>
                          <Select onValueChange={(value) => setDetails({ ...details, wasteType: value })}>
                            <SelectTrigger><SelectValue placeholder="Select waste type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General household waste</SelectItem>
                              <SelectItem value="recycling">Recycling materials</SelectItem>
                              <SelectItem value="construction">Construction debris</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                   <div className="space-y-2">
                      <Label>Issue Location</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter address or use GPS" className="pl-10" required />
                        </div>
                        <Button type="button" variant="outline" onClick={handleLocation} className="shrink-0">
                          <LocateFixed className="h-4 w-4 mr-2" />
                          Use My Current Location
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Button type="button" variant="outline" className="h-24"><Camera className="h-5 w-5 mr-2" />Upload Photo/Video</Button>
                       <Button type="button" variant="outline" className="h-24"><Mic className="h-5 w-5 mr-2" />Record Voice Note</Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Additional Description</Label>
                      <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Add any other relevant details..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required/></div>
                      <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Your phone number" required/></div>
                    </div>
                  
                  <Button type="submit" className="w-full text-lg py-6">Submit Detailed Report</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};