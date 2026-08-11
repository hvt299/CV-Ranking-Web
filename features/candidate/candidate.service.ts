import apiClient from '@/lib/api-client';
import { CV } from '@/types';

export const candidateService = {
    /**
     * Lấy danh sách toàn bộ CV trong Talent Pool
     */
    async getCandidatePool(): Promise<CV[]> {
        const response = await apiClient.get<CV[]>('/cv/pool');
        return response.data;
    },

    /**
     * Tải lên một hoặc nhiều CV mới vào kho
     */
    async uploadCV(formData: FormData): Promise<{ message: string, cv_id: string, is_existing: boolean }> {
        const response = await apiClient.post('/cv/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Xóa vĩnh viễn một CV khỏi hệ thống
     */
    async deleteCV(cvId: string): Promise<{ status: string, message: string }> {
        const response = await apiClient.delete(`/cv/${cvId}`);
        return response.data;
    },

    /**
     * Đưa một CV từ kho vào một chiến dịch (Map to Job) và chấm điểm AI
     */
    async mapCvToJob(cvId: string, jobId: string): Promise<{ message: string, application_id: string }> {
        const response = await apiClient.post(`/cv/${cvId}/map`, { job_id: jobId });
        return response.data;
    },

    /**
     * Đưa nhiều CV vào một chiến dịch (Map Batch)
     */
    async mapMultipleCvsToJob(cvIds: string[], jobId: string): Promise<{ message: string, successful_maps: number, errors: string[] }> {
        const response = await apiClient.post(`/cv/map-batch`, { cv_ids: cvIds, job_id: jobId });
        return response.data;
    }
};