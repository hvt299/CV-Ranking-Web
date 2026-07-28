import { ApplicationStatus, NotificationType } from '@/types/common';
import { Briefcase, Clock, AlertTriangle, Award, CheckCircle2, XCircle, X } from 'lucide-react';

export const CV_STATUS_OPTIONS = [
    { value: ApplicationStatus.NEW, label: 'Mới nộp', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
    { value: ApplicationStatus.REVIEWING, label: 'Đang xem xét', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
    { value: ApplicationStatus.INTERVIEW, label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' },
    { value: ApplicationStatus.OFFERED, label: 'Đề nghị (Offer)', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' },
    { value: ApplicationStatus.HIRED, label: 'Trúng tuyển', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { value: ApplicationStatus.REJECTED, label: 'Từ chối', color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' },
    { value: ApplicationStatus.WITHDRAWN, label: 'Đã rút hồ sơ', color: 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400' },
];

export const KANBAN_COLUMNS = [
    { id: ApplicationStatus.NEW, label: 'Mới nộp', borderColor: 'border-blue-500', headerBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
    { id: ApplicationStatus.REVIEWING, label: 'Đang xem xét', borderColor: 'border-amber-500', headerBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
    { id: ApplicationStatus.INTERVIEW, label: 'Phỏng vấn', borderColor: 'border-purple-500', headerBg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
    { id: ApplicationStatus.OFFERED, label: 'Đề nghị (Offer)', borderColor: 'border-indigo-500', headerBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' },
    { id: ApplicationStatus.HIRED, label: 'Trúng tuyển', borderColor: 'border-emerald-500', headerBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
    { id: ApplicationStatus.REJECTED, label: 'Từ chối', borderColor: 'border-rose-500', headerBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400' },
];

export const STATUS_CONFIG: Record<string, any> = {
    [ApplicationStatus.NEW]: {
        color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
        label: 'Mới',
        icon: Briefcase
    },
    [ApplicationStatus.REVIEWING]: {
        color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
        label: 'Đang xem xét',
        icon: Clock
    },
    [ApplicationStatus.INTERVIEW]: {
        color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
        label: 'Phỏng vấn',
        icon: AlertTriangle
    },
    [ApplicationStatus.OFFERED]: {
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
        label: 'Đề nghị (Offer)',
        icon: Award
    },
    [ApplicationStatus.HIRED]: {
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        label: 'Trúng tuyển',
        icon: CheckCircle2
    },
    [ApplicationStatus.REJECTED]: {
        color: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
        label: 'Từ chối',
        icon: XCircle
    },
    [ApplicationStatus.WITHDRAWN]: {
        color: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
        label: 'Đã rút',
        icon: X
    }
};

export const NOTIFICATION_ICONS = {
    [NotificationType.SUCCESS]: CheckCircle2,
    [NotificationType.ERROR]: XCircle,
    [NotificationType.INFO]: Briefcase,
    [NotificationType.WARNING]: Clock
};

export const NOTIFICATION_COLORS = {
    [NotificationType.SUCCESS]: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10',
    [NotificationType.ERROR]: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10',
    [NotificationType.INFO]: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10',
    [NotificationType.WARNING]: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10'
};