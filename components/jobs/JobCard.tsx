'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, Building2, Clock, DollarSign, UploadCloud, ChevronDown, ChevronUp, GraduationCap, Flame, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Job, SkillDetail } from '@/types';
import { formatSalaryRange } from '@/utils/format';
import { applicationService } from '@/features/application/application.service';

interface PublicJob extends Partial<Job> {
    company_name?: string;
}

interface JobCardProps {
    job: PublicJob;
    cvLibrary?: any[];
    onApplySuccess?: () => void;
    isPublic?: boolean;
}

export default function JobCard({ job, cvLibrary, onApplySuccess, isPublic }: JobCardProps) {
    const router = useRouter();
    const [expandedJob, setExpandedJob] = useState(false);
    const [applyingJob, setApplyingJob] = useState(false);
    const [uploadingId, setUploadingId] = useState(false);
    const [selectedCvId, setSelectedCvId] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [agreeAI, setAgreeAI] = useState(false);

    const handleInitApply = () => {
        if (isPublic) {
            toast.error("Vui lòng đăng nhập để ứng tuyển công việc này!");
            router.push('/login');
            return;
        }
        setApplyingJob(!applyingJob);
    };

    const handleApply = async () => {
        if (!cvLibrary || cvLibrary.length === 0) {
            toast.error("Bạn chưa có CV trong thư viện!"); return;
        }
        if (!selectedCvId) {
            toast.error("Vui lòng chọn CV từ thư viện để ứng tuyển!"); return;
        }
        if (!agreeAI) {
            toast.error("Vui lòng đồng ý với thỏa thuận AI và bảo mật dữ liệu!"); return;
        }

        setUploadingId(true);
        try {
            const res = await applicationService.applyForJob(job.id!, {
                cv_document_id: selectedCvId,
                cover_letter: coverLetter
            });
            toast.success(res.message || 'Nộp hồ sơ thành công!');
            setApplyingJob(false);
            onApplySuccess?.();
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Nộp hồ sơ thất bại');
        } finally {
            setUploadingId(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl hover:border-blue-400 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all flex flex-col relative group overflow-hidden">
            {/* Decor Hover Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative z-20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setExpandedJob(!expandedJob)}>
                                {job.title}
                            </h2>
                            {job.is_hot && (
                                <span className="flex items-center gap-1 bg-linear-to-r from-rose-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm shrink-0">
                                    <Flame className="w-3 h-3" /> Hot
                                </span>
                            )}
                        </div>

                        {/* Thông tin Meta: View & Apply */}
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                <Eye className="w-3.5 h-3.5" /> {(job.view_count || 0).toLocaleString()} lượt xem
                            </span>
                            <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
                                <Users className="w-3.5 h-3.5" /> {(job.num_applications || 0).toLocaleString()} lượt ứng tuyển
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" /> {job.company_name || 'Công ty Ẩn danh'}</span>
                            {/* FIX: Sử dụng province_name (cho trong nước) hoặc country (nếu là nước ngoài) */}
                            {(job.location?.province_name || job.location?.country) && (
                                <span className="flex items-center gap-1.5" title={job.location.full_address_snapshot || job.location.street_address}>
                                    <MapPin className="w-4 h-4 text-rose-500" />
                                    {job.location.country && job.location.country !== 'Việt Nam'
                                        ? job.location.country
                                        : job.location.province_name}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-500" /> {job.work_mode} • {job.employment_type} • {job.job_level}</span>
                            <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> {formatSalaryRange(job.salary)}</span>
                            {(job.min_yoe || 0) > 0 && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> Từ {job.min_yoe} năm KN</span>}
                            {job.education?.min_level && job.education.min_level !== 'Không yêu cầu' && <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-indigo-500" /> {job.education.min_level}</span>}
                        </div>
                        {job.deadline && (
                            <p className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.required_skills?.slice(0, 6).map((skill: SkillDetail, i: number) => (
                                <span key={i} className="text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-500/20">
                                    {skill.name}
                                </span>
                            ))}
                            {(job.required_skills?.length || 0) > 6 && <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5">+{job.required_skills!.length - 6} khác</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        <button
                            onClick={handleInitApply}
                            className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            <UploadCloud className="w-4 h-4" /> Ứng tuyển ngay
                        </button>
                        <button onClick={() => setExpandedJob(!expandedJob)} className="w-full md:w-auto px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-1 justify-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                            {expandedJob ? <><ChevronUp className="w-4 h-4" /> Ẩn JD</> : <><ChevronDown className="w-4 h-4" /> Xem JD</>}
                        </button>
                    </div>
                </div>

                {/* FORM NỘP HỒ SƠ 1 CHẠM */}
                {applyingJob && (
                    <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 relative z-20 shadow-inner">
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3">Chọn CV từ Thư viện để ứng tuyển</p>

                        {cvLibrary && cvLibrary.length > 0 ? (
                            <>
                                <select
                                    value={selectedCvId}
                                    onChange={e => setSelectedCvId(e.target.value)}
                                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 dark:text-slate-200"
                                >
                                    <option value="">-- Click để chọn CV của bạn --</option>
                                    {cvLibrary?.map(cv => (
                                        <option key={cv.id} value={cv.id}>{cv.display_name} ({cv.filename})</option>
                                    ))}
                                </select>

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
                                        className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
                                    />
                                    <label htmlFor={`agree-${job.id}`} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                                        Tôi đồng ý cho phép hệ thống sử dụng <span className="font-bold text-blue-600 dark:text-blue-400">Trí tuệ nhân tạo (AI)</span> để phân tích dữ liệu hồ sơ và đồng ý với <a href="#" className="underline font-bold hover:text-blue-600">Thỏa thuận sử dụng dữ liệu cá nhân</a> của hệ thống ATS.
                                    </label>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleApply}
                                        disabled={uploadingId || !selectedCvId || !agreeAI}
                                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center shadow-lg shadow-blue-500/20"
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
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-6 relative z-20 animate-in fade-in slide-in-from-top-2">
                    {job.description && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Mô tả công việc</h3>
                            <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
                        </div>
                    )}
                    {job.requirements && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 border-l-4 border-rose-500 pl-2">Yêu cầu ứng viên</h3>
                            <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                        </div>
                    )}
                    {job.benefits && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 border-l-4 border-emerald-500 pl-2">Quyền lợi & Chế độ</h3>
                            <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}