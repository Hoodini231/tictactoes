import React from 'react';
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Cookies from "universal-cookie"



export default function Home() {
    const cookies = new Cookies();
    const userName = cookies.get("username");
    return (
        <div id="home-page" className="min-h-screen flex flex-col justify-start items-center">
            <header className="w-full p-4 flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white mb-8">Welcome {userName}!</h1>
                <Button variant="ghost" size="icon" className="text-white">
                    <Settings className="h-8 w-8" />
                    <span className="sr-only">Settings</span>
                </Button>
            </header>
            <button className="w-full max-w-xs py-2 px-4 mb-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                Find Random Game
            </button>
            <button className="w-full max-w-xs py-2 px-4 mb-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
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
