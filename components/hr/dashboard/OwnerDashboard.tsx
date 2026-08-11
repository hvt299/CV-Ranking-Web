'use client';

import { useState, useEffect } from 'react';
import { Briefcase, FileText, Sparkles, Users, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { APPLICATION_STATUS_CONFIG } from '@/constants/application.constants';

export default function OwnerDashboard({
    currentTime
}: {
    currentTime: string;
}) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await apiClient.get('/jobs/dashboard/metrics?scope=company');
                setData(res.data.data);
            } catch (error) {
                console.error("Lỗi khi tải Dashboard Metrics:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-primary-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Đang tải dữ liệu tổng quan...</p>
            </div>
        );
    }

    const stats = data?.overview_stats || {};
    const pipelines = data?.active_pipelines || [];
    const recentApps = data?.recent_applicants || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        Tổng quan Doanh nghiệp
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
                        {currentTime}
                    </p>
                </div>

                <Link
                    href="/jobs/create"
                    className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
                >
                    + Tạo chiến dịch mới
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Chiến dịch đang mở" value={stats.active_jobs?.value || 0} trend={stats.active_jobs} icon={Briefcase} color="text-info-600" bg="bg-info-50 dark:bg-info-500/10" />
                <StatCard title="Tổng CV trong Kho" value={stats.total_cvs?.value || 0} trend={stats.total_cvs} icon={FileText} color="text-primary-600" bg="bg-primary-50 dark:bg-primary-500/10" />
                <StatCard title="CV Chất lượng (AI > 80đ)" value={stats.high_quality_cvs?.value || 0} trend={stats.high_quality_cvs} icon={Sparkles} color="text-warning-600" bg="bg-warning-50 dark:bg-warning-500/10" />
                <StatCard title="Tổng Chuyên viên HR" value={stats.total_hr?.value || 0} icon={Users} color="text-success-600" bg="bg-success-50 dark:bg-success-500/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* CỘT TRÁI: Tiến độ chiến dịch */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="text-lg font-black text-slate-800 dark:text-white">Tiến độ Chiến dịch đang mở</h2>
                        <Link href="/jobs" className="text-sm font-bold text-primary-600 hover:underline">Xem tất cả</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                                <tr>
                                    <th className="p-4 pl-6">Chiến dịch</th>
                                    <th className="p-4 text-center">CV Mới</th>
                                    <th className="p-4 text-center">Đã Tuyển</th>
                                    <th className="p-4 text-center">Tiến độ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {pipelines.map((job: any) => {
                                    const progress = job.target_hiring > 0 ? Math.min(100, (job.current_hired / job.target_hiring) * 100) : 0;
                                    return (
                                        <tr key={job.job_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="p-4 pl-6 font-bold text-sm text-slate-800 dark:text-white">
                                                <Link href={`/jobs/${job.job_id}`} className="hover:text-primary-600 transition-colors">{job.title}</Link>
                                                <div className="text-xs font-medium text-slate-500 mt-1">Tổng: {job.total_cvs} CV</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400 font-bold px-2.5 py-1 rounded-lg text-xs">+{job.new_cvs}</span>
                                            </td>
                                            <td className="p-4 text-center font-bold text-sm text-slate-700 dark:text-slate-300">
                                                {job.current_hired} / {job.target_hiring > 0 ? job.target_hiring : '∞'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-success-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{progress.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CỘT PHẢI: Hồ sơ mới nhất */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-black text-slate-800 dark:text-white">Hồ sơ ứng tuyển mới</h2>
                    </div>
                    <div className="p-4 space-y-3 flex-1">
                        {recentApps.map((app: any) => {
                            const config = APPLICATION_STATUS_CONFIG[app.status] || APPLICATION_STATUS_CONFIG['new'];
                            return (
                                <Link key={app.id} href={`/jobs/${app.job_id}`} className="block p-3 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-sm text-slate-800 dark:text-white truncate pr-2">{app.candidate_name}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold shrink-0 ${config.color} ${config.borderColor}`}>{config.label}</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500 truncate mb-2">{app.job_title}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${app.ai_score >= 80 ? 'bg-success-500' : app.ai_score >= 50 ? 'bg-warning-500' : 'bg-error-500'}`} style={{ width: `${app.ai_score}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{app.ai_score?.toFixed(0)}đ</span>
                                    </div>
                                </Link>
                            )
                        })}
                        {recentApps.length === 0 && (
                            <div className="text-center py-10 text-slate-500 text-sm font-medium">Chưa có ứng viên mới.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg, trend }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                {trend && trend.trend > 0 && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.is_up ? 'text-success-600 bg-success-50 dark:bg-success-500/10' : 'text-error-600 bg-error-50 dark:bg-error-500/10'}`}>
                        {trend.is_up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trend.trend}%
                    </div>
                )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">{value}</p>
        </div>
    );
}