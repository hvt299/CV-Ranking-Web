import { create } from 'zustand';

interface UIState {
    isApplyModalOpen: boolean;
    applyJobId: string | null;
    applyJobTitle: string | null;
    openApplyModal: (jobId: string, jobTitle?: string, router?: any, pathname?: string, isAuthenticated?: boolean) => void;
    closeApplyModal: () => void;
    // Các hàm setter để đồng bộ với URL Handler
    _setApplyModalState: (isOpen: boolean, jobId: string | null, jobTitle: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isApplyModalOpen: false,
    applyJobId: null,
    applyJobTitle: null,

    openApplyModal: (jobId, jobTitle, router, pathname, isAuthenticated) => {
        // Nếu chưa đăng nhập -> Lưu param và văng ra trang Login
        if (isAuthenticated === false && router && pathname) {
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set('applyJobId', jobId);
            const callbackUrl = encodeURIComponent(`${pathname}?${currentParams.toString()}`);
            router.push(`/login?callbackUrl=${callbackUrl}`);
            return;
        }

        // Nếu đã đăng nhập -> Mở modal
        set({
            isApplyModalOpen: true,
            applyJobId: jobId,
            applyJobTitle: jobTitle || 'Vị trí ứng tuyển'
        });
    },

    closeApplyModal: () => {
        set({ isApplyModalOpen: false });
        // setTimeout mô phỏng animation đóng modal của Context cũ
        setTimeout(() => {
            set({ applyJobId: null, applyJobTitle: null });
        }, 300);
    },

    _setApplyModalState: (isOpen, jobId, jobTitle) => set({
        isApplyModalOpen: isOpen,
        applyJobId: jobId,
        applyJobTitle: jobTitle
    })
}));