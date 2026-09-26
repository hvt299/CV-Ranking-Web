'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie } from 'recharts';
import { Activity, BarChart2, PieChart as PieIcon, Database, Radio, TrendingUp, Sparkles } from 'lucide-react';

export default function MemberAnalytics({ charts }: { charts: any }) {
    if (!charts) return null;

    const { daily_assigned_cvs, ai_score_histogram, status_distribution } = charts;

    const hasVelocityData = Array.isArray(daily_assigned_cvs) && daily_assigned_cvs.some((d: any) => d.count > 0);
    const hasAiScoreData = Array.isArray(ai_score_histogram) && ai_score_histogram.some((d: any) => d.value > 0);
    const hasStatusData = Array.isArray(status_distribution) && status_distribution.some((d: any) => d.value > 0);
    const hasTimeData = Array.isArray(charts.time_in_stage) && charts.time_in_stage.some((d: any) => d.days > 0);
    const hasFunnelData = Array.isArray(charts.personal_funnel) && charts.personal_funnel.some((d: any) => d.value > 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-1">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <BarChart2 className="w-5 h-5 text-primary-500" />
                            <span className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping opacity-60" />
                        </div>
                        <h2 className="text-xl font-black text-text tracking-tight">Báo cáo Cá nhân</h2>
                    </div>
                    <p className="text-xs text-text-subtle font-medium mt-1 ml-7">Phân tích hiệu suất xử lý và chất lượng hồ sơ bạn đang phụ trách</p>
                </div>

                <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg bg-background border border-border text-[10px] font-black uppercase tracking-widest text-text-subtle shadow-sm">
                    <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-success-500 opacity-75 animate-ping" />
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                    </span>
                    Monitoring
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <AnalyticsCard>
                    <AnalyticsHeader icon={<Activity className="w-4 h-4 text-primary-600 dark:text-primary-400" />} iconClassName="bg-primary-50 dark:bg-primary-500/10 border-primary-100 dark:border-primary-500/20" title="Tốc độ Xử lý Hồ sơ" description="Số lượng hồ sơ đã chuyển trạng thái trong 14 ngày gần nhất" />

                    <div className="relative h-[300px] w-full p-4">
                        {hasVelocityData ? (
                            <>
                                {daily_assigned_cvs[0]?.is_mock && <div className="absolute top-0 right-4 z-10 px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</div>}
                                <div className="absolute inset-8 rounded-full bg-primary-500/2.5 dark:bg-primary-500/4 blur-2xl pointer-events-none" />

                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={daily_assigned_cvs} margin={{ top: 10, right: 10, left: -20, bottom: 4 }}>
                                        <defs>
                                            <linearGradient id="memberVelocityGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />

                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />

                                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />

                                        <RechartsTooltip cursor={{ stroke: 'var(--color-primary-500)', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />

                                        <Area type="monotone" dataKey="count" name="Đã xử lý" stroke="var(--color-primary-500)" strokeWidth={2.5} fillOpacity={1} fill="url(#memberVelocityGradient)" dot={{ r: 3, fill: 'var(--color-primary-500)', strokeWidth: 2, stroke: 'var(--color-card-bg)' }} activeDot={{ r: 5, fill: 'var(--color-primary-500)', strokeWidth: 2, stroke: 'var(--color-card-bg)' }} isAnimationActive animationBegin={100} animationDuration={900} animationEasing="ease-out" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </>
                        ) : (
                            <ChartEmptyState icon={<Database className="w-6 h-6" />} title="Chưa có dữ liệu xử lý" description="Dữ liệu sẽ xuất hiện khi bạn bắt đầu xử lý hồ sơ ứng viên." />
                        )}
                    </div>
                </AnalyticsCard>

                <AnalyticsCard>
                    <AnalyticsHeader icon={<Sparkles className="w-4 h-4 text-warning-600 dark:text-warning-400" />} iconClassName="bg-warning-50 dark:bg-warning-500/10 border-warning-100 dark:border-warning-500/20" title="Chất lượng CV được giao" description="Phân bố điểm AI của các hồ sơ đang được bạn phụ trách" />

                    <div className="relative h-[300px] w-full p-4">
                        {hasAiScoreData ? (
                            <>
                                {ai_score_histogram[0]?.is_mock && <div className="absolute top-0 right-4 z-10 px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</div>}
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ai_score_histogram} margin={{ top: 10, right: 8, left: -20, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.5} />

                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />

                                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />

                                        <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />

                                        <Bar dataKey="value" name="Số lượng CV" radius={[5, 5, 0, 0]} barSize={30} isAnimationActive animationBegin={150} animationDuration={900} animationEasing="ease-out">
                                            {ai_score_histogram.map((entry: any, index: number) => (
                                                <Cell key={`ai-score-cell-${index}`} fill={entry.color || getScoreColor(index, ai_score_histogram.length)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        ) : (
                            <ChartEmptyState icon={<Sparkles className="w-6 h-6" />} title="Chưa có dữ liệu điểm AI" description="Dữ liệu sẽ xuất hiện khi hệ thống có hồ sơ được giao cho bạn." />
                        )}
                    </div>
                </AnalyticsCard>
            </div>

            <AnalyticsCard large>
                <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-linear-to-r from-success-500/2.5 via-transparent to-transparent dark:from-success-500/4">
                    <div className="flex items-start gap-3">
                        <div className="relative w-9 h-9 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 flex items-center justify-center shrink-0 shadow-sm">
                            <PieIcon className="w-4 h-4 text-success-600 dark:text-success-400" />
                            <span className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-success-500 border-2 border-card-bg" />
                        </div>

                        <div>
                            <h3 className="font-black text-text text-sm">Phân bổ Trạng thái Hồ sơ</h3>
                            <p className="text-xs font-medium text-text-subtle mt-1">Tình trạng các hồ sơ ứng viên bạn đang quản lý</p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-subtle bg-card-bg border border-border rounded-lg px-3 py-1.5 w-fit shadow-sm">
                        <Radio className="w-3 h-3 text-success-500" />
                        Pipeline
                    </div>
                </div>

                <div className="relative h-90 w-full p-4">
                    {hasStatusData ? (
                        <div className="relative w-full h-full">
                            {status_distribution[0]?.is_mock && <div className="absolute top-0 right-4 z-10 px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</div>}
                            <div className="absolute inset-16 rounded-full bg-success-500/2.5 dark:bg-success-500/4 blur-3xl pointer-events-none" />

                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={status_distribution} cx="50%" cy="50%" innerRadius={72} outerRadius={112} paddingAngle={4} dataKey="value" stroke="var(--color-card-bg)" strokeWidth={2} isAnimationActive animationBegin={100} animationDuration={900} animationEasing="ease-out">
                                        {status_distribution.map((entry: any, index: number) => (
                                            <Cell key={`status-cell-${index}`} fill={entry.color || getStatusColor(index)} />
                                        ))}
                                    </Pie>

                                    <RechartsTooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-text">{getTotalValue(status_distribution)}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-subtle mt-1">Tổng hồ sơ</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ChartEmptyState icon={<PieIcon className="w-6 h-6" />} title="Chưa có dữ liệu trạng thái" description="Dữ liệu sẽ xuất hiện khi bạn bắt đầu quản lý hồ sơ ứng viên." />
                    )}
                </div>

                {hasStatusData && (
                    <div className="px-5 pb-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {status_distribution.map((item: any, index: number) => (
                                <div key={`status-summary-${index}`} className="group/status flex items-center gap-2 px-2.5 py-2 rounded-xl bg-background border border-border hover:border-border-hover hover:shadow-sm transition-all duration-200">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${item.color || getStatusColor(index)}18`, color: item.color || getStatusColor(index) }}>
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || getStatusColor(index) }} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black uppercase tracking-wide text-text-subtle truncate">{item.name || item.label || 'Trạng thái'}</p>
                                        <p className="text-sm font-black text-text leading-none mt-0.5">{Number(item.value ?? item.count ?? 0)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </AnalyticsCard>

                <AnalyticsCard>
                    <AnalyticsHeader icon={<BarChart2 className="w-4 h-4 text-info-600 dark:text-info-400" />} iconClassName="bg-info-50 dark:bg-info-500/10 border-info-100 dark:border-info-500/20" title="Thời gian xử lý" description="Số ngày ngâm CV trung bình" />
                    <div className="relative h-[300px] w-full p-4">
                        {hasTimeData ? (
                            <>
                                {charts.time_in_stage[0]?.is_mock && <div className="absolute top-0 right-4 z-10 px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</div>}
                                <ResponsiveContainer width="100%" height="100%">
                                                                        <AreaChart data={charts.time_in_stage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                        <Area type="monotone" dataKey="days" name="Số ngày" stroke="var(--color-info-500)" strokeWidth={3} fillOpacity={1} fill="url(#timeGradient)" dot={{ r: 4, fill: 'var(--color-info-500)', strokeWidth: 2, stroke: 'var(--color-card-bg)' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </>
                        ) : (
                            <ChartEmptyState icon={<Database className="w-6 h-6" />} title="Chưa có dữ liệu thời gian" description="Chưa có đủ dữ liệu." />
                        )}
                    </div>
                </AnalyticsCard>

                <AnalyticsCard>
                    <AnalyticsHeader icon={<PieIcon className="w-4 h-4 text-warning-600 dark:text-warning-400" />} iconClassName="bg-warning-50 dark:bg-warning-500/10 border-warning-100 dark:border-warning-500/20" title="Tỷ lệ chuyển đổi cá nhân" description="Phễu lọc ứng viên cá nhân" />
                    <div className="relative h-[300px] w-full p-4">
                        {hasFunnelData ? (
                            <>
                                {charts.personal_funnel[0]?.is_mock && <div className="absolute top-0 right-4 z-10 px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</div>}
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={charts.personal_funnel} margin={{ top: 10, right: 8, left: -20, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />
                                        <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                        <Bar dataKey="value" name="Số lượng" radius={[5, 5, 0, 0]} barSize={26}>
                                            {charts.personal_funnel.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        ) : (
                            <ChartEmptyState icon={<Database className="w-6 h-6" />} title="Chưa có dữ liệu phễu" description="Chưa có đủ dữ liệu." />
                        )}
                    </div>
                </AnalyticsCard>
        </div>
    );
}

function getTotalValue(data: any[]): number {
    return data.reduce((total, item) => total + Number(item?.value ?? item?.count ?? 0), 0);
}

function getScoreColor(index: number, length: number): string {
    if (length <= 1) return '#2563eb';

    const colors = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#2563eb'];
    return colors[Math.min(index, colors.length - 1)];
}

function getStatusColor(index: number): string {
    const colors = ['#0ea5e9', '#f59e0b', '#2563eb', '#f43f5e', '#10b981', '#ef4444', '#64748b', '#475569'];
    return colors[index % colors.length];
}

function AnalyticsCard({ children, large = false }: { children: React.ReactNode; large?: boolean }) {
    return (
        <div className={`group relative bg-card-bg rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-md dark:shadow-black/20 dark:hover:shadow-black/30 transition-all duration-300 ${large ? '' : 'min-h-87.5'}`}>
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent group-hover:via-primary-400 dark:group-hover:via-primary-500 transition-colors duration-500 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary-500/2.5 dark:bg-primary-500/[0.035] blur-3xl pointer-events-none" />
            {children}
        </div>
    );
}

function AnalyticsHeader({ icon, iconClassName, title, description }: { icon: React.ReactNode; iconClassName: string; title: string; description: string }) {
    return (
        <div className="relative px-5 py-4 border-b border-border flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${iconClassName}`}>
                    {icon}
                </div>

                <div>
                    <h3 className="font-black text-text text-sm">{title}</h3>
                    <p className="text-xs font-medium text-text-subtle mt-1">{description}</p>
                </div>
            </div>
        </div>
    );
}

function ChartEmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="relative flex flex-col items-center justify-center text-center px-6 py-8 w-full h-full animate-in fade-in duration-500">
            <div className="absolute w-32 h-32 rounded-full bg-primary-500/[0.035] dark:bg-primary-500/5 blur-2xl" />

            <div className="relative w-14 h-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-text-subtle mb-4">
                {icon}
            </div>

            <p className="relative text-sm font-black text-text">{title}</p>
            <p className="relative text-xs text-text-subtle font-medium mt-1.5 max-w-xs leading-relaxed">{description}</p>

            <div className="relative flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg bg-background border border-border text-[9px] font-black uppercase tracking-widest text-text-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-text-subtle/50" />
                Waiting for data
            </div>
        </div>
    );
}