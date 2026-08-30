'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyProfile } from '@/features/application/useApplication';
import apiClient from '@/lib/api-client';

import ProfileHealthCard from '@/components/candidates/overview/ProfileHealthCard';
import QuickStatsCards from '@/components/candidates/overview/QuickStatsCards';
import RecentApplications from '@/components/candidates/overview/RecentApplications';
import RecommendedJobs from '@/components/candidates/overview/RecommendedJobs';
import { useCurrentTime } from '@/hooks/useCurrentTime';

export default function ApplicantOverviewPage() {
    const { user } = useAuthStore();
    const { profile, isLoading: isProfileLoading } = useMyProfile();
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoadingApps, setIsLoadingApps] = useState(true);
    const currentTime = useCurrentTime();

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await apiClient.get('/apply/my-applications');
                const appData = res.data?.data || res.data || [];
                setApplications(Array.isArray(appData) ? appData : []);
            } catch (error) {
                console.error('Lỗi tải lịch sử ứng tuyển', error);
            } finally {
                setIsLoadingApps(false);
            }
        };
        fetchApps();
    }, []);

    if (isProfileLoading || isLoadingApps || !user) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Tổng quan ứng viên</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Theo dõi sức khỏe hồ sơ, lịch sử ứng tuyển và các cơ hội việc làm phù hợp với bạn.</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
                    {currentTime}
                </div>
            </div>

            {/* 1. Khối Chào mừng & Sức khỏe Hồ sơ */}
            <ProfileHealthCard user={user} profile={profile} />

            {/* 2. Khối Chỉ số nhanh */}
            <QuickStatsCards applications={applications} />

            {/* Grid 2 cột: Trái (Hoạt động gần đây) - Phải (Gợi ý việc làm) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {/* 3. Hoạt động gần đây */}
                    <RecentApplications applications={applications} />
                </div>
                <div className="xl:col-span-1 space-y-8">
                    {/* 4. Gợi ý việc làm */}
                    <RecommendedJobs profile={profile} />
                </div>
            </div>
        </div>
    );
}