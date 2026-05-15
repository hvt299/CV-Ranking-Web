'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface User {
    full_name: string;
    email: string;
    avatar: string;
    role: 'hr' | 'applicant' | 'admin';
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const fetchUserProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error('Failed to fetch user profile', error);
            return null;
        }
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setIsAuthenticated(true);
            fetchUserProfile();
        }
    }, []);

    const login = (token: string) => {
        Cookies.set('token', token, { expires: 1 });
        setIsAuthenticated(true);
        
        // Fetch user profile và redirect dựa trên role
        api.get('/auth/me').then(res => {
            setUser(res.data);
            const role = res.data.role;
            
            // Redirect dựa trên role
            if (role === 'applicant') {
                router.push('/apply');
            } else if (role === 'hr' || role === 'admin') {
                router.push('/dashboard');
            } else {
                // Fallback nếu role không xác định
                router.push('/apply');
            }
        }).catch(() => {
            // Nếu lỗi, mặc định về apply
            router.push('/apply');
        });
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('token', { path: '/' });
        
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        
        setIsAuthenticated(false);
        setUser(null);
        router.push('/login');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
