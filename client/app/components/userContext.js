import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const cookies = new Cookies();
    const [username, setUsername] = useState(cookies.get("username") || "err");

    useEffect(() => {
        cookies.set("username", username, { path: '/' });
    }, [username]);

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};