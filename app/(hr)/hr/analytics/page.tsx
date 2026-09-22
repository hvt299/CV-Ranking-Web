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
    // LƯU Ý: CẤM XÓA VĨNH VIỄN ĐOẠN KIỂM TRA GÓI
    const { isPro: realIsPro, isLoading: isCreditsLoading } = useCredits();
    const isPro = true; // Tạm thời bypass phần logic gói để xem trước biểu đồ

    const { data: plansRes } = useSubscriptionPlans('hr');

    const unlockPlan = plansRes?.data?.find(
        (p: any) => p.features?.can_export_analytics
    );

    const unlockPlanName = unlockPlan?.name || 'Pro';
    const unlockTierConfig = getTierBadgeConfig(unlockPlan?.tier_level || 3);

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        if (!user?.company_id || hrViewMode === 'MEMBER' || isCreditsLoading) return;

        const fetchAnalytics = async () => {
            try {
                const res = await apiClient.get(`/companies/${user?.company_id}/analytics?days=${days}`);
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
    }, [user?.company_id, hrViewMode, isPro, isCreditsLoading, days]);

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

    const funnelData = data?.funnel_chart || [];
    const scoreData = data?.ai_score_distribution || [];
    const trendData = data?.applications_trend || [];
    const expData = data?.experience_distribution || [];
    const skillsData = data?.skills_word_cloud || [];
    const heatmapData = data?.apply_time_heatmap || [];
    const sourceData = data?.source_roi || [];
    const timeToHireData = data?.time_to_hire || [];
    const knockoutData = data?.knockout_analysis || [];

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
                    <select value={days.toString()} onChange={(e) => setDays(Number(e.target.value))} className="bg-background border border-border text-text font-bold rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 shadow-sm cursor-pointer disabled:opacity-50" disabled={!isPro}>
                        <option value="7">7 ngày qua</option>
                        <option value="14">14 ngày qua</option>
                        <option value="30">30 ngày qua</option>
                        <option value="90">3 tháng qua</option>
                        <option value="180">6 tháng qua</option>
                        <option value="365">1 năm qua</option>
                        <option value="9999">Toàn thời gian</option>
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

                <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${!isPro ? 'filter blur-[6px] pointer-events-none select-none' : ''}`}>
                    
                    {/* BIỂU ĐỒ 1: PHỄU ỨNG TUYỂN */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full xl:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Phễu Ứng tuyển</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Tỷ lệ chuyển đổi qua các vòng</p>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text)', fontSize: 12, fontWeight: 600 }} width={100} />
                                    <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                    <Bar dataKey="value" name="Ứng viên" radius={[0, 6, 6, 0]} barSize={25}>
                                        {funnelData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill || 'var(--color-primary-500)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 2: ĐIỂM AI */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Chất lượng CV (Điểm AI)</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Phân bố điểm đánh giá từ AI</p>
                            </div>
                        </div>
                        <div className="h-72 w-full flex items-center justify-center mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={scoreData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="var(--color-card-bg)" strokeWidth={2}>
                                        {scoreData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 3: XU HƯỚNG ỨNG TUYỂN */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full xl:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Xu hướng Ứng tuyển</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Lượng CV nộp theo thời gian</p>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />
                                    <RechartsTooltip cursor={{ stroke: 'var(--color-primary-500)', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                    <Area type="monotone" dataKey="cv_count" name="Số lượng CV" stroke="var(--color-primary-500)" strokeWidth={3} fillOpacity={1} fill="url(#trendGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 4: PHÂN BỐ KINH NGHIỆM */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Kinh nghiệm Ứng viên</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Số năm kinh nghiệm</p>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={expData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />
                                    <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                    <Bar dataKey="value" name="Số lượng" radius={[4, 4, 0, 0]} barSize={30}>
                                        {expData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 5: HIỆU QUẢ NGUỒN (ROI) */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full xl:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Hiệu quả Nguồn Ứng viên (ROI)</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Kênh mang lại nhiều CV trúng tuyển nhất</p>
                            </div>
                            {sourceData[0]?.is_mock && <span className="px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</span>}
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text)', fontSize: 12, fontWeight: 600 }} width={80} />
                                    <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                    <Bar dataKey="value" name="Tổng CV" radius={[0, 4, 4, 0]} barSize={15} fill="var(--color-slate-300)" />
                                    <Bar dataKey="hired" name="Đã tuyển" radius={[0, 4, 4, 0]} barSize={15} fill="var(--color-success-500)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 6: THỜI GIAN TUYỂN DỤNG */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Tốc độ Tuyển dụng</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Thời gian trung bình (ngày)</p>
                            </div>
                            {timeToHireData[0]?.is_mock && <span className="px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</span>}
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeToHireData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-info-500)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-info-500)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />
                                    <RechartsTooltip cursor={{ stroke: 'var(--color-info-500)', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                    <Area type="monotone" dataKey="days" name="Ngày" stroke="var(--color-info-500)" strokeWidth={3} fillOpacity={1} fill="url(#timeGradient)" dot={{ r: 4, fill: 'var(--color-info-500)', strokeWidth: 2, stroke: 'var(--color-card-bg)' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 7: KNOCKOUT ANALYSIS */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full xl:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Phân tích Tiêu chí Tử thần</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Các yêu cầu bắt buộc khiến ứng viên rớt nhiều nhất</p>
                            </div>
                            {knockoutData[0]?.is_mock && <span className="px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</span>}
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={knockoutData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text)', fontSize: 12, fontWeight: 600 }} width={140} />
                                    <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                    <Bar dataKey="value" name="Số CV rớt" radius={[0, 4, 4, 0]} barSize={20}>
                                        {knockoutData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 8: WORD CLOUD KỸ NĂNG */}
                    <div className="bg-card-bg rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-text text-lg">Top Kỹ năng (Word Cloud)</h3>
                                <p className="text-sm font-medium text-text-muted mt-1">Tần suất kỹ năng xuất hiện trong CV</p>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillsData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="text" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 12, fontWeight: 600 }} width={80} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold', color: 'var(--color-text)' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                    <Bar dataKey="value" name="Tần suất" radius={[0, 4, 4, 0]} barSize={20} fill="var(--color-primary-500)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
