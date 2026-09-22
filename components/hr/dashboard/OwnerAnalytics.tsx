'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, BarChart2, PieChart as PieIcon, Database, Radio } from 'lucide-react';
import { ApplicationStatus } from '@/types/common';
import { APPLICATION_STATUS_CONFIG } from '@/constants/application.constants';

export default function OwnerAnalytics({ charts }: { charts: any }) {
    if (!charts) return null;

    const { top_jobs, pipeline_health, team_workload, hiring_goal } = charts;

    
    const hasTopJobsData = Array.isArray(top_jobs) && top_jobs.length > 0;

    const pipelineData = buildPipelineData(pipeline_health);
    const hasPipelineData = pipelineData.length > 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-1">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <BarChart2 className="w-5 h-5 text-primary-500" />
                            <span className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping opacity-60" />
                        </div>
                        <h2 className="text-xl font-black text-text tracking-tight">Báo cáo Tuyển dụng</h2>
                    </div>
                    <p className="text-xs text-text-subtle font-medium mt-1 ml-7">Phân tích hoạt động và sức khỏe của nguồn ứng viên</p>
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
                    <AnalyticsHeader icon={<Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />} iconClassName="bg-primary-50 dark:bg-primary-500/10 border-primary-100 dark:border-primary-500/20" title="Hiệu suất Nhân viên" description="Lượng CV đang được phân công" />

                    <div className="relative flex-1 min-h-67.5 w-full p-4">
                        {team_workload && team_workload.length > 0 ? (
                            <>
                                {team_workload[0]?.is_mock && <div className="absolute top-0 right-4 z-10 px-2 py-1 bg-warning-100 text-warning-700 text-[10px] font-bold rounded">Mock Data</div>}
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={team_workload} margin={{ top: 10, right: 8, left: -20, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />
                                        <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />
                                        <Bar dataKey="cv_count" name="Số CV đang xử lý" radius={[5, 5, 0, 0]} barSize={26}>
                                            {team_workload.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        ) : (
                            <ChartEmptyState icon={<Users className="w-6 h-6" />} title="Chưa có dữ liệu phân công" description="Dữ liệu sẽ xuất hiện khi có nhân viên được gán xử lý hồ sơ." />
                        )}
                    </div>
                </AnalyticsCard>

                <AnalyticsCard>
                    <AnalyticsHeader icon={<BarChart2 className="w-4 h-4 text-info-600 dark:text-info-400" />} iconClassName="bg-info-50 dark:bg-info-500/10 border-info-100 dark:border-info-500/20" title="Chiến dịch Nổi bật" description="Top 5 chiến dịch thu hút nhiều CV nhất" />

                    <div className="relative flex-1 min-h-67.5 w-full p-4">
                        {hasTopJobsData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={top_jobs} margin={{ top: 10, right: 8, left: -20, bottom: 4 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.5} />

                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} dy={10} />

                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />

                                    <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }}  itemStyle={{ color: "var(--color-text)", fontWeight: "bold" }} />

                                    <Bar dataKey="cv_count" name="Số lượng CV" radius={[5, 5, 0, 0]} barSize={26} isAnimationActive animationBegin={150} animationDuration={900} animationEasing="ease-out">
                                        {top_jobs?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <ChartEmptyState icon={<BarChart2 className="w-6 h-6" />} title="Chưa có chiến dịch nổi bật" description="Chưa ghi nhận đủ dữ liệu CV để tạo bảng xếp hạng." />
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
                            <h3 className="font-black text-text text-sm">Sức khỏe Đường ống Tuyển dụng</h3>
                            <p className="text-xs font-medium text-text-subtle mt-1">Phân bổ ứng viên theo trạng thái</p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-subtle bg-card-bg border border-border rounded-lg px-3 py-1.5 w-fit shadow-sm">
                        <Radio className="w-3 h-3 text-success-500" />
                        Pipeline
                    </div>
                </div>

                <div className="relative h-90 w-full p-4">
                    {hasPipelineData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pipelineData} layout="vertical" margin={{ top: 4, right: 30, left: 8, bottom: 4 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />

                                <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 600 }} />

                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text)', fontSize: 11, fontWeight: 700 }} width={125} />

                                <RechartsTooltip cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5 }} contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)', boxShadow: 'var(--shadow-dropdown)', color: 'var(--color-text)', fontWeight: 'bold' }} formatter={(value: any, _name: any, props: any) => [`${value} ứng viên`, props?.payload?.name || 'Ứng viên']} itemStyle={{ color: 'var(--color-text)', fontWeight: 'bold' }} />

                                <Bar dataKey="value" name="Ứng viên" radius={[0, 6, 6, 0]} barSize={25} isAnimationActive animationBegin={250} animationDuration={900} animationEasing="ease-out">
                                    {pipelineData.map((entry: any, index: number) => (
                                        <Cell key={`pipeline-cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ChartEmptyState icon={<Activity className="w-6 h-6" />} title="Đường ống đang trống" description="Chưa có ứng viên được ghi nhận trong các trạng thái tuyển dụng." />
                    )}
                </div>

                <div className="px-5 pb-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                        {pipelineData.map((item: any) => {
                            const config = APPLICATION_STATUS_CONFIG[item.status];
                            const Icon = config?.icon || Activity;

                            return (
                                <div key={item.status} className="group/status flex items-center gap-2 px-2.5 py-2 rounded-xl bg-background border border-border hover:border-border-hover hover:shadow-sm transition-all duration-200">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config?.color || 'bg-slate-100 text-slate-500'}`}>
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black uppercase tracking-wide text-text-subtle truncate">{item.name}</p>
                                        <p className="text-sm font-black text-text leading-none mt-0.5">{item.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AnalyticsCard>
        </div>
    );
}

function buildPipelineData(pipelineHealth: any[]): any[] {
    const statuses = [
        ApplicationStatus.NEW,
        ApplicationStatus.REVIEWING,
        ApplicationStatus.INTERVIEW,
        ApplicationStatus.OFFERED,
        ApplicationStatus.HIRED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
        ApplicationStatus.EXPIRED
    ];

    const source = Array.isArray(pipelineHealth) ? pipelineHealth : [];

    return statuses.map((status) => {
        const config = APPLICATION_STATUS_CONFIG[status];

        const existing = source.find((item: any) => {
            return item?.status === status || item?.application_status === status || item?.id === status;
        });

        return {
            ...(existing || {}),
            status,
            name: config?.label || status,
            value: Number(existing?.value ?? existing?.count ?? 0),
            fill: getStatusChartColor(status)
        };
    });
}

function getStatusChartColor(status: ApplicationStatus): string {
    switch (status) {
        case ApplicationStatus.NEW:
            return '#0ea5e9';

        case ApplicationStatus.REVIEWING:
            return '#f59e0b';

        case ApplicationStatus.INTERVIEW:
            return '#2563eb';

        case ApplicationStatus.OFFERED:
            return '#f43f5e';

        case ApplicationStatus.HIRED:
            return '#10b981';

        case ApplicationStatus.REJECTED:
            return '#ef4444';

        case ApplicationStatus.WITHDRAWN:
            return '#64748b';

        case ApplicationStatus.EXPIRED:
            return '#475569';

        default:
            return '#2563eb';
    }
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