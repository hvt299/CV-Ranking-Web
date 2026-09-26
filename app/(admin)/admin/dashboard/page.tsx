'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Building2, ShieldAlert, Briefcase, ChevronRight, Loader2, Server, Activity, ArrowUpRight } from 'lucide-react';
import { companyService } from '@/features/company/company.service';
import { formatOverviewDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            setCurrentTime(`${timeStr} | ${formatOverviewDate(now)}`);
        };

        updateTime();

        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        companyService.getAdminDashboard()
            .then((res) => setData(res))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-primary-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-text-muted font-medium">Đang thiết lập Trạm Kiểm Soát...</p>
            </div>
        );
    }

    const stats = data?.overview_stats || {};
    const recentCompanies = data?.recent_pending_companies || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 min-h-[calc(100vh-100px)]">
            <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 via-transparent to-info-500/[0.035] pointer-events-none" />
                <div className="absolute top-0 left-10 right-10 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 md:p-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
                                <Activity className="w-3.5 h-3.5" />
                                Admin Control Center
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Trạm Kiểm Soát Hệ Thống</h1>
                        <p className="text-text-muted font-medium mt-2 max-w-2xl">Theo dõi sức khỏe nền tảng, hoạt động tuyển dụng và các doanh nghiệp cần được kiểm duyệt.</p>

                        <div className="flex items-center gap-2 mt-5 text-xs font-bold uppercase tracking-wider text-text-subtle bg-background w-fit px-3 py-2 rounded-xl border border-border shadow-sm">
                            <span className="relative flex w-2 h-2">
                                <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 animate-ping opacity-75" />
                                <span className="relative inline-flex w-2 h-2 rounded-full bg-success-500" />
                            </span>
                            {currentTime}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-background/70 dark:bg-black/10 border border-border p-3 pr-5 shadow-sm backdrop-blur-xl shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 flex items-center justify-center">
                            <Server className="w-5 h-5 text-success-600 dark:text-success-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-subtle">Trạng thái Server</p>
                            <p className="text-sm font-black text-success-600 dark:text-success-400 flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                                Đang hoạt động
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-linear-to-br frfrom-primary-500/2.5ia-transparent to-info-500/2 pointer-events-none" />

                <div className="relative px-5 py-5 lg:px-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center shadow-sm">
                            <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-card-bg animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-base lg:text-lg font-black text-text tracking-tight">Chỉ số hệ thống</h2>
                            <p className="text-xs text-text-subtle mt-1">Tổng quan nhanh về nền tảng tuyển dụng</p>
                        </div>
                    </div>
                </div>

                <div className="relative p-4 lg:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard title="Tổng Người dùng" value={stats.total_users?.value || 0} subtitle={`+${stats.total_users?.trend || 0} trong 30 ngày`} icon={Users} color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-500/10" border="border-primary-100 dark:border-primary-500/20" />
                        <StatCard title="Doanh nghiệp hợp lệ" value={stats.total_companies?.trend || 0} subtitle={`Trên tổng ${stats.total_companies?.value || 0}`} icon={Building2} color="text-success-600 dark:text-success-400" bg="bg-success-50 dark:bg-success-500/10" border="border-success-100 dark:border-success-500/20" />
                        <StatCard title="Chờ duyệt KYC" value={stats.pending_kyc?.value || 0} subtitle="Cần xử lý ngay" icon={ShieldAlert} color="text-warning-600 dark:text-warning-400" bg="bg-warning-50 dark:bg-warning-500/10" border="border-warning-100 dark:border-warning-500/20" highlight={stats.pending_kyc?.value > 0} />
                        <StatCard title="Job đang mở" value={stats.active_jobs?.value || 0} subtitle="Toàn hệ thống" icon={Briefcase} color="text-info-600 dark:text-info-400" bg="bg-info-50 dark:bg-info-500/10" border="border-info-100 dark:border-info-500/20" />
                    </div>
                </div>
            </section>
            <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-linear-to-br from-warning-500/2 via-transparent to-primary-500/2 pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 lg:p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-100 dark:border-warning-500/20 flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                        </div>
                        <div>
                            <h2 className="text-base lg:text-lg font-black text-text tracking-tight">Doanh nghiệp chờ duyệt KYC</h2>
                            <p className="text-xs text-text-subtle mt-1">Các hồ sơ doanh nghiệp cần admin kiểm tra</p>
                        </div>
                    </div>

                    <Link href={ROUTES.ADMIN_COMPANIES} className="inline-flex items-center gap-1.5 w-fit px-3.5 py-2 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-xs font-black text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/15 transition-colors">
                        Xem tất cả
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="relative overflow-x-auto p-3 lg:p-4">
                    {recentCompanies.length > 0 ? (
                        <div className="space-y-3 min-w-170">
                            {recentCompanies.map((company: any, index: number) => (
                                <div key={company.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-background/70 dark:bg-black/10 border border-border hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}>
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt="Logo" className="w-11 h-11 rounded-xl object-cover border border-border shrink-0" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-sm shrink-0">
                                            {company.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{company.name || 'Chưa cập nhật'}</p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                                            <span className="text-xs font-medium text-text-subtle">MST: <span className="font-mono text-text-muted">{company.tax_code || '—'}</span></span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-xs font-medium text-text-subtle">{company.created_at ? new Date(company.created_at).toLocaleDateString('vi-VN') : 'Chưa rõ ngày'}</span>
                                        </div>
                                    </div>

                                    <Link href={ROUTES.ADMIN_COMPANIES} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-xs font-black text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-all shrink-0">
                                        Kiểm duyệt
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-14 text-center">
                            <div className="w-16 h-16 bg-success-50 dark:bg-success-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-success-100 dark:border-success-500/20">
                                <ShieldAlert className="w-8 h-8 text-success-500" />
                            </div>
                            <p className="text-text font-black text-base">Tuyệt vời!</p>
                            <p className="text-sm text-text-subtle mt-1 max-w-md mx-auto">Hệ thống sạch sẽ. Không có doanh nghiệp nào đang chờ duyệt KYC.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg, border, highlight }: any) {
    return (
        <div className={`group relative overflow-hidden bg-background/70 dark:bg-black/10 rounded-2xl border ${highlight ? 'border-warning-400 dark:border-warning-500/60 shadow-[0_8px_28px_-16px_rgba(245,158,11,0.55)]' : 'border-border shadow-[0_6px_22px_-16px_rgba(15,23,42,0.35)] dark:shadow-[0_6px_22px_-16px_rgba(0,0,0,0.8)]'} hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.4)] dark:hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.9)] hover:-translate-y-1 transition-all duration-300`}>
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent group-hover:via-primary-300 dark:group-hover:via-primary-700 transition-colors" />
            <div className={`absolute -right-10 -top-10 w-28 h-28 rounded-full ${bg} opacity-40 group-hover:opacity-80 blur-2xl transition-all duration-500`} />
            {highlight && <div className="absolute inset-y-0 left-0 w-0.5 bg-linear-to-b from-transparent via-warning-500 to-transparent" />}

            <div className="relative p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center border ${border} shadow-sm group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>

                    {highlight && (
                        <span className="relative flex w-2.5 h-2.5 mt-1.5 mr-1">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-warning-400 animate-ping opacity-75" />
                            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-warning-500" />
                        </span>
                    )}
                </div>

                <div className="mt-5">
                    <p className="text-[10px] text-text-subtle font-black uppercase tracking-widest">{title}</p>
                    <div className="flex items-end flex-wrap gap-2 mt-1">
                        <p className="text-3xl font-black text-text tracking-tight">{value}</p>
                        {subtitle && <span className="text-[9px] font-black text-text-subtle bg-card-bg px-2 py-1 rounded-md border border-border">{subtitle}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}