import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";

const communityPosts = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "SJ",
    title: "Park Cleanup Initiative - Join Us!",
    content: "Organizing a community cleanup this Saturday at Central Park. Bring gloves and positive energy!",
    category: "Community Event",
    likes: 24,
    comments: 8,
    shares: 5,
    time: "2 hours ago"
  },
  {
    id: 2,
    author: "Mike Chen",
    avatar: "MC", 
    title: "Traffic Light Timing Issue Resolved",
    content: "Thanks to everyone who reported the timing issue at 5th Avenue. The city has fixed it!",
    category: "Success Story",
    likes: 18,
    comments: 12,
    shares: 3,
    time: "5 hours ago"
  },
  {
    id: 3,
    author: "Elena Rodriguez",
    avatar: "ER",
    title: "New Bike Lane Proposal Discussion",
    content: "The city is considering a new bike lane on Main Street. What are your thoughts?",
    category: "Discussion",
    likes: 31,
    comments: 15,
    shares: 8,
    time: "1 day ago"
  }
];

export default function Community() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
        <p className="text-muted-foreground mt-2">Connect with fellow citizens and collaborate on civic issues</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {communityPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{post.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{post.author}</CardTitle>
                    <CardDescription>{post.time}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.content}</p>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    {post.shares}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Members</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Issues Resolved</span>
                <span className="font-semibold">856</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-semibold text-green-600">+23%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">#ParkCleanup</Badge>
                <Badge variant="secondary">#BikePathsSafety</Badge>
                <Badge variant="secondary">#StreetLightRepairs</Badge>
                <Badge variant="secondary">#CommunityGarden</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}