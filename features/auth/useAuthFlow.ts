import { useState } from 'react';
import { authService } from './auth.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthFlow() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login: setAuthToken } = useAuthStore();

    const login = async (payload: any) => {
        setIsLoading(true);
        try {
            const res = await authService.login(payload);
            setAuthToken(res.access_token, router);
            return true;
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            const errorMsg = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail[0].msg.replace('Value error, ', '') : 'Lỗi đăng nhập!');
            toast.error(errorMsg);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (payload: any, hasInviteToken: boolean) => {
        setIsLoading(true);
        try {
            await authService.register(payload);
            if (hasInviteToken) {
                toast.success('Gia nhập công ty thành công! Đang chuyển hướng...', { duration: 3000 });
            } else {
                toast.success('Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt.', { duration: 5000 });
            }
            router.push('/login');
            return true;
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            toast.error(typeof detail === 'string' ? detail : 'Lỗi kết nối máy chủ');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const socialLoginFlow = async (
        provider: 'google' | 'linkedin',
        payload: any
    ) => {
        setIsLoading(true);
        try {
            const res = await authService.socialLogin(provider, payload);

            if (res.status === 202 && res.data.action === 'require_role') {
                return { requireRole: true };
            }

            setAuthToken(res.data.access_token, router);
            toast.success('Đăng nhập/Đăng ký thành công!');
            return { success: true };
        } catch (err: any) {
            toast.error(
                err.response?.data?.detail ||
                `Lỗi xác thực ${provider}`
            );

            return {
                success: false,
            };
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('Link khôi phục đã được gửi!');
            return true;
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, login, register, forgotPassword, socialLoginFlow };
}