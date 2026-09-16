'use client';

import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { LineChart as LineIcon, PieChart as PieIcon, BarChart2, Cpu } from 'lucide-react';

interface AdminAnalyticsProps {
    charts: any;
}

const tooltipStyle = { borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', fontWeight: 'bold' as const };

export default function AdminAnalytics({ charts }: AdminAnalyticsProps) {
    if (!charts) return null;

    const growthTrend = Array.isArray(charts.growth_trend) ? charts.growth_trend : [];
    const subscriptionTier = Array.isArray(charts.subscription_tier) ? charts.subscription_tier : [];
    const jobsByIndustry = Array.isArray(charts.jobs_by_industry) ? charts.jobs_by_industry : [];
    const systemLoad = Array.isArray(charts.system_load) ? charts.system_load : [];

    const hasGrowthData = growthTrend.length > 0;
    const hasSubscriptionData = subscriptionTier.length > 0;
    const hasIndustryData = jobsByIndustry.length > 0;
    const hasSystemLoadData = systemLoad.length > 0;

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card-bg shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/2.5 via-transparent to-info-500/2 pointer-events-none" />

            <div className="relative px-5 py-5 lg:px-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center shadow-sm">
                            <LineIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-card-bg animate-pulse" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base lg:text-lg font-black text-text tracking-tight">Báo cáo Hệ thống</h2>
                                <span className="hidden md:inline-flex items-center px-2 py-1 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20 text-[9px] font-black uppercase tracking-widest">Analytics</span>
                            </div>
                            <p className="text-xs text-text-subtle mt-1">Theo dõi tăng trưởng, thị trường tuyển dụng và tải hệ thống</p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 w-fit px-3 py-2 rounded-lg bg-background border border-border shadow-sm text-[10px] font-black uppercase tracking-widest text-text-subtle">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 animate-ping opacity-75" />
                            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                        </span>
                        Dữ liệu hệ thống
                    </div>
                </div>
            </div>

            <div className="relative p-4 lg:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <AnalyticsCard index={0} icon={LineIcon} iconClass="text-primary-600 dark:text-primary-400" bgClass="bg-primary-50 dark:bg-primary-500/10" borderClass="border-primary-100 dark:border-primary-500/20" title="Tăng trưởng Người dùng & Doanh nghiệp" description="Theo thời gian lọc">
                        {hasGrowthData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <RechartsTooltip contentStyle={tooltipStyle} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="users" name="Người dùng mới" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="companies" name="Doanh nghiệp mới" stroke="#10b981" fillOpacity={1} fill="url(#colorCompanies)" strokeWidth={3} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChartState message="Chưa có dữ liệu tăng trưởng" />
                        )}
                    </AnalyticsCard>

                    <AnalyticsCard index={1} icon={PieIcon} iconClass="text-info-600 dark:text-info-400" bgClass="bg-info-50 dark:bg-info-500/10" borderClass="border-info-100 dark:border-info-500/20" title="Phân bổ Gói Cước" description="Tỷ trọng các gói dịch vụ">
                        {hasSubscriptionData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={subscriptionTier} cx="50%" cy="50%" innerRadius={62} outerRadius={84} paddingAngle={5} dataKey="value" stroke="none">
                                        {subscriptionTier.map((entry: any, index: number) => (
                                            <Cell key={`subscription-cell-${index}`} fill={entry.color || 'var(--color-primary-500)'} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={tooltipStyle} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-subtle)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChartState message="Chưa có dữ liệu gói cước" />
                        )}
                    </AnalyticsCard>

                    <AnalyticsCard index={2} icon={BarChart2} iconClass="text-success-600 dark:text-success-400" bgClass="bg-success-50 dark:bg-success-500/10" borderClass="border-success-100 dark:border-success-500/20" title="Top Ngành Nghề" description="Số lượng Job đang mở theo ngành">
                        {hasIndustryData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={jobsByIndustry} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 500 }} width={80} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-text)' }} />
                                    <Bar dataKey="value" name="Jobs" radius={[0, 6, 6, 0]} barSize={20}>
                                        {jobsByIndustry.map((entry: any, index: number) => (
                                            <Cell key={`industry-cell-${index}`} fill={entry.color || 'var(--color-success-500)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChartState message="Chưa có dữ liệu ngành nghề" />
                        )}
                    </AnalyticsCard>

                    <AnalyticsCard index={3} icon={Cpu} iconClass="text-info-600 dark:text-info-400" bgClass="bg-info-50 dark:bg-info-500/10" borderClass="border-info-100 dark:border-info-500/20" title="Lưu lượng Tuyển dụng Hệ thống" description="Số lượng CV ứng tuyển trên toàn hệ thống · Theo thời gian lọc">
                        {hasSystemLoadData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={systemLoad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="adminLoadGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-info-500)" stopOpacity={0.22} />
                                            <stop offset="95%" stopColor="var(--color-info-500)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 500 }} />
                                    <RechartsTooltip contentStyle={tooltipStyle} />
                                    <Area type="monotone" dataKey="cv_received" name="CV Mới" stroke="var(--color-info-500)" strokeWidth={2.5} fill="url(#adminLoadGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChartState message="Chưa có dữ liệu tuyển dụng" />
                        )}
                    </AnalyticsCard>
                </div>
            </div>
        </section>
    );
}

function AnalyticsCard({ index, icon: Icon, iconClass, bgClass, borderClass, title, description, children }: { index: number; icon: any; iconClass: string; bgClass: string; borderClass: string; title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="group relative overflow-hidden bg-background/70 dark:bg-black/10 rounded-2xl border border-border shadow-[0_6px_22px_-16px_rgba(15,23,42,0.35)] dark:shadow-[0_6px_22px_-16px_rgba(0,0,0,0.8)] hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.4)] dark:hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.9)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent group-hover:via-primary-300 dark:group-hover:via-primary-700 transition-colors" />
            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-primary-500/2.5 group-hover:bg-primary-500/[0.07] blur-2xl transition-colors duration-500" />

            <div className="relative p-5 pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center border ${borderClass} shadow-sm group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300 shrink-0`}>
                            <Icon className={`w-5 h-5 ${iconClass}`} />
                        </div>

                        <div className="min-w-0">
                            <h3 className="font-black text-text text-sm lg:text-base tracking-tight truncate">{title}</h3>
                            <p className="text-xs font-medium text-text-subtle mt-1 truncate">{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative h-64 w-full px-3 pb-4">
                {children}
            </div>
        </div>
    );
}

function EmptyChartState({ message }: { message: string }) {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-background border border-border flex items-center justify-center">
                    <LineIcon className="w-5 h-5 text-text-subtle" />
                </div>
                <p className="text-xs font-bold text-text-muted">{message}</p>
                <p className="text-[10px] text-text-subtle mt-1">Chưa có dữ liệu từ hệ thống</p>
            </div>
        </div>
    );
}