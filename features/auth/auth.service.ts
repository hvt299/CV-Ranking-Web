import apiClient from '@/lib/api-client';

export const authService = {
    login: async (payload: any) => {
        const response = await apiClient.post('/auth/login', payload);
        return response.data;
    },

    register: async (payload: any) => {
        const response = await apiClient.post('/auth/register', payload);
        return response.data;
    },

    socialLogin: async (provider: 'google' | 'linkedin', payload: any) => {
        const endpoint = provider === 'google' ? '/auth/google' : '/auth/linkedin';
        const response = await apiClient.post(endpoint, payload);
        return { data: response.data, status: response.status };
    },

    forgotPassword: async (email: string) => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (payload: any) => {
        const response = await apiClient.post('/auth/reset-password', payload);
        return response.data;
    },

    verifyAccount: async (token: string) => {
        const response = await apiClient.get(`/auth/verify?token=${token}`);
        return response.data;
    }
};