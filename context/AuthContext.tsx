'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        const email = Cookies.get('user_email');
        if (token && email) {
            setUser(email);
        }
        setLoading(false);
    }, []);

    const login = (token: string, email: string) => {
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('user_email', email, { expires: 1 });
        setUser(email);
        router.push('/');
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user_email');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}