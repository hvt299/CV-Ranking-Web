'use client';

import { useState, useEffect } from 'react';
import { Activity, Briefcase, FileText, Sparkles, Users, TrendingUp, TrendingDown, Loader2, Plus, ArrowUpRight, Circle, Radio, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { APPLICATION_STATUS_CONFIG } from '@/constants/application.constants';
import { ROUTES } from '@/constants/routes';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useJobList } from '@/features/job/useJob';
import OwnerAnalytics from './OwnerAnalytics';

export default function OwnerDashboard({ currentTime }: { currentTime: string }) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { jobs } = useJobList();
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');

    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const maxActiveJobs = currentPlan?.features?.max_active_jobs || 1;

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await apiClient.get(`/jobs/dashboard/metrics?scope=company&t=${Date.now()}`);
                setData(res.data.data);
            } catch (error) {
                console.error('Lỗi khi tải Dashboard Metrics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center text-primary-500">
                <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary-500/10 animate-ping" />
                    <div className="relative w-16 h-16 rounded-2xl bg-card-bg border border-primary-200 dark:border-primary-500/30 shadow-lg shadow-primary-500/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                </div>
                <p className="text-text font-bold mt-5">Đang tải dữ liệu tổng quan...</p>
                <p className="text-text-subtle text-sm mt-1">Đang đồng bộ dữ liệu tuyển dụng</p>
            </div>
        );
    }

    const stats = data?.overview_stats || {};
    const pipelines = data?.active_pipelines || [];
    const recentApps = data?.recent_applicants || [];

    const activeJobsCount = jobs.filter((job) => job.status === 'open' && (!job.deadline || new Date(job.deadline).getTime() > Date.now())).length;
    const isJobLimitReached = activeJobsCount >= maxActiveJobs;

    return (
        <div className="w-full space-y-6 pb-10 min-h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-2 duration-500">
            <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)] dark:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)]">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-info-500/5 blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-br from-primary-500/[0.07] via-transparent to-info-500/5 pointer-events-none" />

                <div className="relative p-6 lg:p-8">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex relative w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white items-center justify-center shadow-lg shadow-primary-600/25 shrink-0 overflow-hidden">
                                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                <Activity className="relative w-7 h-7" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-2xl lg:text-3xl font-black text-text tracking-tight">Tổng quan Doanh nghiệp</h1>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 text-success-600 dark:text-success-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <span className="relative flex w-1.5 h-1.5">
                                            <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 opacity-75 animate-ping" />
                                            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                                        </span>
                                        Đang hoạt động
                                    </span>
                                </div>

                                <p className="text-sm text-text-muted max-w-2xl">Theo dõi hoạt động tuyển dụng và tình trạng các chiến dịch của doanh nghiệp theo thời gian thực.</p>

                                <div className="flex flex-wrap items-center gap-3 mt-4">
                                    <div className="inline-flex items-center gap-2 text-xs font-bold text-text-muted bg-background/80 border border-border rounded-lg px-3 py-1.5 shadow-sm">
                                        <Circle className="w-2 h-2 fill-success-500 text-success-500" />
                                        {currentTime}
                                    </div>

                                    <div className="hidden sm:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-subtle">
                                        <Radio className="w-3.5 h-3.5 text-success-500 animate-pulse" />
                                        Hệ thống trực tuyến
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            {isJobLimitReached ? (
                                <div className="relative group/btn cursor-not-allowed">
                                    <button type="button" disabled className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 text-text-subtle font-bold rounded-xl cursor-not-allowed border border-border shadow-sm">
                                        <Plus className="w-4 h-4" />
                                        Tạo chiến dịch mới
                                    </button>

                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                                        Đã đạt giới hạn gói cước
                                    </div>
                                </div>
                            ) : (
                                <Link href={ROUTES.HR_JOB_CREATE} className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/35 hover:-translate-y-0.5">
                                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                                    Tạo chiến dịch mới
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-linear-to-br from-primary-500/[0.035] via-transparent to-info-500/2.5 pointer-events-none" />
                <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

                <div className="relative px-5 py-5 lg:px-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center shadow-sm">
                                <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-card-bg animate-pulse" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base lg:text-lg font-black text-text tracking-tight">Tổng quan hệ thống</h2>
                                    <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20 text-[9px] font-black uppercase tracking-widest">Chỉ số chính</span>
                                </div>
                                <p className="text-xs text-text-subtle mt-1">Các chỉ số chính của hệ thống tuyển dụng</p>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 w-fit px-3 py-2 rounded-lg bg-background border border-border shadow-sm text-[10px] font-black uppercase tracking-widest text-text-subtle">
                            <span className="relative flex w-1.5 h-1.5">
                                <span className="absolute inline-flex w-full h-full rounded-full bg-primary-400 animate-ping opacity-75" />
                                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary-500" />
                            </span>
                            Dữ liệu thời gian thực
                        </div>
                    </div>
                </div>

                <div className="relative p-4 lg:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard index={0} title="Chiến dịch đang mở" value={stats.active_jobs?.value || 0} trend={stats.active_jobs} icon={Briefcase} color="text-info-600 dark:text-info-400" bg="bg-info-50 dark:bg-info-500/10" border="border-info-100 dark:border-info-500/20" />
                        <StatCard index={1} title="Tổng CV trong kho" value={stats.total_cvs?.value || 0} trend={stats.total_cvs} icon={FileText} color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-500/10" border="border-primary-100 dark:border-primary-500/20" />
                        <StatCard index={2} title="CV chất lượng cao" value={stats.high_quality_cvs?.value || 0} trend={stats.high_quality_cvs} icon={Sparkles} color="text-warning-600 dark:text-warning-400" bg="bg-warning-50 dark:bg-warning-500/10" border="border-warning-100 dark:border-warning-500/20" />
                        <StatCard index={3} title="Tổng chuyên viên HR" value={stats.total_hr?.value || 0} trend={stats.total_hr} icon={Users} color="text-success-600 dark:text-success-400" bg="bg-success-50 dark:bg-success-500/10" border="border-success-100 dark:border-success-500/20" />
                    </div>
                </div>
            </section>

            <section className="relative rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary-500/2.5 via-transparent to-info-500/2.5 pointer-events-none" />

                <div className="relative px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20">
                                <Activity className="w-4 h-4 text-primary-500" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-text">Giám sát tuyển dụng</h2>
                                <p className="text-xs text-text-subtle mt-0.5">Theo dõi sức khỏe và hiệu suất của hệ thống tuyển dụng</p>
                            </div>
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 rounded-lg px-3 py-2 shadow-sm">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 animate-ping opacity-75" />
                            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                        </span>
                        Đang giám sát
                    </span>
                </div>

                <div className="relative p-4 lg:p-6">
                    <OwnerAnalytics charts={data?.charts} />
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                <section className="xl:col-span-2 bg-card-bg rounded-3xl border border-border shadow-[0_10px_35px_-25px_rgba(15,23,42,0.35)] dark:shadow-[0_10px_35px_-25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4 bg-linear-to-r from-info-500/2.5 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl bg-info-50 dark:bg-info-500/10 border border-info-100 dark:border-info-500/20 flex items-center justify-center shadow-sm">
                                <Briefcase className="w-5 h-5 text-info-600 dark:text-info-400" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-info-500 animate-pulse" />
                            </div>

                            <div>
                                <h2 className="text-base font-black text-text">Tiến độ chiến dịch đang mở</h2>
                                <p className="text-xs text-text-subtle mt-0.5">Theo dõi tiến độ tuyển dụng của từng chiến dịch</p>
                            </div>
                        </div>

                        <Link href={ROUTES.HR_JOBS} className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100 dark:hover:bg-primary-500/15 px-3 py-2 rounded-lg transition-all shrink-0">
                            Xem tất cả
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse min-w-170">
                            <thead className="bg-background/70 border-b border-border">
                                <tr className="text-[10px] uppercase tracking-widest text-text-subtle font-black">
                                    <th className="px-6 py-4">Chiến dịch</th>
                                    <th className="px-4 py-4 text-center">CV mới</th>
                                    <th className="px-4 py-4 text-center">Đã tuyển</th>
                                    <th className="px-6 py-4 text-right">Tiến độ</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {pipelines.length > 0 ? (
                                    pipelines.map((job: any) => {
                                        const progress = job.target_hiring > 0 ? Math.min(100, (job.current_hired / job.target_hiring) * 100) : 0;

                                        return (
                                            <tr key={job.job_id} className="group hover:bg-surface-hover dark:hover:bg-white/2.5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <Link href={ROUTES.HR_JOB_DETAIL(job.job_id)} className="block">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-info-500 group-hover:scale-125 transition-transform" />
                                                            <div className="font-bold text-sm text-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{job.title}</div>
                                                        </div>
                                                        <div className="text-[11px] font-medium text-text-subtle mt-1.5 ml-3.5">Tổng: {job.total_cvs} CV</div>
                                                    </Link>
                                                </td>

                                                <td className="px-4 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1 bg-info-50 dark:bg-info-500/10 text-info-600 dark:text-info-400 font-black px-2.5 py-1.5 rounded-lg text-xs border border-info-100 dark:border-info-500/20 shadow-sm">+{job.new_cvs}</span>
                                                </td>

                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-sm font-black text-text">{job.current_hired}</span>
                                                    <span className="text-text-subtle text-xs font-bold"> / {job.target_hiring > 0 ? job.target_hiring : '∞'}</span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <div className="w-28 h-2 bg-background border border-border rounded-full overflow-hidden shadow-inner">
                                                            <div className="h-full bg-linear-to-r from-info-500 to-primary-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                                                        </div>
                                                        <span className="text-xs font-black text-text w-9 text-right">{progress.toFixed(0)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-14 text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-background border border-border shadow-inner flex items-center justify-center mx-auto mb-4">
                                                <Briefcase className="w-7 h-7 text-text-subtle" />
                                            </div>
                                            <p className="text-sm text-text font-bold">Chưa có chiến dịch nào đang mở.</p>
                                            <p className="text-xs text-text-subtle mt-1">Các chiến dịch đang hoạt động sẽ xuất hiện tại đây.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-card-bg rounded-3xl border border-border shadow-[0_10px_35px_-25px_rgba(15,23,42,0.35)] dark:shadow-[0_10px_35px_-25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-border flex items-center gap-3 bg-linear-to-r frfrom-success-500/2.5o-transparent">
                        <div className="relative w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 flex items-center justify-center shadow-sm">
                            <Users className="w-5 h-5 text-success-600 dark:text-success-400" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                        </div>

                        <div>
                            <h2 className="text-base font-black text-text">Hồ sơ ứng tuyển mới</h2>
                            <p className="text-xs text-text-subtle mt-0.5">Hoạt động ứng tuyển gần đây</p>
                        </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-130">
                        {recentApps.map((app: any) => {
                            const config = APPLICATION_STATUS_CONFIG[app.status] || APPLICATION_STATUS_CONFIG['new'];

                            return (
                                <Link key={app.id} href={ROUTES.HR_JOB_DETAIL(app.job_id)} className="block p-4 rounded-2xl bg-background border border-border hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                                    <div className="flex justify-between items-start gap-3 mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm shrink-0 shadow-sm">{app.candidate_name.charAt(0)}</div>

                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">{app.candidate_name}</p>
                                                <p className="text-[11px] font-medium text-text-subtle truncate mt-0.5">{app.job_title}</p>
                                            </div>
                                        </div>

                                        <span className={`text-[9px] px-2 py-1 rounded-md border font-black uppercase tracking-wider shrink-0 ${config.color} ${config.borderColor}`}>{config.label}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black tracking-widest text-text-subtle shrink-0">ĐỘ PHÙ HỢP AI</span>

                                        <div className="flex-1 h-1.5 bg-background border border-border rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full rounded-full transition-all ${app.ai_score >= 80 ? 'bg-success-500' : app.ai_score >= 50 ? 'bg-warning-500' : 'bg-error-500'}`} style={{ width: `${app.ai_score}%` }} />
                                        </div>

                                        <span className="text-xs font-black text-text w-9 text-right">{app.ai_score?.toFixed(0)}đ</span>
                                    </div>

                                    <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
                                            Xem hồ sơ
                                            <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {recentApps.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-14 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-background border border-border shadow-inner flex items-center justify-center mb-4">
                                    <Users className="w-7 h-7 text-text-subtle" />
                                </div>
                                <p className="text-sm text-text font-bold">Chưa có ứng viên mới.</p>
                                <p className="text-xs text-text-subtle mt-1">Hoạt động ứng tuyển mới sẽ xuất hiện tại đây.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ index, title, value, icon: Icon, color, bg, border, trend }: any) {
    return (
        <div className="group relative overflow-hidden bg-background/70 dark:bg-black/10 rounded-2xl border border-border shadow-[0_6px_22px_-16px_rgba(15,23,42,0.35)] dark:shadow-[0_6px_22px_-16px_rgba(0,0,0,0.8)] hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.4)] dark:hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.9)] hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent group-hover:via-primary-300 dark:group-hover:via-primary-700 transition-colors" />
            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-primary-500/2.5 group-hover:bg-primary-500/[0.07] blur-2xl transition-colors duration-500" />
            <div className="absolute inset-y-0 left-0 w-0.5 bg-linear-to-b from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center border ${border} shadow-sm group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>

                    {trend && trend.trend > 0 && (
                        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1.5 rounded-lg border shadow-sm ${trend.is_up ? 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10 border-success-100 dark:border-success-500/20' : 'text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-500/10 border-error-100 dark:border-error-500/20'}`}>
                            {trend.is_up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {trend.trend}%
                        </div>
                    )}
                </div>

                <div className="mt-5">
                    <p className="text-[10px] text-text-subtle font-black uppercase tracking-widest">{title}</p>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-3xl font-black text-text tracking-tight">{value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}