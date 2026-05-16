import React from 'react';
import { DollarSign, Clock, GraduationCap, CheckCircle2, Star, FileText, Zap } from 'lucide-react';

interface JobDetailsContentProps {
    jobInfo: any;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
};

export default function JobDetailsContent({ jobInfo }: JobDetailsContentProps) {
    if (!jobInfo) return null;

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-2 fade-in duration-300">
            {/* CỘT TRÁI: Nội dung chi tiết (Mô tả, Yêu cầu, Quyền lợi) */}
            <div className="lg:col-span-2 space-y-6">
                {jobInfo.description && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" /> Mô tả công việc
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{jobInfo.description}</p>
                    </div>
                )}

                {jobInfo.requirements && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Yêu cầu ứng viên
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{jobInfo.requirements}</p>
                    </div>
                )}

                {jobInfo.benefits && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" /> Quyền lợi & Chế độ
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{jobInfo.benefits}</p>
                    </div>
                )}
            </div>

            {/* CỘT PHẢI: Tóm tắt thông số & Kỹ năng yêu cầu */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
                    {/* Lương */}
                    <div className="flex items-start gap-3 text-sm">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5"><DollarSign className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase">Mức lương</p>
                            <p className="font-bold text-slate-700 dark:text-slate-200">
                                {jobInfo.salary?.min_salary ? `${formatCurrency(jobInfo.salary.min_salary)} - ${formatCurrency(jobInfo.salary.max_salary)} ${jobInfo.salary.currency}` : 'Thỏa thuận'}
                            </p>
                        </div>
                    </div>
                    {/* Thời gian */}
                    <div className="flex items-start gap-3 text-sm">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5"><Clock className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase">Thời gian làm việc</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{jobInfo.working_hours}</p>
                        </div>
                    </div>
                    {/* Kinh nghiệm & Học vấn */}
                    <div className="flex items-start gap-3 text-sm">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5"><GraduationCap className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase">Yêu cầu tối thiểu</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{jobInfo.min_yoe} năm KN • {jobInfo.education?.min_level}</p>
                        </div>
                    </div>
                </div>

                {/* YÊU CẦU KỸ NĂNG (SKILLS) */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Kỹ năng chuyên môn
                    </h3>

                    {jobInfo.required_skills && jobInfo.required_skills.length > 0 && (
                        <div className="mb-3">
                            <p className="text-[11px] font-bold text-slate-500 mb-1.5">BẮT BUỘC:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {jobInfo.required_skills.map((skill: any, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-600">
                                        {skill.name} {skill.min_years > 0 && <span className="text-blue-500 ml-1">({skill.min_years}y)</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {jobInfo.preferred_skills && jobInfo.preferred_skills.length > 0 && (
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 mb-1.5">ƯU TIÊN (ĐIỂM CỘNG):</p>
                            <div className="flex flex-wrap gap-1.5">
                                {jobInfo.preferred_skills.map((skill: any, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-md border border-emerald-200 dark:border-emerald-800/50">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}