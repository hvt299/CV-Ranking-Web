import apiClient from '@/lib/api-client';

export const companyService = {
    // === DÀNH CHO HR (CÔNG TY) ===
    lookupTax: async (taxCode: string) => {
        const response = await apiClient.get(`/companies/lookup-tax/${taxCode}`);
        return response.data;
    },

    getSettings: async () => {
        const response = await apiClient.get('/companies/settings');
        return response.data;
    },

    updateSettings: async (payload: any) => {
        const response = await apiClient.patch('/companies/settings', payload);
        return response.data;
    },

    getMembers: async () => {
        const response = await apiClient.get('/companies/members');
        return response.data;
    },

    inviteMember: async (email: string) => {
        const response = await apiClient.post('/companies/invite', { email });
        return response.data;
    },

    // === DÀNH CHO ADMIN HỆ THỐNG ===
    getAdminCompanies: async () => {
        const response = await apiClient.get('/admin/companies');
        return response.data;
    },

    verifyCompany: async (companyId: string, payload: { approve: boolean, rejection_reason: string | null }) => {
        const response = await apiClient.patch(`/admin/companies/${companyId}/verify`, payload);
        return response.data;
    },

    updateCompanyByAdmin: async (companyId: string, payload: any) => {
        const response = await apiClient.patch(`/admin/companies/${companyId}`, payload);
        return response.data;
    },

    getAdminUsers: async () => {
        const response = await apiClient.get('/admin/users');
        return response.data;
    },

    updateUserRole: async (userId: string, newRole: string) => {
        const response = await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
        return response.data;
    },

    getAuditLogs: async () => {
        const response = await apiClient.get('/admin/audit-logs');
        return response.data;
    },

    // Upload chung
    uploadFile: async (formData: FormData) => {
        const response = await apiClient.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};