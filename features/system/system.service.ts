import apiClient from '@/lib/api-client';
import { AdministrativeUnit, Skill } from '@/types/system';

// Định nghĩa mở rộng để hứng version
export interface LocationUnit extends AdministrativeUnit {
    version: 'old' | 'new';
}

export const systemService = {
    async getLocations(): Promise<LocationUnit[]> {
        const response = await apiClient.get<LocationUnit[]>('/system/locations');
        return response.data;
    },

    // ĐÃ THÊM: Hỗ trợ cross-filtering theo industry
    async searchSkills(query?: string, industry?: string): Promise<Skill[]> {
        const params: any = {};
        if (query) params.q = query;
        if (industry) params.industry = industry;

        const response = await apiClient.get<Skill[]>('/system/skills', { params });
        return response.data;
    }
};