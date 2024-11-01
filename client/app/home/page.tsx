"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Users, User, Trophy, Info } from "lucide-react";

const HomePage = () => {
  const router = useRouter();
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-4 bg-gray-400 bg-opacity-50 rounded-lg">
          <h1 className="text-5xl font-bold text-center">Tic Tac Toes</h1>
          <h2 className="text-3xl font-bold text-center">
            Welcome {username}!
          </h2>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
        <button 
            onClick={() => navigate("/game")}
            className="w-full group hover:outline hover:translate-x-3 hover:outline-white hover:outline-4 hover:outline-offset-2 transition-transform focus:outline-white focus:outline-4 focus:outline-offset-2">
            <div className="flex items-center bg-gradient-to-r from-purple-900 to-pink-600 p-4 rounded-lg">
            <div className="w-24 h-24 flex items-center justify-center">
                <Users className="w-16 h-16" />
            </div>
            <div className="ml-4">
                <h2 className="text-2xl font-bold text-left ml-0">PLAY</h2>
                <p className="text-gray-300">PLAY ONLINE WITH FRIENDS AND FOES</p>
            </div>
            </div>
        </button>

          <button 
            onClick={() => navigate("/host")}
            className="w-full group hover:translate-x-3 hover:outline hover:outline-white hover:outline-4 transition-transform focus:outline-white focus:outline-4 focus:outline-offset-2"
          >
            <div className="flex items-center bg-gradient-to-r from-indigo-800 to-blue-500 p-4 rounded-lg">
              <div className="w-24 h-24 flex items-center justify-center">
                <User className="w-16 h-16" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-left ml-0">HOST</h2>
                <p className="text-gray-300">CHALLENGE SOMEONE AND FIGHT</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate("/join")}
            className="w-full group hover:outline hover:outline-white hover:outline-4 hover:translate-x-3 transition-transform focus:outline-white focus:outline-4 focus:outline-offset-2"
          >
            <div className="flex items-center bg-gradient-to-r from-red-800 to-orange-400 p-4 rounded-lg">
              <div className="w-24 h-24 flex items-center justify-center">
                <Settings className="w-16 h-16" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-left ml-0">JOIN</h2>
                <p className="text-gray-300">JOIN SOMEONES LOBBY NOW</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate("/stats")}
            className="w-full group hover:outline hover:translate-x-3 hover:outline-white hover:outline-4 transition-transform focus:outline-white focus:outline-4 focus:outline-offset-2"
          >
            <div className="flex items-center bg-gradient-to-r from-green-800 to-emerald-800 p-4 rounded-lg">
              <div className="w-24 h-24 flex items-center justify-center">
                <Trophy className="w-16 h-16" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-left ml-0">STATS</h2>
                <p className="text-gray-300">LEADERBOARDS, ACHIEVEMENTS, AND MORE</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate("/settings")}
            className="w-full group hover:outline hover:translate-x-3 transition-transform focus:outline-white focus:outline-4 focus:outline-offset-2"
          >
            <div className="flex items-center bg-gradient-to-r from-gray-600 to-gray-700 p-4 rounded-lg">
              <div className="w-24 h-24 flex items-center justify-center">
                <Info className="w-16 h-16" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-left ml-0">SETTINGS</h2>
                <p className="text-gray-300">ALL ABOUT THE GAME</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;