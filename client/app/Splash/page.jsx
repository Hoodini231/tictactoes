"use client";

import Axios from "axios";

import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";

export default function Splash() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' }); 
  const [activeTab, setActiveTab] = useState("login");
  
  const storeUsername = (username) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem('username', username);
    }
  }

const navigateToHome = () => {
  if (typeof window !== 'undefined') {
    router.push('/home');
  } else {
    console.error('location is not available');
  }
};

  const guestSignIn = () => {
    Axios.post("https://tictactoes-5foa.onrender.com/play-as-guest").then((res) => {
      const { username } = res.data;
      storeUsername(username);
      navigateToHome();
    });
  };

  const signUp = () => {
    Axios.post("https://tictactoes-5foa.onrender.com/signup", signUpData).then((res) => {
      const { userId, username, email } = res.data;
      storeUsername(username);
      navigateToHome();
    }).catch((error) => {
      console.log(error);
    });
  }

  const login = () => {
    console.log("sending data")
    Axios.post("https://tictactoes-5foa.onrender.com/login", loginData).then((res) => {
      const { userId, username, email } = res.data;
      storeUsername(username);
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
            <CardTitle aria-label="Welcome Title" className="text-3xl font-bold text-center">Welcome!</CardTitle>
            <CardDescription aria-label="Signup or log in or play as guest label" className="text-center text-black">Sign up, log in, or play as a guest</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs aria-label={`${activeTab} is the active tab`} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full h-full grid-cols-2 bg-gray-800 border border-gray-600">
                <TabsTrigger 
                    aria-label="Login tab"
                    value="login" 
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-white text-bold text-[1.0625rem]"
                >
                    Login
                </TabsTrigger>
                <TabsTrigger 
                    aria-label="Sign up tab"
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
                      <Label aria-label="Username label" htmlFor="login-email" className="text-black font-bold text-lg">Username</Label>
                      <Input aria-label="Username Input" id="login-email" placeholder="Enter your username" onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}/>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label aria-label="password label" htmlFor="login-password" className="text-black font-bold text-lg">Password</Label>
                      <Input aria-label="password input" id="login-password" type="password" placeholder="Enter your password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}/>
                    </div>
                  </div>
                </form>
              </TabsContent>
              <TabsContent aria-label="signup tab" value="signup">
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-3">
                      <Label aria-label="username label" htmlFor="signup-name" className="text-black font-bold text-lg">Username</Label>
                      <Input aria-label="username input" id="signup-name" placeholder="Enter your username" onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}/>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Label aria-label="email label" htmlFor="signup-email" className="text-black font-bold text-lg">Email</Label>
                      <Input aria-label="email input" id="signup-email" placeholder="Enter your email" onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}/>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Label aria-label="password label" htmlFor="signup-password" className="text-black font-bold text-lg">Password</Label>
                      <Input id="signup-password" type="password" placeholder="Choose a password" onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}/>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button aria-label="submit form button" className="w-full bg-blue-400 font-bold text-black text-lg border-gray-400 border-2" onClick={() => activeTab === "login" ? login() : signUp()}>
              {activeTab === "login" ? "Log In" : "Sign Up"}
            </Button>
            <Button aria-label="play as guest button" variant="outline" className="w-full border-2 border-gray-400 bg-gray-200 text-black font-bold text-lg" onClick={() => guestSignIn()}>
              Play as Guest
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
