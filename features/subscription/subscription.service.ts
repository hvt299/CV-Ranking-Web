import apiClient from '@/lib/api-client';

export const subscriptionService = {
    getPlans: async (target: 'hr' | 'applicant' = 'hr') => {
        const response = await apiClient.get(`/subscriptions/plans?target=${target}`);
        return response.data.data;
    },
    getMyPlan: async () => {
        const response = await apiClient.get('/subscriptions/my-plan');
        return response.data.data;
    },
    createCheckout: async (planCode: string) => {
        const response = await apiClient.post(`/subscriptions/checkout/${planCode}`);
        return response.data.data;
    }
};