import { JobFormData } from '@/types';

export interface JobCampaignFormProps {
    mode: 'create' | 'edit';
    initialData?: JobFormData;
    isSubmitting?: boolean;
    onSubmit: (formData: JobFormData) => Promise<void> | void;
    onCancel?: () => void;
    submitLabel?: string;
    
    // Configs cho Create page
    maxActiveJobs?: number;
    isQuotaExceeded?: boolean;
    unlockBadgeConfig?: { bg: string; text: string; border: string; };
    unlockPlanName?: string;
}
