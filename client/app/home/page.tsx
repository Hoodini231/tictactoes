"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState("...");


    useEffect(() => {
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
        <div id="home-page" className="min-h-screen flex flex-col justify-start items-center bg-gradient-to-b from-blue-500 to-purple-600 p-4">
            <header className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center bg-white bg-opacity-10 rounded-lg backdrop-blur-md mb-8">
                <h1 className="text-4xl font-bold text-white">Welcome {username}!</h1>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:bg-opacity-20">
                    <Settings className="h-8 w-8" />
                    <span className="sr-only">Settings</span>
                </Button>
            </header>
            <div className="w-full max-w-xs space-y-4">
                <Button onClick={() => navigate("/game")} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md">
                    Find Random Game
                </Button>
                <Button onClick={() => navigate("/host")} className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md">
                    Join Game
                </Button>
                <Button onClick={() => navigate("/join")} className="w-full py-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-md">
                    Host Game
                </Button>
                <Button onClick={() => navigate("/stats")} className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md">
                    Past Games
                </Button>
            </div>
        </div>
    );
}