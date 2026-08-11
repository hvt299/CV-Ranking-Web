import { CompanyStatus } from '@/types';
import { CheckCircle, Shield, XCircle, Ban, HelpCircle } from 'lucide-react';

export const COMPANY_SIZES = [
    { value: '1-50', label: '1-50 nhân sự' },
    { value: '51-200', label: '51-200 nhân sự' },
    { value: '201-1000', label: '201-1000 nhân sự' },
    { value: '1000+', label: 'Hơn 1000 nhân sự' }
];

export const COMPANY_STATUS_CONFIG: Record<string, any> = {
    [CompanyStatus.VERIFIED]: {
        label: 'Đã xác minh',
        color: 'bg-success-100 text-success-700 dark:bg-success-500/10 dark:text-success-400',
        icon: CheckCircle
    },
    [CompanyStatus.PENDING_VERIFICATION]: {
        label: 'Đang chờ duyệt',
        color: 'bg-warning-100 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
        icon: Shield
    },
    [CompanyStatus.REJECTED]: {
        label: 'Bị từ chối',
        color: 'bg-error-100 text-error-700 dark:bg-error-500/10 dark:text-error-400',
        icon: XCircle
    },
    [CompanyStatus.SUSPENDED]: {
        label: 'Tạm khóa',
        color: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: Ban
    },
    'default': {
        label: 'Không xác định',
        color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: HelpCircle
    }
};