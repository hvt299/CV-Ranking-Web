import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
    iconClassName?: string;
    animate?: 'bounce' | 'spin' | 'pulse' | 'float' | 'none';
}

export function EmptyState({ icon: Icon, title, description, action, className, iconClassName, animate = 'float' }: EmptyStateProps) {
    const animationClass = {
        bounce: 'animate-bounce',
        spin: 'animate-spin-slow',
        pulse: 'animate-pulse',
        float: 'animate-[bounce_3s_infinite]',
        none: '',
    }[animate];

    return (
        <div className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 ${className || ''}`}>
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className={`relative bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-xl shadow-blue-500/10 border border-slate-100 dark:border-slate-700 ${animationClass}`}>
                    <Icon className={`w-12 h-12 text-blue-500 dark:text-blue-400 ${iconClassName || ''}`} strokeWidth={1.5} />
                </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
}
