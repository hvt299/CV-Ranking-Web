'use client';

import { DollarSign, Clock, Users, MapPin, Briefcase, FileText, CheckCircle2, Star, Info } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange } from '@/utils/format';
import { INDUSTRIES } from '@/constants/job.constants';

interface TabJobInfoProps {
    jobInfo: Job;
}

export default function TabJobInfo({ jobInfo }: TabJobInfoProps) {
    if (!jobInfo) return null;

    const renderHTML = (htmlContent?: string) => {
        if (!htmlContent || htmlContent === '<p></p>') {
            return <p className="text-sm text-slate-400 italic">Chưa có dữ liệu.</p>;
        }

        return (
            <div className="text-sm leading-7 text-slate-600 dark:text-slate-300 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-slate-800 dark:[&_strong]:text-slate-100 [&_h1]:font-bold [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h3]:font-semibold [&_h3]:text-slate-800 dark:[&_h3]:text-slate-100 [&_ul]:my-3 [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:pl-5 [&_li]:mb-1.5 [&_li::marker]:text-slate-400 [&_a]:text-primary-600 dark:[&_a]:text-primary-400" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        );
    };

    const industry = INDUSTRIES.find(i => i.value === jobInfo.industry)?.label || jobInfo.industry || 'Đang cập nhật';

    const isForeignLocation = jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam';

    const locationTitle = isForeignLocation
        ? jobInfo.location?.country
        : jobInfo.location?.province_name || 'Việt Nam';

    const locationDetail = isForeignLocation
        ? jobInfo.location?.street_address || 'Chưa cập nhật địa chỉ chi tiết'
        : [jobInfo.location?.street_address, jobInfo.location?.ward_name, jobInfo.location?.district_name].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ chi tiết';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">

                <main className="min-w-0 space-y-8">

                    <section>
                        <SectionHeader icon={FileText} iconClass="text-primary-600 dark:text-primary-400" title="Mô tả công việc" description="Tổng quan về vai trò và trách nhiệm của vị trí" />
                        <ContentPanel>{renderHTML(jobInfo.description)}</ContentPanel>
                    </section>

                    <section>
                        <SectionHeader icon={CheckCircle2} iconClass="text-success-600 dark:text-success-400" title="Yêu cầu ứng viên" description="Những năng lực và tiêu chí cần có" />
                        <ContentPanel>{renderHTML(jobInfo.requirements)}</ContentPanel>
                    </section>

                    <section>
                        <SectionHeader icon={Star} iconClass="text-warning-600 dark:text-warning-400" title="Quyền lợi & Chế độ" description="Các chính sách và quyền lợi dành cho nhân sự" />
                        <ContentPanel>{renderHTML(jobInfo.benefits)}</ContentPanel>
                    </section>

                    {jobInfo.other_info && jobInfo.other_info !== '<p></p>' && (
                        <section>
                            <SectionHeader icon={Info} iconClass="text-info-600 dark:text-info-400" title="Thông tin khác" description="Các thông tin bổ sung về vị trí" />
                            <ContentPanel>{renderHTML(jobInfo.other_info)}</ContentPanel>
                        </section>
                    )}

                </main>

                <aside className="xl:sticky xl:top-6">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/70">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                                    <Briefcase className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Tổng quan vị trí</h3>
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Thông tin tuyển dụng</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">

                            <InfoRow
                                icon={DollarSign}
                                label="Mức lương"
                                value={formatSalaryRange(jobInfo.salary)}
                                iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                valueClass="text-emerald-700 dark:text-emerald-400"
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Khu vực làm việc"
                                value={locationTitle || 'Việt Nam'}
                                description={locationDetail}
                                iconClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            />

                            <InfoRow
                                icon={Clock}
                                label="Thời gian làm việc"
                                value={jobInfo.working_hours || 'Giờ hành chính'}
                                description={`Thử việc: ${jobInfo.probation_period || 'Không yêu cầu'}`}
                                iconClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <CompactInfo icon={Users} label="Số lượng" value={`${jobInfo.headcount || 1} người`} />
                                <CompactInfo icon={Briefcase} label="Ngành nghề" value={industry} />
                            </div>

                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    iconClass,
    title,
    description,
}: {
    icon: typeof FileText;
    iconClass: string;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-4 flex items-start gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${iconClass}`}>
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
}

function ContentPanel({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:px-6 sm:py-6">
            {children}
        </div>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
    description,
    iconClass,
    valueClass = 'text-slate-800 dark:text-white',
}: {
    icon: typeof DollarSign;
    label: string;
    value?: string;
    description?: string;
    iconClass: string;
    valueClass?: string;
}) {
    return (
        <div className="flex gap-3 rounded-xl p-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                <p className={`mt-1 text-sm font-bold ${valueClass}`}>{value || 'Đang cập nhật'}</p>

                {description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
                )}
            </div>
        </div>
    );
}

function CompactInfo({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Users;
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            </div>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>

            <p className="mt-1 line-clamp-2 text-xs font-bold text-slate-800 dark:text-white" title={value}>
                {value}
            </p>
        </div>
    );
}