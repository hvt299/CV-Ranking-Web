'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api-client';
import { User, UserRole } from '@/types';
import { clearAllAuthData } from '@/lib/auth-utils';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUserProfile = async () => {
        try {
            const res = await apiClient.get('/auth/me');
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error('Failed to fetch user profile', error);
            return null;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const user = await fetchUserProfile();

                if (user) {
                    setIsAuthenticated(true);
                } else {
                    clearAllAuthData();
                }
            } catch {
                clearAllAuthData();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (token: string) => {
        setLoading(true);

        Cookies.set('token', token, { expires: 1, path: '/' });

        apiClient.get('/auth/me')
            .then((res) => {
                const fetchedUser: User = res.data;

                setUser(fetchedUser);
                setIsAuthenticated(true);

                if (fetchedUser.role === UserRole.APPLICANT) {
                    router.push('/overview');
                } else if (
                    fetchedUser.role === UserRole.HR_OWNER ||
                    fetchedUser.role === UserRole.HR_MEMBER ||
                    fetchedUser.role === UserRole.ADMIN
                ) {
                    router.push('/dashboard');
                } else {
                    router.push('/overview');
                }
            })
            .catch(() => {
                clearAllAuthData();
                setUser(null);
                setIsAuthenticated(false);
                router.push('/login');
            })
            .finally(() => {
                setLoading(false);
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
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                updateUser,
            }}
        >
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