import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/features/subscription/subscription.service';
import { useAuthStore } from '@/store/useAuthStore';

export const useSubscription = () => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ['my-subscription'],
        queryFn: () => subscriptionService.getMyPlan(),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
};