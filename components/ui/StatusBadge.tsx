'use client';

import { ApplicationStatus } from '@/types';
import { STATUS_CONFIG } from '@/constants/application.constants';

interface StatusBadgeProps {
    status: string;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
};

export default function StatusBadge({ status, showIcon = true, size = 'md' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[ApplicationStatus.NEW];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.color} ${SIZE_CLASSES[size]}`}>
            {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
            {config.label}
        </span>
    );
}