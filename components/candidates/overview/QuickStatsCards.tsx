'use client';

import Link from 'next/link'; import { Briefcase, Clock, Award, FolderOpen, ArrowUpRight, TrendingUp } from 'lucide-react'; import { ROUTES } from '@/constants/routes';

interface QuickStatsCardsProps {
    applications: any[];
}

export default function QuickStatsCards({ applications }: QuickStatsCardsProps) {
    const totalApplied = applications.length;

    const pending = applications.filter((a) =>
        ['new', 'reviewing'].includes(a.status?.toLowerCase())
    ).length;

    const success = applications.filter((a) =>
        ['interview', 'interviewing', 'offered', 'hired'].includes(a.status?.toLowerCase())
    ).length;

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/[0.035] via-transparent to-info-500/2.5 pointer-events-none" />
            <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

            <div className="relative px-5 py-5 lg:px-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center shadow-sm">
                            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />

                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-card-bg animate-pulse" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base lg:text-lg font-black text-text tracking-tight">
                                    Chỉ số hoạt động
                                </h2>

                                <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20 text-[9px] font-black uppercase tracking-widest">
                                    Tổng quan
                                </span>
                            </div>

                            <p className="text-xs text-text-subtle mt-1">
                                Theo dõi nhanh hành trình ứng tuyển của bạn
                            </p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 w-fit px-3 py-2 rounded-lg bg-background border border-border shadow-sm text-[10px] font-black uppercase tracking-widest text-text-subtle">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 animate-ping opacity-75" />
                            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                        </span>

                        Dữ liệu cập nhật
                    </div>
                </div>
            </div>

            <div className="relative p-4 lg:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                        index={0}
                        title="Việc làm đã nộp"
                        value={totalApplied}
                        icon={Briefcase}
                        color="text-primary-600 dark:text-primary-400"
                        bg="bg-primary-50 dark:bg-primary-500/10"
                        border="border-primary-100 dark:border-primary-500/20"
                        link={ROUTES.APPLICANT_APPLICATIONS}
                    />

                    <StatCard
                        index={1}
                        title="Đang chờ xem xét"
                        value={pending}
                        icon={Clock}
                        color="text-warning-600 dark:text-warning-400"
                        bg="bg-warning-50 dark:bg-warning-500/10"
                        border="border-warning-100 dark:border-warning-500/20"
                        link={ROUTES.APPLICANT_APPLICATIONS}
                    />

                    <StatCard
                        index={2}
                        title="Lọt vào vòng trong"
                        value={success}
                        icon={Award}
                        color="text-success-600 dark:text-success-400"
                        bg="bg-success-50 dark:bg-success-500/10"
                        border="border-success-100 dark:border-success-500/20"
                        link={ROUTES.APPLICANT_APPLICATIONS}
                    />

                    <LibraryCard />
                </div>
            </div>
        </section>
    );
}

interface StatCardProps {
    index: number;
    title: string;
    value: number;
    icon: any;
    color: string;
    bg: string;
    border: string;
    link: string;
}

function StatCard({
    index,
    title,
    value,
    icon: Icon,
    color,
    bg,
    border,
    link,
}: StatCardProps) {
    return (
        <Link
            href={link}
            className="group relative overflow-hidden bg-background/70 dark:bg-black/10 rounded-2xl border border-border shadow-[0_6px_22px_-16px_rgba(15,23,42,0.35)] dark:shadow-[0_6px_22px_-16px_rgba(0,0,0,0.8)] hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.4)] dark:hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.9)] hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent group-hover:via-primary-300 dark:group-hover:via-primary-700 transition-colors" />

            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-primary-500/2.5 group-hover:bg-primary-500/[0.07] blur-2xl transition-colors duration-500" />

            <div className={`absolute inset-y-0 left-0 w-0.5 bg-linear-to-b from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color}`} />

            <div className="relative p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center border ${border} shadow-sm group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-text-subtle opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                <div className="mt-5">
                    <p className="text-[10px] text-text-subtle font-black uppercase tracking-widest">
                        {title}
                    </p>

                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-3xl font-black text-text tracking-tight">
                            {value}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function LibraryCard() {
    return (
        <Link
            href={ROUTES.APPLICANT_CV_LIBRARY}
            className="group relative overflow-hidden bg-background/70 dark:bg-black/10 rounded-2xl border border-border shadow-[0_6px_22px_-16px_rgba(15,23,42,0.35)] dark:shadow-[0_6px_22px_-16px_rgba(0,0,0,0.8)] hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.4)] dark:hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.9)] hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent group-hover:via-info-300 dark:group-hover:via-info-700 transition-colors" />

            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-info-500/[0.035] group-hover:bg-info-500/8 blur-2xl transition-colors duration-500" />

            <div className="absolute inset-y-0 left-0 w-0.5 bg-linear-to-b from-transparent via-info-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-info-50 dark:bg-info-500/10 flex items-center justify-center border border-info-100 dark:border-info-500/20 shadow-sm group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300">
                        <FolderOpen className="w-5 h-5 text-info-600 dark:text-info-400" />
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-text-subtle opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                <div className="mt-5">
                    <p className="text-[10px] text-text-subtle font-black uppercase tracking-widest">
                        Thư viện CV
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                        <p className="text-sm font-black text-info-600 dark:text-info-400 group-hover:text-info-700 dark:group-hover:text-info-300 transition-colors">
                            Quản lý hồ sơ
                        </p>

                        <ArrowUpRight className="w-3.5 h-3.5 text-info-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}