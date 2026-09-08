
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { jobService } from '@/features/job/job.service';
import { JobFormData } from '@/types';
import JobCampaignForm from '@/components/jobs/JobCampaignForm/JobCampaignForm';
import { mapJobToFormData, mapFormDataToJobPayload } from '@/components/jobs/JobCampaignForm/job-form.utils';
import { ROUTES } from '@/constants/routes';

export default function EditEnterpriseJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: jobId } = use(params);
    const router = useRouter();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState<JobFormData | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const job = await jobService.getJobById(jobId);
                const normalizedFormData = mapJobToFormData(job);
                setInitialData(normalizedFormData);
            } catch (error) {
                toast.error('Không thể tải thông tin chiến dịch');
                router.push(ROUTES.HR_JOBS);
            }
        };
        fetchJob();
    }, [jobId, router]);

    const handleUpdate = async (formData: any) => {
        setIsLoading(true);
        try {
            const payload = mapFormDataToJobPayload(formData, user?.company_id);
            await jobService.updateJob(jobId, payload);
            toast.success('Cập nhật chiến dịch thành công!');
            router.push(ROUTES.HR_JOBS);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi hệ thống khi cập nhật Job');
        } finally {
            setIsLoading(false);
        }
    };

    if (!initialData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <JobCampaignForm
            mode="edit"
            initialData={initialData}
            isSubmitting={isLoading}
            onSubmit={handleUpdate}
            submitLabel="Cập nhật Chiến dịch"
        />
    );
}