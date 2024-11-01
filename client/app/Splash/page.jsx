"use client";

import { useState, useEffect } from "react"; // Removed unused import `use`
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Axios from "axios";
import Cookies from "universal-cookie";

export default function Splash() {
  const router = useRouter();
  const cookies = new Cookies();
  const [loginData, setLoginData] = useState({ username: '', password: '' }); // Initialize with empty strings
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' }); // Initialize with empty strings
  const [activeTab, setActiveTab] = useState("login");
  
  const storeUsername = (username) => {
    sessionStorage.setItem('username', username);
  }
  useEffect(() => {
    if (typeof window !== "undefined") { // Check if it's running on the client
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            //setUsername(storedUsername);
        }
    }
}, []);

  const navigateToHome = () => {
    router.push('/home');
  };

  const signUp = () => {
    Axios.post("http://localhost:5001/signup", signUpData).then((res) => {
      const { userId, username, email } = res.data;
      cookies.set("userId", userId);
      cookies.set("username", username);
      cookies.set("email", email);
      storeUsername(username);
      // navigate('/home');
      navigateToHome();
    }).catch((error) => {
      console.log(error);
    });
  }

  const login = () => {
    console.log("sending data")
    Axios.post("http://localhost:5001/login", loginData).then((res) => {
      const { userId, username, email } = res.data;
      console.log("received");
      console.log(res.data);
      cookies.set("userId", userId);
      cookies.set("username", username);
      cookies.set("email", email);
      storeUsername(username);
      // navigate('/home');
      navigateToHome();
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome!</CardTitle>
            <CardDescription className="text-center text-black">Sign up, log in, or play as a guest</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full h-full grid-cols-2 bg-gray-800 border border-gray-600">
                <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-white text-bold text-[1.0625rem]"
                >
                    Login
                </TabsTrigger>
                <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-white text-bold text-[1.0625rem]"
                >
                    Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form>
                  <div className="grid w-full items-center gap-8">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="login-email" className="text-black font-bold text-lg">Username</Label>
                      <Input id="login-email" placeholder="Enter your username" onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}/>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="login-password" className="text-black font-bold text-lg">Password</Label>
                      <Input id="login-password" type="password" placeholder="Enter your password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}/>
                    </div>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-3">
                      <Label htmlFor="signup-name" className="text-black font-bold text-lg">Username</Label>
                      <Input id="signup-name" placeholder="Enter your username" onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}/>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Label htmlFor="signup-email" className="text-black font-bold text-lg">Email</Label>
                      <Input id="signup-email" placeholder="Enter your email" onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}/>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Label htmlFor="signup-password" className="text-black font-bold text-lg">Password</Label>
                      <Input id="signup-password" type="password" placeholder="Choose a password" onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}/>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full bg-blue-400 font-bold text-black text-lg border-gray-400 border-2" onClick={() => activeTab === "login" ? login() : signUp()}>
              {activeTab === "login" ? "Log In" : "Sign Up"}
            </Button>
            <Button variant="outline" className="w-full border-2 border-gray-400 bg-gray-200 text-black font-bold text-lg" onClick={() => navigateToHome()}>
              Play as Guest
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
