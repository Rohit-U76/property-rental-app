import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const savedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (savedUser && token) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (e) {
                    console.error("Auth init error:", e);
                    localStorage.clear();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        delete API.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {!loading ? children : (
                <div className="h-screen w-screen bg-black flex items-center justify-center text-blue-500 font-bold">
                    Initializing PropertyHub...
                </div>
            )}
        </AuthContext.Provider>
    );
};