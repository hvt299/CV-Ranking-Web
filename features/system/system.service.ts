import apiClient from '@/lib/api-client';
import { AdministrativeUnit, Skill } from '@/types/system';

export interface LocationUnit extends AdministrativeUnit {
    version: 'old' | 'new';
}

export const systemService = {
    async getLocations(): Promise<LocationUnit[]> {
        const response = await apiClient.get<LocationUnit[]>('/system/locations');
        return response.data;
    },

    async getSubLocations(parentCode: string): Promise<LocationUnit[]> {
        const response = await apiClient.get<LocationUnit[]>(`/system/locations/${parentCode}/children`);
        return response.data;
    },

    async searchSkills(query?: string, industry?: string): Promise<Skill[]> {
        const params: any = {};
        if (query) params.q = query;
        if (industry) params.industry = industry;

        const response = await apiClient.get<Skill[]>('/system/skills', { params });
        return response.data;
    },

    async getStatistics(): Promise<any> {
        const response = await apiClient.get('/system/statistics');
        return response.data;
    },

    async getIndustryWeights(): Promise<any> {
        const response = await apiClient.get('/system/config/industry-weights');
        return response.data;
    },
};