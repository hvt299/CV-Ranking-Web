'use client';

import { useState, useEffect } from 'react';
import { useHRViewStore } from '@/store/useHRViewStore';
import { useAuthStore } from '@/store/useAuthStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Filter, Loader2, Activity } from 'lucide-react';
import ProFeatureLock from '@/components/shared/ProFeatureLock';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { ROUTES } from '@/constants/routes';
import { useCredits } from '@/hooks/useCredits';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getTierBadgeConfig } from '@/utils/tier-colors';

export default function AnalyticsPage() {
    const { hrViewMode } = useHRViewStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const { isPro, isLoading: isCreditsLoading } = useCredits();

    const { data: plansRes } = useSubscriptionPlans('hr');

    const unlockPlan = plansRes?.data?.find(
        (p: any) => p.features?.can_export_analytics
    );

    const unlockPlanName = unlockPlan?.name || 'Pro';
    const unlockTierConfig = getTierBadgeConfig(unlockPlan?.tier_level || 3);

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.company_id || hrViewMode === 'MEMBER' || isCreditsLoading) return;

        const fetchAnalytics = async () => {
            try {
                const res = await apiClient.get(`/jobs/dashboard/metrics?scope=company`);
                setData(res.data.data);
            } catch (error) {
                console.error("Lỗi khi tải Analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isPro) {
            fetchAnalytics();
        } else {
            setIsLoading(false);
        }
    }, [user?.company_id, hrViewMode, isPro, isCreditsLoading]);

    if (hrViewMode === 'MEMBER') {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <div className="w-16 h-16 bg-error-50 dark:bg-error-500/10 text-error-500 rounded-2xl flex items-center justify-center mb-4">
                    <Filter className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Quyền truy cập bị từ chối</h2>
                <p className="text-slate-500 font-medium max-w-md">Bạn đang ở chế độ Tuyển dụng (Member) hoặc không có quyền xem dữ liệu phân tích hệ thống.</p>
                <button onClick={() => router.push(ROUTES.HR_DASHBOARD)} className="mt-6 px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl">Quay lại Bàn làm việc</button>
            </div>
        );
    }

    if (isLoading || isCreditsLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-primary-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Đang trích xuất dữ liệu phân tích...</p>
            </div>
        );
    }

    const skillsData = data?.charts?.skills_word_cloud || [];
    const rejectionData = data?.charts?.rejection_reasons || [];
    const heatmapData = data?.charts?.apply_time_heatmap || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 min-h-[calc(100vh-100px)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-card-bg p-8 rounded-2xl border border-border shadow-sm">
                <div>
                    <div className="flex items-center">
                        <h1 className="text-3xl font-black text-text tracking-tight flex items-center gap-3">
                            Phân tích Tuyển dụng Chuyên sâu
                        </h1>
                        <span
                            className={`ml-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-sm border ${unlockTierConfig.bg} ${unlockTierConfig.text} ${unlockTierConfig.border}`}
                        >
                            {unlockPlanName.replace('HR ', '')}
                        </span>
                    </div>
                    <p className="text-sm text-text-muted mt-2 font-medium">
                        Insight độc quyền từ AI về kỹ năng, lý do từ chối và thói quen ứng viên.
                    </p>
                </div>

                <div className="flex gap-2">
                    <select className="bg-background border border-border text-text font-bold rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 shadow-sm cursor-pointer disabled:opacity-50" disabled={!isPro}>
                        <option value="30">30 ngày qua</option>
                        <option value="90">3 tháng qua</option>
                        <option value="all">Toàn thời gian</option>
                    </select>
                </div>
            </div>

            <div className="relative space-y-6">
                {!isPro && (
                    <ProFeatureLock
                        description={`Báo cáo chuyên sâu về phễu chuyển đổi và chất lượng ứng viên chỉ dành cho gói HR ${unlockPlanName.replace('HR ', '')}.`}
                        requiredTierName={unlockPlanName.replace('HR ', '')}
                        requiredTierLevel={unlockPlan?.tier_level || 2}
                        title="Phân tích Tuyển dụng"
                    />
                )}

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!isPro ? 'filter blur-[6px] pointer-events-none select-none' : ''}`}>
                    {/* BIỂU ĐỒ 1: SKILLS WORD CLOUD (Bar Chart giả lập do Recharts k có word cloud) */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Top Kỹ năng (Word Cloud)</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Tần suất kỹ năng xuất hiện trong CV</p>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillsData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="text" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 12, fontWeight: 500 }} width={80} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold' }} />
                                    <Bar dataKey="value" name="Tần suất" radius={[0, 4, 4, 0]} barSize={20} fill="var(--color-primary-500)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 2: LÝ DO TỪ CHỐI (Pie Chart) */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Lý do Loại CV</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Phân tích từ Rejection Feedback</p>
                            </div>
                        </div>
                        <div className="h-72 w-full flex items-center justify-center mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={rejectionData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                                        {rejectionData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || 'var(--color-error-500)'} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 3: HEATMAP NỘP CV */}
                    <div className="lg:col-span-2 bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Thói quen Nộp CV (Heatmap)</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Mật độ ứng viên theo Thứ & Khung giờ</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto pb-4">
                            <div className="min-w-[600px]">
                                <div className="grid grid-cols-8 gap-2 mb-2">
                                    <div className="text-sm font-bold text-text-subtle text-right pr-4 pt-2">Khung giờ</div>
                                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                                        <div key={day} className="text-sm font-bold text-center text-text-subtle">{day}</div>
                                    ))}
                                </div>
                                {['Sáng (6-12h)', 'Chiều (12-18h)', 'Tối (18-24h)', 'Đêm (0-6h)'].map(shift => (
                                    <div key={shift} className="grid grid-cols-8 gap-2 mb-2 items-center">
                                        <div className="text-sm font-bold text-text-subtle text-right pr-4">{shift}</div>
                                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => {
                                            const heat = heatmapData.find((h: any) => h.day === day && h.shift === shift)?.value || 0;
                                            const intensity = heat > 20 ? 'bg-info-600' : heat > 10 ? 'bg-info-400' : heat > 0 ? 'bg-info-200 dark:bg-info-800' : 'bg-background';
                                            return (
                                                <div key={day} className={`h-12 rounded-xl flex items-center justify-center border border-border ${intensity} transition-colors hover:scale-[1.02] cursor-pointer`} title={`${heat} CV`}>
                                                    {heat > 0 && <span className="text-xs font-bold text-white drop-shadow-md">{heat}</span>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}