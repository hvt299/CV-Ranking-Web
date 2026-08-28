import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRole } from '@/types'; // Đảm bảo import đúng
import { useAuthStore } from './useAuthStore';

interface HRViewState {
    hrViewMode: 'OWNER' | 'MEMBER';
    setHrViewMode: (mode: 'OWNER' | 'MEMBER') => void;
}

export const useHRViewStore = create<HRViewState>()(
    persist(
        (set) => ({
            hrViewMode: 'OWNER', // Sẽ bị ghi đè bởi localStorage nếu có
            setHrViewMode: (mode) => {
                const { user } = useAuthStore.getState();
                // Không cho phép HR_MEMBER tự ý đổi mode
                if (user?.role === UserRole.HR_MEMBER) return;
                set({ hrViewMode: mode });
            },
        }),
        {
            name: 'cv_ranking_hr_view', // Tên key lưu trên localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);