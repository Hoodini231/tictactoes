"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Axios from "axios";
import { ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";

const pastGameDummy = [
  { id: 1, opponent: 'Player123', result: 'Win', date: '2023-07-01' },
  { id: 2, opponent: 'GameMaster', result: 'Loss', date: '2023-07-02' },
  { id: 3, opponent: 'ChessWhiz', result: 'Win', date: '2023-07-03' },
  { id: 4, opponent: 'Strategist', result: 'Win', date: '2023-07-04' },
  { id: 5, opponent: 'Novice101', result: 'Win', date: '2023-07-05' },
];

const dummyStats = [
  {name: "wins", value: 23},
  {name: "losses", value: 12},
  {name: "ties", value: 5},
];
const COLORS = ["hsl(120, 100%, 25%)", "hsl(var(--destructive))", "hsl(var(--primary))"]

const Dashboard = () => {
  const [username, setUsername] = useState("Player123");
  const [games, setGames] = useState(pastGameDummy);
  const [chartData, setChartData] = useState(dummyStats);
  const [playerStats, setPlayerStats] = useState(dummyStats);
  const [winrate, setWinRate] = useState(70);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
        Axios.get(`https://tictactoes-5foa.onrender.com/findUser?username=${storedUsername}`).then((res) => {
          const data = res.data;
          setPlayerStats(data.stats);
          const { wins, losses, ties } = res.data.stats;
          const total = res.data.stats.gamesPlayed;
          setWinRate(total === 0 ? 0 : ((wins / (wins + losses + ties)) * 100).toFixed(2));
          setChartData([ {name: "wins", value: wins }, { name: "losses", value: losses}, {name: "ties", value: ties} ]);
        });
        Axios.get(`https://tictactoes-5foa.onrender.com/fetchUserGames?username=${storedUsername}`).then((res) => {
          setGames(res.data);
        });
      }
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-900 to-purple-900 min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center space-x-4">
          <Button
            aria-label="back button"
            className="mb-4 hover:bg-red-500 focus:bg-red-500 hover:outline-white focus:outline-white hover:border-red-500 focus:border-red-500"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <h1 aria-label="Dashboard title" className="text-4xl font-bold mb-6 text-white">Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card aria-hidden='true' className="col-span-full"> 
            <CardHeader>
              <CardTitle>Wins, Losses and Ties</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  wins: { label: "Wins", color: "hsl(var(--chart-1))" },
                  losses: { label: "Losses", color: "hsl(var(--chart-2))" },
                  ties: { label: "Ties", color: "hsl(var(--chart-3))" },
                }}
                className="h-[300px]"
              >
                  <PieChart width={400} height={300}>
                    <Pie
                      width={400}
                      height={300}
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={({ active, payload }) => active && payload?.length && (
                      <div className="bg-background p-2 rounded shadow">
                        <p className="font-bold">{payload[0].name}</p>
                        <p>{payload[0].value} games</p>
                      </div>
                    )} />
                    <Legend />
                  </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card aria-label="Total games played card">
            <CardHeader>
              <CardTitle aria-label="Total games played title label" className="text-lg">Games played</CardTitle>
            </CardHeader>
            <CardContent>
              <p aria-label={`${playerStats.gamesPlayed}% Total games played label`} className="text-3xl font-bold">{playerStats.gamesPlayed}</p>
            </CardContent>
          </Card>

          <Card aria-label="Win Rate card">
            <CardHeader>
              <CardTitle aria-label="win rate title label" className="text-lg">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p aria-label={`${winrate}% winrate label`} className="text-3xl font-bold">{winrate}%</p>
            </CardContent>
          </Card>

          <Card aria-label="total wins card">
            <CardHeader>
              <CardTitle aria-label="total wins title label" className="text-lg">Total Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <p aria-label={`${playerStats.wins} total wins label`} className="text-3xl font-bold">{playerStats.wins}</p>
            </CardContent>
          </Card>

          <Card aria-label="total losses card">
            <CardHeader>
              <CardTitle aria-label="total losses title label" className="text-lg">Total Losses</CardTitle>
            </CardHeader>
            <CardContent>
              <p aria-label={`${playerStats.losses} losses label`} className="text-3xl font-bold">{playerStats.losses}</p>
            </CardContent>
          </Card>

          <Card aria-label="Total ties card">
            <CardHeader>
              <CardTitle aria-label="Total ties title label" className="text-lg">Total Ties</CardTitle>
            </CardHeader>
            <CardContent>
              <p aria-label={`{playerStats.ties} ties label`} className="text-3xl font-bold">{playerStats.ties}</p>
            </CardContent>
          </Card>
        </div>

        <Card aria-label="past games card" className="mt-6">
          <CardHeader>
            <CardTitle aria-label="past games title label">Past Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-700">
              {games.map((game) => (
                <div key={game.id} className="py-5 flex justify-between items-center">
                  <div>
                    <p aria-label={`Opponent was ${(game.playerX === username) ? game.playerO : game.playerX} label`} className="text-2xl">{`Opponent was ${(game.playerX === username) ? game.playerO : game.playerX}`}</p>
                    <p className="text-sm text-muted-foreground">{game.lastUpdated}</p>
                  </div>
                  <div className="flex items-center">
                    <span
                      aria-label={`${(game.winner === 'X' && username === game.playerX) || (game.winner === 'O' && username === game.playerO)? 'Win' : 'Loss'} label`}
                      className={`mr-2 text-lg ${(game.winner === 'X' && username === game.playerX) || (game.winner === 'O' && username === game.playerO)? 'text-green-500' : 'text-red-500'}`}
                    >
                      {`${(game.winner === 'X' && username === game.playerX) || (game.winner === 'O' && username === game.playerO)? 'Win' : (game.winner !=='tied') ? 'Loss' : 'Tie'}`}
                    </span>
                    <Button className="hover:outline focus:outline hover:bg-red-500 focus:bg-red-500 hover:outline-white focus:outline-white" variant="ghost" size="sm">
                      <ChevronRight className="h-7 w-7" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
