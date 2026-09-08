import { ApplicationStatus, NotificationType } from '@/types/common';
import { Award, Ban, Briefcase, CheckCircle2, Clock, FileText, Users, X, XCircle } from 'lucide-react';

export const APPLICATION_STATUS_CONFIG: Record<string, any> = {
    [ApplicationStatus.NEW]: {
        id: ApplicationStatus.NEW,
        label: 'Mới nộp',
        color: 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-400',
        borderColor: 'border-info-500',
        headerBg: 'bg-info-50 dark:bg-info-500/5',
        headerText: 'text-info-700 dark:text-info-400',
        icon: FileText,
    },

    [ApplicationStatus.REVIEWING]: {
        id: ApplicationStatus.REVIEWING,
        label: 'Đang xem xét',
        color: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
        borderColor: 'border-warning-500',
        headerBg: 'bg-warning-50 dark:bg-warning-500/5',
        headerText: 'text-warning-700 dark:text-warning-400',
        icon: Clock,
    },

    [ApplicationStatus.INTERVIEW]: {
        id: ApplicationStatus.INTERVIEW,
        label: 'Phỏng vấn',
        color: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400',
        borderColor: 'border-primary-500',
        headerBg: 'bg-primary-50 dark:bg-primary-500/5',
        headerText: 'text-primary-700 dark:text-primary-400',
        icon: Users,
    },

    [ApplicationStatus.OFFERED]: {
        id: ApplicationStatus.OFFERED,
        label: 'Đề nghị (Offer)',
        color: 'bg-hot-50 text-hot-700 dark:bg-hot-500/10 dark:text-hot-400',
        borderColor: 'border-hot-500',
        headerBg: 'bg-hot-50 dark:bg-hot-500/5',
        headerText: 'text-hot-700 dark:text-hot-400',
        icon: Award,
    },

    [ApplicationStatus.HIRED]: {
        id: ApplicationStatus.HIRED,
        label: 'Trúng tuyển',
        color: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
        borderColor: 'border-success-500',
        headerBg: 'bg-success-50 dark:bg-success-500/5',
        headerText: 'text-success-700 dark:text-success-400',
        icon: CheckCircle2,
    },

    [ApplicationStatus.REJECTED]: {
        id: ApplicationStatus.REJECTED,
        label: 'Từ chối',
        color: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
        borderColor: 'border-error-500',
        headerBg: 'bg-error-50 dark:bg-error-500/5',
        headerText: 'text-error-700 dark:text-error-400',
        icon: XCircle,
    },

    [ApplicationStatus.WITHDRAWN]: {
        id: ApplicationStatus.WITHDRAWN,
        label: 'Đã rút hồ sơ',
        color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        borderColor: 'border-slate-400',
        headerBg: 'bg-slate-100 dark:bg-slate-800/60',
        headerText: 'text-slate-600 dark:text-slate-400',
        icon: X,
    },

    [ApplicationStatus.EXPIRED]: {
        id: ApplicationStatus.EXPIRED,
        label: 'Hết hạn',
        color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        borderColor: 'border-slate-500',
        headerBg: 'bg-slate-100 dark:bg-slate-800/60',
        headerText: 'text-slate-500 dark:text-slate-400',
        icon: Ban,
    },
};

export const KANBAN_COLUMNS = Object.values(APPLICATION_STATUS_CONFIG);

export const NOTIFICATION_CONFIG: Record<string, any> = {
    [NotificationType.SUCCESS]: {
        icon: CheckCircle2,
        color: 'text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-500/10',
    },

    [NotificationType.ERROR]: {
        icon: XCircle,
        color: 'text-error-600 bg-error-50 dark:text-error-400 dark:bg-error-500/10',
    },

    [NotificationType.INFO]: {
        icon: Briefcase,
        color: 'text-info-600 bg-info-50 dark:text-info-400 dark:bg-info-500/10',
    },

    [NotificationType.WARNING]: {
        icon: Clock,
        color: 'text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-500/10',
    },
};