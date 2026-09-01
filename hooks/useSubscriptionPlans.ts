import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/features/subscription/subscription.service';

export const useSubscriptionPlans = (target: 'hr' | 'applicant') => {
    return useQuery({
        queryKey: ['subscription-plans', target],
        queryFn: () => subscriptionService.getPlans(target),
        staleTime: 10 * 60 * 1000,
    });
};