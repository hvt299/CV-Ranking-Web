'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { companyService } from '@/features/company/company.service';
import toast from 'react-hot-toast';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        companyService.getAdminAnalytics()
            .then(res => setData(res))
            .catch(() => toast.error('Không thể tải dữ liệu phân tích'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        );
    }

    const growthData = data?.growth_trend_chart || [];
    const statusData = data?.company_status_chart || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">

            {/* HEADER */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Phân tích Hệ thống</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Giám sát biểu đồ tăng trưởng và tỷ lệ chuyển đổi KYC trên toàn nền tảng.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* BIỂU ĐỒ ĐƯỜNG: TĂNG TRƯỞNG */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        <h2 className="text-lg font-black text-slate-800 dark:text-white">Tăng trưởng 14 ngày qua</h2>
                    </div>
                    <div className="flex-1 min-h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--bg-popover)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="users" name="Người dùng mới" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="companies" name="Doanh nghiệp mới" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BIỂU ĐỒ TRÒN: TRẠNG THÁI KYC */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChartIcon className="w-5 h-5 text-primary-500" />
                        <h2 className="text-lg font-black text-slate-800 dark:text-white">Trạng thái KYC Doanh nghiệp</h2>
                    </div>
                    <div className="flex-1 min-h-75 w-full flex items-center justify-center">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry: any, index: number) => {
                                            let hexColor = '#cbd5e1';
                                            if (entry.name === 'Đã duyệt') hexColor = '#10b981';
                                            if (entry.name === 'Chờ duyệt') hexColor = '#f59e0b';
                                            if (entry.name === 'Từ chối') hexColor = '#ef4444';
                                            if (entry.name === 'Tạm khóa') hexColor = '#64748b';

                                            return <Cell key={`cell-${index}`} fill={hexColor} />;
                                        })}
                                    </Pie>
                                    <Tooltip
                                        itemStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-400 text-sm font-medium">Chưa có dữ liệu KYC</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}