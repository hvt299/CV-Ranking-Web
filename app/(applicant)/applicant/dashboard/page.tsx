'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyProfile } from '@/features/application/useApplication';
import apiClient from '@/lib/api-client';

import ProfileHealthCard from '@/components/candidates/overview/ProfileHealthCard';
import QuickStatsCards from '@/components/candidates/overview/QuickStatsCards';
import RecentApplications from '@/components/candidates/overview/RecentApplications';
import RecommendedJobs from '@/components/candidates/overview/RecommendedJobs';
import ApplicantAnalytics from '@/components/candidates/overview/ApplicantAnalytics';
import { useCurrentTime } from '@/hooks/useCurrentTime';

export default function ApplicantOverviewPage() {
    const { user } = useAuthStore();
    const { profile, isLoading: isProfileLoading } = useMyProfile();
    const [applications, setApplications] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [isLoadingApps, setIsLoadingApps] = useState(true);
    const currentTime = useCurrentTime();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resApps, resMetrics] = await Promise.all([apiClient.get('/apply/my-applications'), apiClient.get('/apply/dashboard/metrics')]);
                const appData = resApps.data?.data || resApps.data || [];
                setApplications(Array.isArray(appData) ? appData : []);
                setMetrics(resMetrics.data?.data || null);
            } catch (error) {
                console.error('Lỗi tải dữ liệu dashboard', error);
            } finally {
                setIsLoadingApps(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isProfileLoading || isLoadingApps || !user) {
        return (
            <main className="w-full min-w-0 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center text-primary-500">
                <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary-500/10 animate-ping" />
                    <div className="relative w-16 h-16 rounded-2xl bg-card-bg border border-primary-200 dark:border-primary-500/30 shadow-lg shadow-primary-500/10 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-4 border-primary-200 dark:border-primary-500/20 border-t-primary-600 dark:border-t-primary-400 animate-spin" />
                    </div>
                </div>
                <p className="text-text font-bold mt-5">Đang tải dữ liệu tổng quan...</p>
                <p className="text-text-subtle text-sm mt-1">Đang đồng bộ hồ sơ và hoạt động ứng tuyển</p>
            </main>
        );
    }

    return (
        <main className="w-full min-w-0">
            <div className="w-full space-y-6 pb-10 min-h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)] dark:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)]">
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-info-500/5 blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-linear-to-brrom-primary-500/[0.07] via-transparent to-info-500/5 pointer-events-none" />

                    <div className="relative p-6 lg:p-8">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="hidden sm:flex relative w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white items-center justify-center shadow-lg shadow-primary-600/25 shrink-0 overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                    <svg className="relative w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h1 className="text-2xl lg:text-3xl font-black text-text tracking-tight">Tổng quan Ứng viên</h1>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 text-success-600 dark:text-success-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            <span className="relative flex w-1.5 h-1.5">
                                                <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 opacity-75 animate-ping" />
                                                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                                            </span>
                                            Đang hoạt động
                                        </span>
                                    </div>

                                    <p className="text-sm text-text-muted max-w-2xl">Theo dõi sức khỏe hồ sơ, lịch sử ứng tuyển và các cơ hội việc làm phù hợp với bạn.</p>

                                    <div className="flex flex-wrap items-center gap-3 mt-4">
                                        <div className="inline-flex items-center gap-2 text-xs font-bold text-text-muted bg-background/80 border border-border rounded-lg px-3 py-1.5 shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-success-500 shadow-[0_0_8px_var(--color-success-500)]" />
                                            {currentTime}
                                        </div>

                                        <div className="hidden sm:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-subtle">
                                            <span className="relative flex w-1.5 h-1.5">
                                                <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 opacity-75 animate-ping" />
                                                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                                            </span>
                                            Hệ thống trực tuyến
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-0 bg-linear-to-br from-primary-500/[0.035] via-transparent to-info-500/2.5 pointer-events-none" />
                    <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

                    <div className="relative p-4 lg:p-5">
                        <ProfileHealthCard user={user} profile={profile} />
                    </div>
                </section>

                <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-0 bg-linear-to-br from-primary-500/[0.035] via-transparent to-success-500/2.5 pointer-events-none" />
                    <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

                    <div className="relative px-5 py-5 lg:px-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3v18h18" />
                                    <path d="m7 16 4-5 3 3 5-7" />
                                </svg>
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-card-bg animate-pulse" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base lg:text-lg font-black text-text tracking-tight">Chỉ số nhanh</h2>
                                    <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20 text-[9px] font-black uppercase tracking-widest">Tổng quan</span>
                                </div>
                                <p className="text-xs text-text-subtle mt-1">Các chỉ số chính trong hành trình ứng tuyển của bạn</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative p-4 lg:p-5">
                        <QuickStatsCards applications={applications} />
                    </div>
                </section>

                <section className="relative rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-primary-500/2.5 via-transparent to-info-500/2.5nter-events-none" />

                    <div className="relative px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20">
                                    <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 3v18h18" />
                                        <path d="m7 16 4-5 3 3 5-7" />
                                    </svg>
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-text">Phân tích Hồ sơ</h2>
                                    <p className="text-xs text-text-subtle mt-0.5">Theo dõi dữ liệu và hiệu suất ứng tuyển của bạn</p>
                                </div>
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 rounded-lg px-3 py-2 shadow-sm">
                            <span className="relative flex w-1.5 h-1.5">
                                <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 animate-ping opacity-75" />
                                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                            </span>
                            Đang phân tích
                        </span>
                    </div>

                    <div className="relative p-4 lg:p-6">
                        <ApplicantAnalytics metrics={metrics} />
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                    <section className="xl:col-span-2 bg-card-bg rounded-3xl border border-border shadow-[0_10px_35px_-25px_rgba(15,23,42,0.35)] dark:shadow-[0_10px_35px_-25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-border flex items-center gap-3 bg-linear-to-r from-info-500/2.5 to-transparent">
                            <div className="relative w-10 h-10 rounded-xl bg-info-50 dark:bg-info-500/10 border border-info-100 dark:border-info-500/20 flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-info-600 dark:text-info-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                                </svg>
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-info-500 animate-pulse" />
                            </div>

                            <div>
                                <h2 className="text-base font-black text-text">Hoạt động ứng tuyển gần đây</h2>
                                <p className="text-xs text-text-subtle mt-0.5">Theo dõi lịch sử và trạng thái các hồ sơ đã ứng tuyển</p>
                            </div>
                        </div>

                        <div className="relative p-4 lg:p-5 flex-1">
                            <RecentApplications applications={applications} />
                        </div>
                    </section>

                    <section className="bg-card-bg rounded-3xl border border-border shadow-[0_10px_35px_-25px_rgba(15,23,42,0.35)] dark:shadow-[0_10px_35px_-25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-border flex items-center gap-3 bg-linear-to-r from-success-500/2.5 to-transparent">
                            <div className="relative w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-success-600 dark:text-success-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                            </div>

                            <div>
                                <h2 className="text-base font-black text-text">Việc làm phù hợp</h2>
                                <p className="text-xs text-text-subtle mt-0.5">Cơ hội được đề xuất dựa trên hồ sơ của bạn</p>
                            </div>
                        </div>

                        <div className="relative p-4 lg:p-5 flex-1">
                            <RecommendedJobs profile={profile} />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}