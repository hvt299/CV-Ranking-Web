'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { User, UserRole } from '@/types';
import { clearAllAuthData } from '@/lib/auth-utils';

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
        Cookies.set('token', token, { expires: 1, path: '/' });
        setIsAuthenticated(true);

        api.get('/auth/me').then(res => {
            const fetchedUser: User = res.data;
            setUser(fetchedUser);

            if (fetchedUser.role === UserRole.APPLICANT) {
                router.push('/apply');
            } else if (
                fetchedUser.role === UserRole.HR_OWNER ||
                fetchedUser.role === UserRole.HR_MEMBER ||
                fetchedUser.role === UserRole.ADMIN
            ) {
                router.push('/dashboard');
            } else {
                router.push('/apply');
            }
        }).catch(() => {
            router.push('/apply');
        });
    };

    const logout = () => {
        clearAllAuthData();

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
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};