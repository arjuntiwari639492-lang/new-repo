import { Leaderboard } from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Community Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Celebrating our most active civic contributors</p>
      </div>
      <Leaderboard />
    </div>
  );
}