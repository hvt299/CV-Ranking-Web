'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Loader2, Briefcase, Users, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { APPLICATION_STATUS_CONFIG } from '@/constants/application.constants';

export default function MemberWorkspace({
    currentTime
}: {
    currentTime: string;
}) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await apiClient.get('/jobs/dashboard/metrics?scope=me');
                setData(res.data.data);
            } catch (error) {
                console.error("Lỗi khi tải Workspace:", error);
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
                <p className="text-slate-500 font-medium">Đang chuẩn bị bàn làm việc của bạn...</p>
            </div>
        );
    }

    const stats = data?.todo_stats || {};
    const assignedJobs = data?.assigned_jobs || [];
    const schedule = data?.today_schedule || [];
    const recentApps = data?.recent_applicants || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        Bàn làm việc của tôi
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
                        {currentTime}
                    </p>
                </div>

                <Link
                    href="/candidates"
                    className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
                >
                    Mở Kho hồ sơ
                </Link>
            </div>

            {/* 4 Thẻ Chỉ Số (Quick Stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="CV Mới cần duyệt"
                    value={stats.new_cvs_to_review || 0}
                    icon={Clock}
                    color="text-error-600"
                    bg="bg-error-50 dark:bg-error-500/10"
                    highlight={stats.new_cvs_to_review > 0}
                />
                <StatCard
                    title="Lịch Phỏng vấn (Tuần)"
                    value={stats.interviews_this_week || 0}
                    icon={Users}
                    color="text-warning-600"
                    bg="bg-warning-50 dark:bg-warning-500/10"
                />
                <StatCard
                    title="Chiến dịch phụ trách"
                    value={stats.total_assigned_jobs || 0}
                    icon={Briefcase}
                    color="text-info-600"
                    bg="bg-info-50 dark:bg-info-500/10"
                />
                <StatCard
                    title="Tổng CV đang quản lý"
                    value={stats.total_cvs_managed || 0}
                    icon={FileText}
                    color="text-success-600"
                    bg="bg-success-50 dark:bg-success-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CỘT TRÁI (Rộng hơn): Chiến dịch & Ứng viên */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Bảng Chiến dịch đang phụ trách */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-black text-slate-800 dark:text-white">Chiến dịch đang phụ trách</h2>
                            <Link href="/jobs" className="text-sm font-bold text-primary-600 hover:underline">Xem bảng Kanban</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                                    <tr>
                                        <th className="p-4 pl-6">Vị trí tuyển dụng</th>
                                        <th className="p-4 text-center">CV Chưa xử lý</th>
                                        <th className="p-4 text-center">Tiến độ (Hired)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {assignedJobs.map((job: any) => {
                                        const progress = job.target_hiring > 0 ? Math.min(100, (job.current_hired / job.target_hiring) * 100) : 0;
                                        return (
                                            <tr key={job.job_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-sm text-slate-800 dark:text-white">
                                                    <Link href={`/jobs/${job.job_id}`} className="hover:text-primary-600 transition-colors">{job.title}</Link>
                                                    <div className="text-xs font-medium text-slate-500 mt-1">Tổng: {job.total_cvs} ứng viên tham gia</div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {job.new_cvs > 0 ? (
                                                        <span className="bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400 font-bold px-2.5 py-1 rounded-lg text-xs animate-pulse">+ {job.new_cvs} mới</span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs font-bold">Đã xem hết</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-success-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{job.current_hired}/{job.target_hiring > 0 ? job.target_hiring : '∞'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {assignedJobs.length === 0 && (
                                        <tr><td colSpan={3} className="p-8 text-center text-slate-500 font-medium">Bạn chưa được phân công chiến dịch nào.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bảng Ứng viên mới chuyển đến */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-black text-slate-800 dark:text-white">Hồ sơ ứng tuyển mới nhất</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {recentApps.map((app: any) => {
                                const config = APPLICATION_STATUS_CONFIG[app.status] || APPLICATION_STATUS_CONFIG['new'];
                                return (
                                    <Link key={app.id} href={`/jobs/${app.job_id}`} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{app.candidate_name}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold shrink-0 ${config.color} ${config.borderColor}`}>{config.label}</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 truncate">{app.job_title}</p>
                                        </div>
                                        <div className="w-24 shrink-0 flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-bold text-slate-400">AI MATCH</span>
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${app.ai_score >= 80 ? 'bg-success-500' : app.ai_score >= 50 ? 'bg-warning-500' : 'bg-error-500'}`} style={{ width: `${app.ai_score}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{app.ai_score?.toFixed(0)}đ</span>
                                            </div>
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

                {/* CỘT PHẢI: Lịch trình (Timeline) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-fit sticky top-24 flex flex-col">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-500" /> Lịch trình hôm nay
                    </h2>

                    <div className="space-y-4">
                        {schedule.length > 0 ? schedule.map((item: any, idx: number) => (
                            <div key={idx} className={`p-4 rounded-2xl border ${item.type === 'interview' ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-100 dark:border-primary-900/50' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
                                <p className={`text-xs font-black mb-1 ${item.type === 'interview' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>
                                    {item.time}
                                </p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.title}</p>
                                <p className="text-xs font-medium text-slate-500 mt-1">{item.subtitle}</p>
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <CheckCircle2 className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500 font-bold text-sm">Trống lịch</p>
                                <p className="text-xs text-slate-400 mt-1">Bạn không có lịch hẹn nào hôm nay!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg, highlight }: any) {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border ${highlight ? 'border-error-300 dark:border-error-700 shadow-md shadow-error-500/10' : 'border-slate-200 dark:border-slate-800 shadow-sm'} flex flex-col justify-center hover:shadow-md transition-all group relative overflow-hidden`}>
            {highlight && <div className="absolute top-0 left-0 w-full h-1 bg-error-500"></div>}
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">{value}</p>
        </div>
    );
}