import axios from 'axios';
import Cookies from 'js-cookie';
import { clearAllAuthData } from './auth-utils';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Tự động đính kèm token
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Xử lý lỗi tập trung (401, 403, 500...)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAllAuthData();

            if (typeof window !== 'undefined') {
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }

        // Thêm xử lý lỗi 403 Forbidden nếu cần
        if (error.response?.status === 403) {
            console.error("Bạn không có quyền thực hiện thao tác này.");
        }

        return Promise.reject(error);
    }
);

export default apiClient;