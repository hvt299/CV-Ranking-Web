
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { jobService } from '@/features/job/job.service';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getTierBadgeConfig } from '@/utils/tier-colors';
import { useJobList } from '@/features/job/useJob';
import JobCampaignForm from '@/components/jobs/JobCampaignForm/JobCampaignForm';
import { mapFormDataToJobPayload, createInitialJobFormData } from '@/components/jobs/JobCampaignForm/job-form.utils';
import { ROUTES } from '@/constants/routes';

export default function CreateEnterpriseJobPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Logic kiểm soát Hạn mức Tạo Job
    const { jobs } = useJobList();
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');

    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);

    const unlockPlan = plansRes?.data?.find((p: any) => p.features?.can_customize_ai_weights);
    const unlockPlanName = unlockPlan?.name || 'Enterprise';
    const unlockBadgeConfig = getTierBadgeConfig(unlockPlan?.tier_level || 3);

    const maxActiveJobs = currentPlan?.features?.max_active_jobs || 1;
    const activeJobsCount = jobs.filter(job => job.status === 'open' && (!job.deadline || new Date(job.deadline).getTime() > new Date().getTime())).length;
    const isQuotaExceeded = activeJobsCount >= maxActiveJobs;

    const handleCreate = async (formData: any) => {
        setIsLoading(true);
        try {
            const payload = mapFormDataToJobPayload(formData, user?.company_id);
            await jobService.createJob(payload);
            toast.success('Xuất bản chiến dịch tuyển dụng thành công!');
            router.push(ROUTES.HR_JOBS);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi hệ thống khi tạo Job');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <JobCampaignForm
            mode="create"
            initialData={createInitialJobFormData()}
            isSubmitting={isLoading}
            onSubmit={handleCreate}
            submitLabel="Hoàn tất & Xuất bản Job"
            maxActiveJobs={maxActiveJobs}
            isQuotaExceeded={isQuotaExceeded}
            unlockBadgeConfig={unlockBadgeConfig}
            unlockPlanName={unlockPlanName}
        />
    );
}