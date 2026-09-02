'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { cn } from '@/utils/utils';

interface ProFeatureLockProps {
    title?: string;
    description?: string;
    requiredTierName?: string;
    requiredTierLevel?: number; // 1 (Growth/Premium) hoặc 2+ (Enterprise/VIP)
}

export default function ProFeatureLock({
    title = "Tính năng khóa",
    description = "Nâng cấp gói cước để mở khóa sức mạnh AI, tối ưu hóa trải nghiệm và hiệu suất của bạn.",
    requiredTierName = "PRO",
    requiredTierLevel = 2
}: ProFeatureLockProps) {
    const { user } = useAuthStore();
    const isHR = user?.role === UserRole.HR_OWNER || user?.role === UserRole.HR_MEMBER;
    const billingRoute = isHR ? '/hr/billing' : '/applicant/billing';

    const isEnterprise = requiredTierLevel >= 2;

    const themeColors = {
        iconBg: isEnterprise ? "bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-800" : "bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800",
        iconColor: isEnterprise ? "text-warning-500" : "text-primary-500",
        badgeStyle: isEnterprise ? "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-warning-500/30" : "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30",
        buttonStyle: isEnterprise ? "bg-warning-500 hover:bg-warning-600 text-white shadow-warning-500/25" : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/25",
    };

    return (
        <div className="absolute inset-0 z-5 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm bg-white/50 dark:bg-slate-900/60 rounded-3xl">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-300">

                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg", themeColors.iconBg)}>
                    <Lock className={cn("w-8 h-8", themeColors.iconColor)} />
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                    {title}
                    <span className={cn("ml-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm", themeColors.badgeStyle)}>
                        {requiredTierName}
                    </span>
                </h3>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    {description}
                </p>

                <Link
                    href={billingRoute}
                    className={cn("w-full py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all", themeColors.buttonStyle)}
                >
                    <Sparkles className="w-4 h-4" /> Nâng cấp để Mở khóa <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}