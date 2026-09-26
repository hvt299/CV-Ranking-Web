'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, Cell } from 'recharts';
import { Target, TrendingUp, Activity, Crosshair, Database, Radio } from 'lucide-react';

interface ApplicantAnalyticsProps {
    metrics: any;
}

export default function ApplicantAnalytics({ metrics }: ApplicantAnalyticsProps) {
    if (!metrics) return null;

    const { funnel, ai_radar, activity_trend } = metrics.charts || {};

    const hasFunnelData = Array.isArray(funnel) && funnel.length > 0;
    const hasRadarData = Array.isArray(ai_radar) && ai_radar.length > 0;
    const hasActivityData = Array.isArray(activity_trend) && activity_trend.length > 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-1">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Target className="w-5 h-5 text-primary-500" />
                            <span className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping opacity-60" />
                        </div>
                        <h2 className="text-xl font-black text-text tracking-tight">Phân tích Hiệu suất Hồ sơ</h2>
                    </div>
                    <p className="text-xs text-text-subtle font-medium mt-1 ml-7">Phân tích hành trình ứng tuyển và sức mạnh hồ sơ của bạn</p>
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
                    <AnalyticsHeader icon={<TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />} iconClassName="bg-primary-50 dark:bg-primary-500/10 border-primary-100 dark:border-primary-500/20" title="Phễu Ứng tuyển" description="Tỷ lệ chuyển đổi qua các vòng tuyển dụng" />

                    <div className="relative flex-1 min-h-[350px] w-full p-4">
                        {hasFunnelData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnel} layout="vertical" barCategoryGap="20%" margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                                    <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text)', fontSize: 11, fontWeight: 700 }} width={95} />
                                    <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} labelStyle={{ color: 'var(--color-text)', fontWeight: 700 }} itemStyle={{ color: 'var(--color-text)', fontWeight: 700 }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)' }} />
                                    <Bar dataKey="value" name="Số lượng" radius={[0, 6, 6, 0]} barSize={18} isAnimationActive animationBegin={100} animationDuration={900} animationEasing="ease-out">
                                        {funnel.map((entry: any, index: number) => (
                                            <Cell key={`funnel-cell-${index}`} fill={entry.fill || 'var(--color-primary-500)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <ChartEmptyState icon={<Database className="w-6 h-6" />} title="Chưa có dữ liệu phễu ứng tuyển" description="Dữ liệu sẽ xuất hiện khi hệ thống ghi nhận các hoạt động ứng tuyển của bạn." />
                        )}
                    </div>
                </AnalyticsCard>

                <AnalyticsCard>
                    <AnalyticsHeader icon={<Crosshair className="w-4 h-4 text-info-600 dark:text-info-400" />} iconClassName="bg-info-50 dark:bg-info-500/10 border-info-100 dark:border-info-500/20" title="Điểm AI Trung bình" description="Sức mạnh CV theo từng tiêu chí đánh giá" />

                    <div className="relative flex-1 min-h-75 w-full p-4">
                        {hasRadarData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={ai_radar}>
                                    <PolarGrid stroke="var(--color-border)" opacity={0.5} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Điểm Match" dataKey="A" stroke="var(--color-info-500)" fill="var(--color-info-500)" fillOpacity={0.3} strokeWidth={2} isAnimationActive animationBegin={150} animationDuration={900} animationEasing="ease-out" />
                                    <RechartsTooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <ChartEmptyState icon={<Crosshair className="w-6 h-6" />} title="Chưa có điểm AI" description="Điểm đánh giá sẽ xuất hiện khi CV của bạn được hệ thống phân tích." />
                        )}
                    </div>
                </AnalyticsCard>
            </div>

            <AnalyticsCard large>
                <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-linear-to-r from-success-500/2.5 via-transparent to-transparent dark:from-success-500/4">
                    <div className="flex items-start gap-3">
                        <div className="relative w-9 h-9 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 flex items-center justify-center shrink-0 shadow-sm">
                            <Activity className="w-4 h-4 text-success-600 dark:text-success-400" />
                            <span className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-success-500 border-2 border-card-bg" />
                        </div>

                        <div>
                            <h3 className="font-black text-text text-sm">Hoạt động Ứng tuyển</h3>
                            <p className="text-xs font-medium text-text-subtle mt-1">Số lượng chiến dịch bạn đã nộp CV trong 14 ngày gần đây</p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-subtle bg-card-bg border border-border rounded-lg px-3 py-1.5 w-fit shadow-sm">
                        <Radio className="w-3 h-3 text-success-500" />
                        Activity
                    </div>
                </div>

                <div className="relative h-85 w-full p-4">
                    {hasActivityData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activity_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-success-500)" stopOpacity={0.22} />
                                        <stop offset="95%" stopColor="var(--color-success-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />

                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />

                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />

                                <RechartsTooltip cursor={{ stroke: 'var(--color-success-500)', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }} />

                                <Area type="monotone" dataKey="applied" name="Số lần nộp" stroke="var(--color-success-500)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApplied)" isAnimationActive animationBegin={200} animationDuration={900} animationEasing="ease-out" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <ChartEmptyState icon={<Activity className="w-6 h-6" />} title="Chưa có hoạt động ứng tuyển" description="Các hoạt động nộp CV của bạn sẽ được hiển thị tại đây khi có dữ liệu." />
                    )}
                </div>
            </AnalyticsCard>
        </div>
    );
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
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${iconClassName}`}>{icon}</div>

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

            <div className="relative w-14 h-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-text-subtle mb-4">{icon}</div>

            <p className="relative text-sm font-black text-text">{title}</p>
            <p className="relative text-xs text-text-subtle font-medium mt-1.5 max-w-xs leading-relaxed">{description}</p>

            <div className="relative flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg bg-background border border-border text-[9px] font-black uppercase tracking-widest text-text-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-text-subtle/50" />
                Waiting for data
            </div>
        </div>
    );
}