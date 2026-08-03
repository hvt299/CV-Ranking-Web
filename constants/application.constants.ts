import { ApplicationStatus, NotificationType } from '@/types/common';
import { Briefcase, Clock, Award, CheckCircle2, XCircle, X, FileText, Users, Ban } from 'lucide-react';

export const APPLICATION_STATUS_CONFIG: Record<string, any> = {
    [ApplicationStatus.NEW]: {
        id: ApplicationStatus.NEW,
        label: 'Mới nộp',
        color: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
        borderColor: 'border-sky-500',
        headerBg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
        icon: FileText
    },
    [ApplicationStatus.REVIEWING]: {
        id: ApplicationStatus.REVIEWING,
        label: 'Đang xem xét',
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        borderColor: 'border-amber-500',
        headerBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        icon: Clock
    },
    [ApplicationStatus.INTERVIEW]: {
        id: ApplicationStatus.INTERVIEW,
        label: 'Phỏng vấn',
        color: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
        borderColor: 'border-violet-500',
        headerBg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
        icon: Users
    },
    [ApplicationStatus.OFFERED]: {
        id: ApplicationStatus.OFFERED,
        label: 'Đề nghị (Offer)',
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
        borderColor: 'border-indigo-500',
        headerBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
        icon: Award
    },
    [ApplicationStatus.HIRED]: {
        id: ApplicationStatus.HIRED,
        label: 'Trúng tuyển',
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        borderColor: 'border-emerald-500',
        headerBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        icon: CheckCircle2
    },
    [ApplicationStatus.REJECTED]: {
        id: ApplicationStatus.REJECTED,
        label: 'Từ chối',
        color: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
        borderColor: 'border-red-500',
        headerBg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        icon: XCircle
    },
    [ApplicationStatus.WITHDRAWN]: {
        id: ApplicationStatus.WITHDRAWN,
        label: 'Đã rút hồ sơ',
        color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        borderColor: 'border-slate-500',
        headerBg: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        icon: X
    },
    [ApplicationStatus.EXPIRED]: {
        id: ApplicationStatus.EXPIRED,
        label: 'Hết hạn',
        color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        borderColor: 'border-gray-500',
        headerBg: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        icon: Ban
    }
};

export const KANBAN_COLUMNS = Object.values(APPLICATION_STATUS_CONFIG);

export const NOTIFICATION_CONFIG: Record<string, any> = {
    [NotificationType.SUCCESS]: {
        icon: CheckCircle2,
        color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
    },
    [NotificationType.ERROR]: {
        icon: XCircle,
        color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10'
    },
    [NotificationType.INFO]: {
        icon: Briefcase,
        color: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10'
    },
    [NotificationType.WARNING]: {
        icon: Clock,
        color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10'
    }
};