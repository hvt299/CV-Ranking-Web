'use client';

import { CheckCircle2, Clock, XCircle, AlertTriangle, Briefcase, Award } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG = {
    'Mới': {
        color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
        icon: Briefcase
    },
    'Đang xem xét': {
        color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
        icon: Clock
    },
    'Phỏng vấn': {
        color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
        icon: AlertTriangle
    },
    'Đề nghị (Offer)': {
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
        icon: Award
    },
    'Trúng tuyển': {
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        icon: CheckCircle2
    },
    'Từ chối': {
        color: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
        icon: XCircle
    }
};

const SIZE_CLASSES = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
};

export default function StatusBadge({ status, showIcon = false, size = 'md' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
        color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600',
        icon: Briefcase
    };

    const IconComponent = config.icon;
    const sizeClass = SIZE_CLASSES[size];

    return (
        <span className={`inline-flex items-center gap-1.5 font-bold border rounded-lg ${config.color} ${sizeClass}`}>
            {showIcon && <IconComponent className="w-3 h-3" />}
            {status}
        </span>
    );
}