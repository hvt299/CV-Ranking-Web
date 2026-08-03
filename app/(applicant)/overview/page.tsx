'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMyProfile } from '@/features/application/useApplication';
import apiClient from '@/lib/api-client';

import ProfileHealthCard from '@/components/candidates/overview/ProfileHealthCard';
import QuickStatsCards from '@/components/candidates/overview/QuickStatsCards';
import RecentApplications from '@/components/candidates/overview/RecentApplications';
import RecommendedJobs from '@/components/candidates/overview/RecommendedJobs';

export default function ApplicantOverviewPage() {
    const { user } = useAuth();
    const { profile, isLoading: isProfileLoading } = useMyProfile();
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoadingApps, setIsLoadingApps] = useState(true);

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