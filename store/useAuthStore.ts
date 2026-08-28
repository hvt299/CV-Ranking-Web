import { create } from 'zustand';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api-client';
import { clearAllAuthData } from '@/lib/auth-utils';
import { User, UserRole } from '@/types'; // Đảm bảo import đúng đường dẫn type của bạn

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    initAuth: () => Promise<void>;
    login: (token: string, router: any) => Promise<void>; // Truyền router từ component vào
    logout: (router: any) => void;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    loading: true,

    initAuth: async () => {
        const token = Cookies.get('token');
        if (!token) {
            set({ loading: false, isAuthenticated: false, user: null });
            return;
        }

        try {
            const res = await apiClient.get('/auth/me');
            set({ isAuthenticated: true, user: res.data, loading: false });
        } catch {
            clearAllAuthData();
            set({ isAuthenticated: false, user: null, loading: false });
        }
    },

    login: async (token: string, router: any) => {
        set({ loading: true });
        Cookies.set('token', token, { expires: 1, path: '/' });

        try {
            const res = await apiClient.get('/auth/me');
            const fetchedUser: User = res.data;

            set({ isAuthenticated: true, user: fetchedUser, loading: false });

            // Logic Redirect cũ từ Context
            switch (fetchedUser.role) {
                case UserRole.APPLICANT:
                    router.push('/overview');
                    break;
                case UserRole.HR_OWNER:
                case UserRole.HR_MEMBER:
                    router.push('/dashboard');
                    break;
                case UserRole.ADMIN:
                    router.push('/admin/dashboard');
                    break;
                default:
                    console.error('Unknown user role:', fetchedUser.role);
                    router.push('/overview');
                    break;
            }
        } catch (error) {
            clearAllAuthData();
            set({ isAuthenticated: false, user: null, loading: false });
            router.push('/login');
        }
    },

    logout: (router: any) => {
        clearAllAuthData();
        set({ isAuthenticated: false, user: null });
        router.push('/login');
    },

    updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
            set({ user: { ...user, ...userData } });
        }
    },
}));