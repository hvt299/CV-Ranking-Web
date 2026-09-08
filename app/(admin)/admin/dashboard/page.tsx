'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, ShieldAlert, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
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
            .then(res => setData(res))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div className="flex justify-center py-20 text-slate-500"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    const stats = data?.overview_stats || {};
    const recentCompanies = data?.recent_pending_companies || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Trạm Kiểm Soát Hệ Thống</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
                        {currentTime}
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng Người dùng" value={stats.total_users?.value || 0} subtitle={`+${stats.total_users?.trend || 0} trong 30 ngày`} icon={Users} color="text-primary-600" bg="bg-primary-50 dark:bg-primary-500/10" />
                <StatCard title="Doanh nghiệp hợp lệ" value={stats.total_companies?.trend || 0} subtitle={`Trên tổng ${stats.total_companies?.value || 0}`} icon={Building2} color="text-success-600" bg="bg-success-50 dark:bg-success-500/10" />
                <StatCard title="Chờ duyệt KYC" value={stats.pending_kyc?.value || 0} subtitle="Cần xử lý ngay" icon={ShieldAlert} color="text-error-600" bg="bg-error-50 dark:bg-error-500/10" highlight={stats.pending_kyc?.value > 0} />
                <StatCard title="Job đang mở" value={stats.active_jobs?.value || 0} subtitle="Toàn hệ thống" icon={Briefcase} color="text-info-600" bg="bg-info-50 dark:bg-info-500/10" />
            </div>

            {/* Bảng Hành động nhanh (Action Board) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        Doanh nghiệp chờ duyệt mới nhất
                    </h2>
                    <Link href={ROUTES.ADMIN_COMPANIES} className="text-sm font-bold text-primary-600 hover:underline flex items-center">Xem tất cả <ChevronRight className="w-4 h-4" /></Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="p-4 pl-6">Doanh nghiệp</th>
                                <th className="p-4">Mã số thuế</th>
                                <th className="p-4">Ngày đăng ký</th>
                                <th className="p-4 text-right pr-6">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentCompanies.map((c: any) => (
                                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 pl-6 font-bold text-sm text-slate-800 dark:text-white">
                                        {c.name}
                                    </td>
                                    <td className="p-4 font-mono text-sm">{c.tax_code}</td>
                                    <td className="p-4 text-xs font-medium text-slate-500">{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td className="p-4 text-right pr-6">
                                        <Link href={ROUTES.ADMIN_COMPANIES} className="px-3 py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg text-xs font-bold transition-colors">
                                            Kiểm duyệt
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {recentCompanies.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Tuyệt vời! Không có doanh nghiệp nào đang chờ duyệt.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg, highlight }: any) {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border ${highlight ? 'border-error-300 dark:border-error-700 shadow-md shadow-error-500/10' : 'border-slate-200 dark:border-slate-800 shadow-sm'} flex flex-col justify-center relative overflow-hidden group`}>
            {highlight && <div className="absolute top-0 left-0 w-full h-1 bg-error-500"></div>}
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">{value}</p>
            {subtitle && <p className="text-xs font-medium text-slate-400 mt-2">{subtitle}</p>}
        </div>
    );
}