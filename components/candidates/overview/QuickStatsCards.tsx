'use client';

import Link from 'next/link';
import { Briefcase, Clock, Award, FolderOpen, ArrowRight } from 'lucide-react';

interface QuickStatsCardsProps {
    applications: any[];
}

export default function QuickStatsCards({ applications }: QuickStatsCardsProps) {
    const totalApplied = applications.length;
    const pending = applications.filter(a => ['new', 'reviewing'].includes(a.status?.toLowerCase())).length;
    const success = applications.filter(a => ['interview', 'interviewing', 'offered', 'hired'].includes(a.status?.toLowerCase())).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Việc làm đã nộp"
                value={totalApplied}
                icon={Briefcase}
                colorClass="text-primary-600 bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400"
                link="/my-applications"
            />
            <StatCard
                title="Đang chờ xem xét"
                value={pending}
                icon={Clock}
                colorClass="text-warning-600 bg-warning-100 dark:bg-warning-500/10 dark:text-warning-400"
                link="/my-applications"
            />
            <StatCard
                title="Lọt vào vòng trong"
                value={success}
                icon={Award}
                colorClass="text-success-600 bg-success-100 dark:bg-success-500/10 dark:text-success-400"
                link="/my-applications"
            />

            {/* Card đặc biệt điều hướng sang CV Library */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-info-300 dark:hover:border-info-700 transition-all group">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-info-100 dark:bg-info-500/10 flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-info-600 dark:text-info-400" />
                    </div>
                </div>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mb-1">Thư viện CV</p>
                    <Link href="/cv-library" className="inline-flex items-center gap-1.5 text-sm font-black text-info-600 dark:text-info-400 group-hover:text-info-700 dark:group-hover:text-info-300 transition-colors">
                        Quản lý hồ sơ <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, colorClass, link }: any) {
    return (
        <Link href={link} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{title}</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white mt-1 group-hover:scale-105 origin-left transition-transform">{value}</p>
            </div>
        </Link>
    );
}