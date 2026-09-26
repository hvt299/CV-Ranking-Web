'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';

export default function GlobalUrlListener() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Lấy state từ Zustand
    const { isAuthenticated, loading, initAuth } = useAuthStore();
    const { _setApplyModalState } = useUIStore();

    // 1. Tự động Init Auth khi app vừa load (Thay cho useEffect trong AuthProvider cũ)
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    // 2. Tự động bắt URL Callback sau khi Login thành công
    useEffect(() => {
        if (loading) return;

        const applyJobId = searchParams.get('applyJobId');
        if (applyJobId && isAuthenticated) {
            _setApplyModalState(true, applyJobId, 'Vị trí ứng tuyển');

            // Xóa param khỏi URL để tránh F5 lại mở modal
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('applyJobId');
            const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, isAuthenticated, loading, pathname, router, _setApplyModalState]);

    return null; // Component này chạy ngầm, không render UI
}