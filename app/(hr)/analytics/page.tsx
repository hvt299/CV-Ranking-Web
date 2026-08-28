'use client';

import { useState, useEffect } from 'react';
import { useHRViewStore } from '@/store/useHRViewStore';
import { useAuthStore } from '@/store/useAuthStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Filter, Loader2, Activity } from 'lucide-react';
import ProFeatureLock from '@/components/shared/ProFeatureLock';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';

export default function AnalyticsPage() {
    const { hrViewMode } = useHRViewStore();
    const { user } = useAuthStore();
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [isProActive, setIsProActive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.company_id || hrViewMode === 'MEMBER') return;

        const fetchAnalytics = async () => {
            try {
                const res = await apiClient.get(`/companies/${user.company_id}/analytics`);
                setIsProActive(res.data.is_pro_active);
                if (res.data.is_pro_active) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải Analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [user?.company_id, hrViewMode]);

    if (hrViewMode === 'MEMBER') {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <div className="w-16 h-16 bg-error-50 dark:bg-error-500/10 text-error-500 rounded-2xl flex items-center justify-center mb-4">
                    <Filter className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Quyền truy cập bị từ chối</h2>
                <p className="text-slate-500 font-medium max-w-md">Bạn đang ở chế độ Tuyển dụng (Member) hoặc không có quyền xem dữ liệu phân tích hệ thống.</p>
                <button onClick={() => router.push('/dashboard')} className="mt-6 px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl">Quay lại Bàn làm việc</button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-primary-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Đang trích xuất dữ liệu phân tích...</p>
            </div>
        );
    }

    const funnelData = data?.funnel_chart || [];
    const aiScoreData = data?.ai_score_distribution || [];
    const trendData = data?.applications_trend || [];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <div className="flex items-center">
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Phân tích Hiệu suất
                        </h1>
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm">
                            Pro
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Báo cáo chuyên sâu về chất lượng ứng viên và phễu chuyển đổi.
                    </p>
                </div>

                <div className="flex gap-2">
                    <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 shadow-sm cursor-pointer disabled:opacity-50" disabled={!isProActive}>
                        <option value="30">30 ngày qua</option>
                        <option value="90">3 tháng qua</option>
                        <option value="all">Toàn thời gian</option>
                    </select>
                </div>
            </div>

            <div className="relative space-y-6">
                {!isProActive && <ProFeatureLock />}

                {/* BIỂU ĐỒ 3: LƯU LƯỢNG ỨNG TUYỂN FULL WIDTH */}
                <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col ${!isProActive ? 'filter blur-[6px] pointer-events-none select-none' : ''}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-slate-800 dark:text-white text-lg">Lưu lượng Ứng tuyển (14 ngày)</h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">Số lượng CV nhận được theo từng ngày</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-info-50 dark:bg-info-900/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-info-500" />
                        </div>
                    </div>

                    <div className="h-62.5 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-info-500)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-info-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="cv_count" name="Số lượng CV" stroke="var(--color-info-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorCv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* BIỂU ĐỒ 1: PHỄU TUYỂN DỤNG */}
                    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col ${!isProActive ? 'filter blur-[6px] pointer-events-none select-none' : ''}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-black text-slate-800 dark:text-white text-lg">Phễu chuyển đổi (Funnel)</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Tỷ lệ rớt hồ sơ qua các vòng</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary-500" />
                            </div>
                        </div>

                        <div className="h-70 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} width={90} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold' }} />
                                    <Bar dataKey="value" name="Số lượng" fill="var(--color-primary-500)" radius={[0, 8, 8, 0]} barSize={32}>
                                        {funnelData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index === funnelData.length - 1 ? 'var(--color-success-500)' : 'var(--color-primary-500)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ 2: PHÂN BỔ ĐIỂM AI */}
                    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col ${!isProActive ? 'filter blur-[6px] pointer-events-none select-none' : ''}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-black text-slate-800 dark:text-white text-lg">Chất lượng Nguồn CV (AI)</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Phân bổ theo mức độ phù hợp AI chấm</p>
                            </div>
                        </div>

                        <div className="h-70 w-full flex items-center justify-center mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={aiScoreData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                        {aiScoreData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex justify-center gap-6 mt-4">
                            {aiScoreData.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}