import apiClient from '@/lib/api-client';
import { Job, CV, Application, Notification } from '@/types';

export const applicationService = {
    /**
     * Lấy danh sách các Job đang Open để ứng viên nộp hồ sơ
     */
    async getAvailableJobs(): Promise<Job[]> {
        const response = await apiClient.get<Job[]>('/apply/jobs');
        return response.data;
    },

    /**
     * Lấy danh sách CV cá nhân trong thư viện của ứng viên
     */
    async getMyCvLibrary(): Promise<CV[]> {
        const response = await apiClient.get<CV[]>('/apply/library');
        return response.data;
    },

    /**
     * Chấm điểm thử CV với một Job (Self-score)
     */
    async selfScore(jobId: string, cvId: string): Promise<any> {
        const response = await apiClient.post('/apply/self-score', {
            job_id: jobId,
            cv_document_id: cvId
        });
        return response.data.ai_score;
    },

    /**
     * Nộp hồ sơ ứng tuyển chính thức
     */
    async applyForJob(jobId: string, payload: { cv_document_id: string, cover_letter?: string }): Promise<{ message: string }> {
        const response = await apiClient.post(`/apply/jobs/${jobId}`, payload);
        return response.data;
    },

    /**
     * Lấy lịch sử nộp hồ sơ của cá nhân
     */
    async getMyApplications(): Promise<Application[]> {
        const response = await apiClient.get<Application[]>('/apply/my-applications');
        return response.data;
    },

    /**
     * Lấy danh sách thông báo của cá nhân
     */
    async getMyNotifications(): Promise<Notification[]> {
        const response = await apiClient.get<Notification[]>('/apply/notifications');
        return response.data;
    },

    /**
     * Đánh dấu một thông báo đã đọc
     */
    async markNotificationAsRead(notificationId: string): Promise<void> {
        await apiClient.patch(`/apply/notifications/${notificationId}/read`);
    },

    /**
     * Đánh dấu tất cả thông báo là đã đọc
     */
    async markAllNotificationsAsRead(): Promise<void> {
        await apiClient.patch('/apply/notifications/read-all');
    },

    /**
     * Xóa một thông báo
     */
    async deleteNotification(notificationId: string): Promise<void> {
        await apiClient.delete(`/apply/notifications/${notificationId}`);
    },

    /**
     * Tải lên CV mới vào thư viện cá nhân
     */
    async uploadMyCV(formData: FormData): Promise<void> {
        await apiClient.post('/apply/library/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    /**
     * Xóa một CV khỏi thư viện cá nhân
     */
    async deleteMyCV(cvId: string): Promise<void> {
        await apiClient.delete(`/apply/library/${cvId}`);
    },

    /**
     * Lấy thông tin Profile cá nhân
     */
    async getMyProfile(): Promise<any> {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },

    /**
     * Cập nhật thông tin Profile cá nhân
     */
    async updateMyProfile(payload: any): Promise<any> {
        const response = await apiClient.patch('/auth/profile', payload);
        return response.data;
    }
};