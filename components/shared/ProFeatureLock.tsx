'use client';

import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProFeatureLockProps {
    title?: string;
    description?: string;
}

export default function ProFeatureLock({
    title = "Tính năng dành riêng cho gói PRO",
    description = "Nâng cấp không gian làm việc của bạn với sức mạnh phân tích từ AI. Mở khóa dữ liệu, tối ưu hóa toàn bộ phễu tuyển dụng."
}: ProFeatureLockProps) {
    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md bg-white/40 dark:bg-slate-900/60 rounded-3xl">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-warning-200 dark:border-warning-900/50 max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-warning-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="w-16 h-16 bg-warning-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-warning-500/30">
                    <Lock className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                    {title}
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm">
                        Pro
                    </span>
                </h3>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    {description}
                </p>

                <Link
                    href="/pricing"
                    className="w-full py-3.5 bg-warning-500 hover:bg-warning-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-warning-500/25 transition-all"
                >
                    <Sparkles className="w-4 h-4" /> Nâng cấp ngay <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}