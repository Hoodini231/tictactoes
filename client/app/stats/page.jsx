import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: 'Mon', wins: 4, losses: 2 },
  { name: 'Tue', wins: 3, losses: 3 },
  { name: 'Wed', wins: 5, losses: 1 },
  { name: 'Thu', wins: 2, losses: 4 },
  { name: 'Fri', wins: 6, losses: 0 },
  { name: 'Sat', wins: 4, losses: 2 },
  { name: 'Sun', wins: 3, losses: 3 },
];

const pastGames = [
  { id: 1, opponent: 'Player123', result: 'Win', date: '2023-07-01' },
  { id: 2, opponent: 'GameMaster', result: 'Loss', date: '2023-07-02' },
  { id: 3, opponent: 'ChessWhiz', result: 'Win', date: '2023-07-03' },
  { id: 4, opponent: 'Strategist', result: 'Win', date: '2023-07-04' },
  { id: 5, opponent: 'Novice101', result: 'Win', date: '2023-07-05' },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Wins and Losses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              wins: {
                label: "Wins",
                color: "hsl(var(--chart-1))",
              },
              losses: {
                label: "Losses",
                color: "hsl(var(--chart-2))",
              },
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="wins" fill="var(--color-wins)" />
                  <Bar dataKey="losses" fill="var(--color-losses)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Opening Move</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">E4</p>
            <p className="text-sm text-muted-foreground">Used in 65% of games</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Successful Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Queen's Gambit</p>
            <p className="text-sm text-muted-foreground">80% win rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Longest Winning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7 Games</p>
            <p className="text-sm text-muted-foreground">Achieved on July 15, 2023</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Past Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {pastGames.map((game) => (
              <div key={game.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{game.opponent}</p>
                  <p className="text-sm text-muted-foreground">{game.date}</p>
                </div>
                <div className="flex items-center">
                  <span className={`mr-2 ${game.result === 'Win' ? 'text-green-500' : 'text-red-500'}`}>
                    {game.result}
                  </span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">View All Games</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;