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
        if (!htmlContent || htmlContent === '<p></p>') return <p className="text-slate-500 italic text-sm">Chưa có dữ liệu.</p>;
        return <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* CỘT TRÁI: Nội dung chi tiết (Rich Text) */}
            <div className="xl:col-span-2 space-y-8">
                <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary-500" /> Mô tả công việc
                    </h3>
                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {renderHTML(jobInfo.description)}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Yêu cầu ứng viên
                    </h3>
                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {renderHTML(jobInfo.requirements)}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" /> Quyền lợi & Chế độ
                    </h3>
                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {renderHTML(jobInfo.benefits)}
                    </div>
                </div>

                {jobInfo.other_info && jobInfo.other_info !== '<p></p>' && (
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-500" /> Thông tin khác
                        </h3>
                        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                            {renderHTML(jobInfo.other_info)}
                        </div>
                    </div>
                )}
            </div>

            {/* CỘT PHẢI: Các thông số cụ thể */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2 px-1">
                    Tổng quan vị trí
                </h3>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    {/* Lương */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Mức lương</p>
                            <p className="text-sm font-black text-slate-800 dark:text-white">
                                {formatSalaryRange(jobInfo.salary)}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                    {/* Địa điểm */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Khu vực làm việc</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                                {jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam' ? jobInfo.location.country : (jobInfo.location?.province_name || 'Việt Nam')}
                            </p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-snug mt-1">
                                {jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam'
                                    ? jobInfo.location.street_address
                                    : [jobInfo.location?.street_address, jobInfo.location?.ward_name, jobInfo.location?.district_name].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ chi tiết'}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                    {/* Thời gian làm việc */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 mt-0.5">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Thời gian</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{jobInfo.working_hours || 'Giờ hành chính'}</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">Thử việc: {jobInfo.probation_period || 'Không yêu cầu'}</p>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                    {/* Số lượng & Cấp bậc */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2.5">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg shrink-0">
                                <Users className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số lượng</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{jobInfo.headcount || 1} người</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg shrink-0">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngành nghề</p>
                                <p
                                    className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2"
                                    title={INDUSTRIES.find(i => i.value === jobInfo.industry)?.label || jobInfo.industry || 'Đang cập nhật'}
                                >
                                    {INDUSTRIES.find(i => i.value === jobInfo.industry)?.label || jobInfo.industry || 'Đang cập nhật'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}