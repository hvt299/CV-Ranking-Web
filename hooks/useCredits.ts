import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

export function useCredits() {
    const queryClient = useQueryClient();

    const { data: subscription, isLoading } = useQuery({
        queryKey: ['my-subscription'],
        queryFn: async () => {
            const res = await apiClient.get('/subscriptions/my-plan');
            return res.data?.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    // Trạm kiểm soát Client-side: Chặn bấm nút nếu không đủ tiền
    const checkCredits = (cost: number, actionName: string = "Tính năng này") => {
        if (!subscription) return false;

        // Bỏ qua check cho Admin
        if (subscription.entity_type === 'admin') return true;

        if (subscription.credits_remaining < cost) {
            toast.error(`${actionName} yêu cầu ${cost} Credit AI. Số dư hiện tại không đủ, vui lòng nạp thêm!`, { duration: 4000 });
            // TODO: Bắn event mở Modal Top-up tại đây (Zustand)
            return false;
        }
        return true;
    };

    // Gọi sau khi trừ tiền thành công để UI tự update Header tức thì
    const invalidateCredits = () => {
        queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
    };

    // Trích xuất thông tin gói để khóa UI (ProFeatureLock)
    const isPro = subscription?.current_plan_code && subscription.current_plan_code !== 'hr_free' && subscription.current_plan_code !== 'app_free';

    // Feature flag cụ thể cho AI Mentor
    const canUseAiCvReview = subscription?.features?.can_use_ai_cv_review === true;

    return { subscription, isLoading, checkCredits, invalidateCredits, isPro, canUseAiCvReview };
}