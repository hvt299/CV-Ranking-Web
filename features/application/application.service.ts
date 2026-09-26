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

    async getSavedJobs(): Promise<any[]> {
        const response = await apiClient.get<any[]>('/apply/saved-jobs/list');
        return response.data;
    },

    async saveJob(jobId: string): Promise<any> {
        const response = await apiClient.post(`/apply/saved-jobs/${jobId}`);
        return response.data;
    },

    async unsaveJob(jobId: string): Promise<any> {
        const response = await apiClient.delete(`/apply/saved-jobs/${jobId}`);
        return response.data;
    },

    async saveCompany(companyId: string): Promise<any> {
        const response = await apiClient.post(`/apply/saved-companies/${companyId}`);
        return response.data;
    },

    async unsaveCompany(companyId: string): Promise<any> {
        const response = await apiClient.delete(`/apply/saved-companies/${companyId}`);
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
    async applyForJob(jobId: string, payload: { cv_document_id: string, cover_letter_id?: string }): Promise<{ message: string }> {
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
     * Thêm CV từ URL
     */
    async addMyCVViaUrl(payload: { url: string, display_name: string }): Promise<void> {
        await apiClient.post('/apply/library/url', payload);
    },

    /**
     * Xóa một CV khỏi thư viện cá nhân
     */
    async deleteMyCV(cvId: string): Promise<void> {
        await apiClient.delete(`/apply/library/${cvId}`);
    },

    /**
     * Lấy danh sách Thư giới thiệu
     */
    async getMyCoverLetters(): Promise<any[]> {
        const response = await apiClient.get<any[]>('/apply/cover-letters');
        return response.data;
    },

    /**
     * Tải lên Thư giới thiệu (Cover Letter)
     */
    async uploadCoverLetter(formData: FormData): Promise<void> {
        await apiClient.post('/apply/cover-letters/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    /**
     * Thêm Thư giới thiệu từ URL
     */
    async addCoverLetterViaUrl(payload: { url: string, display_name: string }): Promise<void> {
        await apiClient.post('/apply/cover-letters/url', payload);
    },

    /**
     * Xóa Thư giới thiệu
     */
    async deleteCoverLetter(clId: string): Promise<void> {
        await apiClient.delete(`/apply/cover-letters/${clId}`);
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