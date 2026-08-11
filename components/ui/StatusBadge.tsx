import { FileText } from 'lucide-react';
import { APPLICATION_STATUS_CONFIG } from '@/constants/application.constants';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = APPLICATION_STATUS_CONFIG[status] ||
        APPLICATION_STATUS_CONFIG[status.toLowerCase()] ||
    {
        label: status,
        color: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        icon: FileText
    };

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}