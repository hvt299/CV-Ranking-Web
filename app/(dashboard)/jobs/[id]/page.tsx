'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    UploadCloud, Users, ArrowLeft, FileText, CheckCircle2,
    XCircle, Award, BrainCircuit, Briefcase, Mail, Phone,
    GraduationCap, Building2, GitCommitHorizontal, ChevronDown, ChevronUp,
    DollarSign, Clock, MapPin, Search, Filter, Trash2
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const CV_STATUSES = [
    { value: 'Mới', label: 'Mới', color: 'bg-blue-100 text-blue-700' },
    { value: 'Đang xem xét', label: 'Đang xem xét', color: 'bg-amber-100 text-amber-700' },
    { value: 'Phỏng vấn', label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700' },
    { value: 'Đề nghị (Offer)', label: 'Đề nghị (Offer)', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'Trúng tuyển', label: 'Trúng tuyển', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'Từ chối', label: 'Từ chối', color: 'bg-rose-100 text-rose-700' },
];

export default function JobLeaderboardPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const [jobInfo, setJobInfo] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [showJobDetails, setShowJobDetails] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchRanking = useCallback(async () => {
        try {
            const res = await api.get(`/jobs/${jobId}/ranking`);
            setJobInfo(res.data.job_info);
            setCandidates(res.data.leaderboard);
        } catch (error) {
            toast.error("Không thể tải bảng xếp hạng!");
            router.push('/jobs');
        } finally {
            setIsLoading(false);
        }
    }, [jobId, router]);

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress({ current: 0, total: files.length });

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('job_id', jobId);
            setUploadProgress(prev => ({ ...prev, current: i + 1 }));

            try {
                await api.post('/cv/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                successCount++;
            } catch (error: any) {
                failCount++;
                toast.error(`Lỗi file ${file.name}: ${error.response?.data?.detail || 'Lỗi hệ thống'}`);
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            toast.success(`Đã phân tích thành công ${successCount} CV!`);
            fetchRanking();
        }
        if (failCount > 0) toast.error(`Có ${failCount} CV thất bại.`);
        e.target.value = '';
    };

    const handleStatusChange = async (cvId: string, newStatus: string) => {
        try {
            await api.patch(`/cv/${cvId}`, { status: newStatus });
            toast.success("Cập nhật trạng thái thành công");
            setCandidates(prev => prev.map(cv => cv.id === cvId ? { ...cv, status: newStatus } : cv));
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const handleDeleteCV = async (cvId: string, filename: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn CV: ${filename}?`)) return;
        try {
            await api.delete(`/cv/${cvId}`);
            toast.success("Đã xóa CV thành công");
            setCandidates(prev => prev.filter(cv => cv.id !== cvId));
        } catch (error) {
            toast.error("Lỗi khi xóa CV");
        }
    };

    const filteredCandidates = candidates.filter(cv => {
        const matchesSearch = cv.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.candidate_info?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || cv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (val: number | null | undefined) => {
        if (!val) return 'Thỏa thuận';
        return new Intl.NumberFormat('vi-VN').format(val);
    };

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-350 mx-auto pb-20 space-y-6">
            {/* 1. HEADER & JOB DETAILS */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <button onClick={() => router.push('/jobs')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-bold mb-3 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Danh sách chiến dịch
                        </button>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{jobInfo?.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {jobInfo?.company_name}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {jobInfo?.location?.city || 'Việt Nam'}</span>
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                {jobInfo?.work_mode} • {jobInfo?.job_level}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                        <button
                            onClick={() => setShowJobDetails(!showJobDetails)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {showJobDetails ? 'Đóng chi tiết JD' : 'Xem chi tiết JD'}
                            {showJobDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* KHU VỰC CHI TIẾT JOB (TOGGLE) */}
                {showJobDetails && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-wider">Mô tả công việc</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{jobInfo?.description}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-wider">Yêu cầu ứng viên</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{jobInfo?.requirements}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><DollarSign className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Mức lương</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">
                                            {jobInfo?.salary?.min_salary ? `${formatCurrency(jobInfo.salary.min_salary)} - ${formatCurrency(jobInfo.salary.max_salary)} ${jobInfo.salary.currency}` : 'Thỏa thuận'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Thời gian làm việc</p>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200">{jobInfo?.working_hours}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><GraduationCap className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Yêu cầu Kinh nghiệm</p>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200">{jobInfo?.min_yoe} năm • {jobInfo?.education?.min_level}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. DRAG & DROP UPLOAD */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-3xl p-8 text-center relative hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                <input type="file" multiple accept=".pdf,.docx" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">AI đang phân tích CV...</h3>
                        <p className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm">Tiến độ: {uploadProgress.current} / {uploadProgress.total} hồ sơ</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <UploadCloud className="w-8 h-8 text-blue-500 mb-1" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Kéo thả CV vào đây (Nhiều file cùng lúc)</h3>
                        <p className="text-slate-500 text-xs font-medium">Hỗ trợ .PDF, .DOCX (Tối đa 5MB/file)</p>
                    </div>
                )}
            </div>

            {/* 3. TOOLBAR & LEADERBOARD */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" /> Bảng xếp hạng AI ({filteredCandidates.length})
                    </h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm tên CV, Email..."
                                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative min-w-35">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none appearance-none cursor-pointer focus:border-blue-500"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="All">Tất cả trạng thái</option>
                                {CV_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                {filteredCandidates.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-medium">Không tìm thấy ứng viên nào phù hợp.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="p-4 pl-6 w-12 text-center">Top</th>
                                    <th className="p-4 w-1/4">Thông tin Ứng viên</th>
                                    <th className="p-4 w-1/4">Học vấn & Kỹ năng</th>
                                    <th className="p-4 w-48 text-right">AI Score</th>
                                    <th className="p-4 pr-6 w-40 text-center">Quản lý</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredCandidates.map((cv, index) => {
                                    const score = cv.ai_score?.total_score || 0;
                                    const breakdown = cv.ai_score?.score_breakdown || {};
                                    const otherSkillsCount = (cv.extracted_skills?.length || 0) - (cv.ai_score?.matched_skills?.length || 0);

                                    let rankColor = "bg-slate-100 text-slate-600";
                                    if (statusFilter === 'All') {
                                        if (index === 0) rankColor = "bg-amber-100 text-amber-600 border border-amber-200 shadow-sm";
                                        if (index === 1) rankColor = "bg-slate-200 text-slate-700 border border-slate-300 shadow-sm";
                                        if (index === 2) rankColor = "bg-orange-100 text-orange-600 border border-orange-200 shadow-sm";
                                    }

                                    return (
                                        <tr key={cv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                            {/* CỘT 1: Hạng */}
                                            <td className="p-4 pl-6 text-center">
                                                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-black text-sm ${rankColor}`}>
                                                    {statusFilter === 'All' ? `#${index + 1}` : '-'}
                                                </div>
                                            </td>

                                            {/* CỘT 2: Thông tin */}
                                            <td className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 mt-1"><FileText className="w-4 h-4" /></div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 mb-1" title={cv.filename}>{cv.filename}</p>
                                                        <div className="space-y-1">
                                                            {cv.candidate_info?.email && <a href={`mailto:${cv.candidate_info.email}`} className="text-xs text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1.5"><Mail className="w-3 h-3" /> {cv.candidate_info.email}</a>}
                                                            {cv.candidate_info?.phone && <a href={`tel:${cv.candidate_info.phone.replace(/[^0-9+]/g, '')}`} className="text-xs text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1.5"><Phone className="w-3 h-3" /> {cv.candidate_info.phone}</a>}
                                                            {cv.candidate_info?.github && <a href={cv.candidate_info.github.startsWith('http') ? cv.candidate_info.github : `https://${cv.candidate_info.github}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1.5"><GitCommitHorizontal className="w-3 h-3" /> Github Profile</a>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* CỘT 3: Kỹ năng & Học vấn */}
                                            <td className="p-4">
                                                <div className="space-y-2 mb-2">
                                                    <div className="flex items-center gap-2 text-xs"><GraduationCap className="w-3 h-3 text-slate-400" /> <span className="font-semibold text-slate-700">{cv.candidate_info?.education_level || 'Không đề cập'}</span></div>
                                                    <div className="flex items-center gap-2 text-xs"><Briefcase className="w-3 h-3 text-slate-400" /> <span className="font-semibold text-slate-700">{cv.candidate_info?.years_of_experience || 0} năm KN</span></div>
                                                </div>
                                                <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto custom-scrollbar">
                                                    {cv.ai_score?.matched_skills?.map((skill: string, idx: number) => (
                                                        <span key={idx} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold uppercase"><CheckCircle2 className="w-2 h-2 inline mr-1" />{skill}</span>
                                                    ))}
                                                    {cv.ai_score?.missing_required_skills?.map((skill: string, idx: number) => (
                                                        <span key={idx} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9px] font-bold uppercase opacity-75"><XCircle className="w-2 h-2 inline mr-1" />{skill}</span>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* CỘT 4: Điểm AI */}
                                            <td className="p-4 pr-6">
                                                <div className="text-right mb-1">
                                                    <span className={`text-xl font-black ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{score.toFixed(1)}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold ml-1">/100</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>K.NĂNG</span><span>{breakdown.skills_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, breakdown.skills_score || 0)}%` }}></div></div></div>
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>N.NGHĨA</span><span>{breakdown.nlp_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, breakdown.nlp_score || 0)}%` }}></div></div></div>
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>K.NGHIỆM</span><span>{breakdown.experience_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, breakdown.experience_score || 0)}%` }}></div></div></div>
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>H.VẤN</span><span>{breakdown.education_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, breakdown.education_score || 0)}%` }}></div></div></div>
                                                </div>
                                            </td>

                                            {/* CỘT 5: Quản lý (Trạng thái & Xóa) */}
                                            <td className="p-4 pr-6 text-center">
                                                <div className="flex flex-col items-end gap-2">
                                                    <select
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer appearance-none text-center border-none shadow-sm transition-colors ${CV_STATUSES.find(s => s.value === (cv.status || 'Mới'))?.color || 'bg-slate-100 text-slate-700'}`}
                                                        value={cv.status || 'Mới'}
                                                        onChange={(e) => handleStatusChange(cv.id, e.target.value)}
                                                    >
                                                        {CV_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                    </select>

                                                    <button
                                                        onClick={() => handleDeleteCV(cv.id, cv.filename)}
                                                        className="text-[10px] flex items-center gap-1 font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Xóa CV
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}