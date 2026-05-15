'use client';

import { useState, useRef } from 'react';
import { Briefcase, MapPin, Building2, Clock, DollarSign, UploadCloud, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface JobCardProps {
    job: any;
    onApplySuccess?: () => void;
}

export default function JobCard({ job, onApplySuccess }: JobCardProps) {
    const [expandedJob, setExpandedJob] = useState(false);
    const [applyingJob, setApplyingJob] = useState(false);
    const [uploadingId, setUploadingId] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleApply = async (file: File) => {
        setUploadingId(true);
        const form = new FormData();
        form.append('file', file);
        try {
            const res = await api.post(`/apply/jobs/${job.id}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(res.data.message);
            setApplyingJob(false);
            
            onApplySuccess?.();
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Nộp hồ sơ thất bại');
        } finally {
            setUploadingId(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleExpandJob = () => {
        const newExpanded = !expandedJob;
        setExpandedJob(newExpanded);
    };

    const formatSalary = (salary: any) => {
        if (!salary?.min_salary) return 'Thỏa thuận';
        return `${new Intl.NumberFormat('vi-VN').format(salary.min_salary)} - ${new Intl.NumberFormat('vi-VN').format(salary.max_salary)} ${salary.currency}`;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{job.title}</h2>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.company_name}
                            </span>
                            {job.location?.city && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {job.location.city}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {job.work_mode} • {job.job_level}
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {formatSalary(job.salary)}
                            </span>
                        </div>
                        {job.deadline && (
                            <p className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 
                                Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.required_skills?.slice(0, 6).map((skill: string, i: number) => (
                                <span 
                                    key={i} 
                                    className="text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-500/20"
                                >
                                    {skill}
                                </span>
                            ))}
                            {job.required_skills?.length > 6 && (
                                <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5">
                                    +{job.required_skills.length - 6} khác
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                        <button
                            onClick={() => setApplyingJob(!applyingJob)}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <UploadCloud className="w-4 h-4" /> 
                            Nộp hồ sơ
                        </button>
                        <button
                            onClick={handleExpandJob}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-1 justify-center"
                        >
                            {expandedJob ? (
                                <>
                                    <ChevronUp className="w-4 h-4" /> 
                                    Ẩn bớt
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" /> 
                                    Xem JD
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Upload CV */}
                {applyingJob && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">
                            Chọn file CV để nộp (PDF hoặc DOCX, tối đa 5MB)
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx"
                            disabled={uploadingId}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleApply(file);
                            }}
                            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
                        />
                        {uploadingId && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-blue-700 dark:text-blue-400">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                Đang phân tích và nộp hồ sơ...
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* JD chi tiết */}
            {expandedJob && (
                <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-4">
                    {job.description && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Mô tả công việc
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                {job.description}
                            </p>
                        </div>
                    )}
                    {job.requirements && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Yêu cầu ứng viên
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                {job.requirements}
                            </p>
                        </div>
                    )}
                    {job.benefits && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Quyền lợi
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                {job.benefits}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}