"use client";
import { Splash, Game, Home } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


export default function App() {
  return (
    <div className="min-h-screen items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-900">
      <h1 className="text-4xl mb-10 font-inter text-white text-bold">Tic Tack Toe Online</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/game" element={<Game />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}
