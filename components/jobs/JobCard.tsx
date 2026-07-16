'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Building2, Clock, DollarSign, UploadCloud, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Job } from '@/types';

interface PublicJob extends Partial<Job> {
    company_name?: string;
    required_skills?: any;
}

interface JobCardProps {
    job: PublicJob;
    cvLibrary?: any[];
    onApplySuccess?: () => void;
}

export default function JobCard({ job, cvLibrary, onApplySuccess }: JobCardProps) {
    const [expandedJob, setExpandedJob] = useState(false);
    const [applyingJob, setApplyingJob] = useState(false);
    const [uploadingId, setUploadingId] = useState(false);
    const [selectedCvId, setSelectedCvId] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [agreeAI, setAgreeAI] = useState(false);

    const handleApply = async () => {
        if (!cvLibrary || cvLibrary.length === 0) {
            toast.error("Bạn chưa có CV trong thư viện!");
            return;
        }

        if (!selectedCvId) {
            toast.error("Vui lòng chọn CV từ thư viện để ứng tuyển!");
            return;
        }

        if (!agreeAI) {
            toast.error("Vui lòng đồng ý với thỏa thuận AI và bảo mật dữ liệu!");
            return;
        }

        setUploadingId(true);
        try {
            const res = await api.post(`/apply/jobs/${job.id}`, {
                cv_document_id: selectedCvId,
                cover_letter: coverLetter
            });
            toast.success(res.data.message || 'Nộp hồ sơ thành công!');
            setApplyingJob(false);
            onApplySuccess?.();
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Nộp hồ sơ thất bại');
        } finally {
            setUploadingId(false);
        }
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
                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company_name || 'Công ty Ẩn danh'}</span>
                            {job.location?.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location.city}</span>}
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.work_mode} • {job.job_level}</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {formatSalary(job.salary)}</span>
                        </div>
                        {job.deadline && (
                            <p className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.required_skills?.slice(0, 6).map((skill: any, i: number) => (
                                <span key={i} className="text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-500/20">
                                    {typeof skill === 'string' ? skill : skill.name}
                                </span>
                            ))}
                            {job.required_skills?.length > 6 && <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5">+{job.required_skills.length - 6} khác</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                        <button
                            onClick={() => setApplyingJob(!applyingJob)}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <UploadCloud className="w-4 h-4" /> Nộp hồ sơ
                        </button>
                        <button onClick={() => setExpandedJob(!expandedJob)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-1 justify-center">
                            {expandedJob ? <><ChevronUp className="w-4 h-4" /> Ẩn bớt</> : <><ChevronDown className="w-4 h-4" /> Xem JD</>}
                        </button>
                    </div>
                </div>

                {/* FORM NỘP HỒ SƠ 1 CHẠM */}
                {applyingJob && (
                    <div className="mt-4 p-5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/20 animate-in slide-in-from-top-2">
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3">Chọn CV từ Thư viện để ứng tuyển</p>

                        {cvLibrary && cvLibrary.length > 0 ? (
                            <>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <select
                                        value={selectedCvId}
                                        onChange={e => setSelectedCvId(e.target.value)}
                                        className="flex-1 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 dark:text-slate-200"
                                    >
                                        <option value="">-- Click để chọn CV của bạn --</option>
                                        {cvLibrary?.map(cv => (
                                            <option key={cv.id} value={cv.id}>{cv.display_name} ({cv.filename})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Thêm Thư giới thiệu và Checkbox AI */}
                                <div className="mt-3">
                                    <textarea
                                        placeholder="Thư giới thiệu (Cover Letter) - Tùy chọn, giúp bạn nổi bật hơn trước Nhà tuyển dụng..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 dark:text-slate-200 resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="mt-3 flex items-start gap-3 bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800/50">
                                    <input
                                        type="checkbox"
                                        id={`agree-${job.id}`}
                                        checked={agreeAI}
                                        onChange={(e) => setAgreeAI(e.target.checked)}
                                        className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                    />
                                    <label htmlFor={`agree-${job.id}`} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                                        Tôi đồng ý cho phép hệ thống sử dụng <span className="font-bold text-blue-600 dark:text-blue-400">Trí tuệ nhân tạo (AI)</span> để phân tích dữ liệu hồ sơ và đồng ý với <a href="#" className="underline font-bold">Thỏa thuận sử dụng dữ liệu cá nhân</a> của hệ thống ATS.
                                    </label>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleApply}
                                        disabled={uploadingId || !selectedCvId || !agreeAI}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center min-w-32 shadow-lg shadow-blue-500/20"
                                    >
                                        {uploadingId ? 'Đang chấm điểm...' : 'Xác nhận nộp'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                Bạn chưa có CV nào trong thư viện. Vui lòng vào <Link href="/cv-library" className="text-blue-600 font-bold hover:underline">Thư viện CV</Link> để tải lên hồ sơ của bạn.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {expandedJob && (
                <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-4">
                    {job.description && <div><h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Mô tả công việc</h3><p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{job.description}</p></div>}
                    {job.requirements && <div><h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Yêu cầu ứng viên</h3><p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{job.requirements}</p></div>}
                    {job.benefits && <div><h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Quyền lợi</h3><p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{job.benefits}</p></div>}
                </div>
            )}
        </div>
    );
}