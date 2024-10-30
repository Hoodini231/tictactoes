import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
//import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';

export default function Home() {
    
    //const navigate = useNavigate();
    const router = useRouter();
    const [username, setUsername] = useState("");
    useEffect(() => {
        if (typeof window !== "undefined") { // Check if it's running on the client
            const storedUsername = sessionStorage.getItem("username");
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }
    }, []);

    const navigate = (path) => {
        router.push(path);
    };

    return (
        <div id="home-page" className="min-h-screen flex flex-col justify-start items-center">
            <header className="w-full p-4 flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white mb-8">Welcome {username}!</h1>
                <Button variant="ghost" size="icon" className="text-white">
                    <Settings className="h-8 w-8" />
                    <span className="sr-only">Settings</span>
                </Button>
            </header>
            <button onClick={() => navigate("/Game")} className="w-full max-w-xs py-2 px-4 mb-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                Find Random Game
            </button>
            <button onClick={() => navigate("/Game")} className="w-full max-w-xs py-2 px-4 mb-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
                Join Game
            </button>
            <button className="w-full max-w-xs py-2 px-4 mb-4 bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75">
                Host Game
            </button>
            <button className="w-full max-w-xs py-2 px-4 mb-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
                Past Games
            </button>
        </div>
    );
}
