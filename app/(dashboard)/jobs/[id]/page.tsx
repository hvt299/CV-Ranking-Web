'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    UploadCloud, Users, ArrowLeft, FileText, CheckCircle2,
    XCircle, Award, BrainCircuit, Briefcase, Mail, Phone,
    GraduationCap, Building2, GitCommitHorizontal
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function JobLeaderboardPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const [jobInfo, setJobInfo] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

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
                toast.error(`Lỗi file ${file.name}: ${error.response?.data?.detail || 'Không xác định'}`);
            }
        }

        setIsUploading(false);

        if (successCount > 0) {
            toast.success(`Đã phân tích thành công ${successCount} CV!`);
            fetchRanking();
        }
        if (failCount > 0) {
            toast.error(`Có ${failCount} CV thất bại. Kiểm tra lại định dạng!`);
        }

        e.target.value = '';
    };

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-350 mx-auto pb-20 space-y-8">
            {/* 1. HEADER */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button onClick={() => router.push('/jobs')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-bold mb-3 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                    </button>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-1">{jobInfo?.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {jobInfo?.company}</span>
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg"><Users className="w-4 h-4" /> {candidates.length} Ứng viên</span>
                    </div>
                </div>
            </div>

            {/* 2. KHU VỰC DRAG & DROP UPLOAD */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-3xl p-10 text-center relative hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                <input
                    type="file"
                    multiple
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            <BrainCircuit className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">AI đang chấm điểm CV...</h3>
                        <p className="text-slate-500 font-medium bg-white px-4 py-1.5 rounded-full shadow-sm">
                            Đang xử lý {uploadProgress.current} / {uploadProgress.total} hồ sơ
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-2">
                            <UploadCloud className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Kéo thả CV vào đây hoặc click để chọn</h3>
                        <p className="text-slate-500 text-sm font-medium">Hỗ trợ định dạng .PDF, .DOCX (Tối đa 5MB/file). Bạn có thể chọn nhiều file cùng lúc.</p>
                    </div>
                )}
            </div>

            {/* 3. BẢNG XẾP HẠNG (LEADERBOARD) */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Award className="w-6 h-6 text-amber-500" /> Bảng xếp hạng Ứng viên (AI Ranking)
                    </h2>
                </div>

                {candidates.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-medium">Chưa có ứng viên nào. Hãy upload CV để AI bắt đầu chấm điểm nhé!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="p-4 pl-6 w-16 text-center">Top</th>
                                    <th className="p-4 w-1/4">Thông tin Ứng viên</th>
                                    <th className="p-4 w-1/4">Học vấn & Kinh nghiệm</th>
                                    <th className="p-4 w-1/4">Phân tích Kỹ năng (Match / Missing)</th>
                                    <th className="p-4 pr-6 w-48 text-right">AI Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {candidates.map((cv, index) => {
                                    const score = cv.ai_score?.total_score || 0;
                                    const breakdown = cv.ai_score?.score_breakdown || {};

                                    const otherSkillsCount = (cv.extracted_skills?.length || 0) - (cv.ai_score?.matched_skills?.length || 0);

                                    let rankColor = "bg-slate-100 text-slate-600";
                                    if (index === 0) rankColor = "bg-amber-100 text-amber-600 shadow-sm border border-amber-200";
                                    if (index === 1) rankColor = "bg-slate-200 text-slate-700 shadow-sm border border-slate-300";
                                    if (index === 2) rankColor = "bg-orange-100 text-orange-600 shadow-sm border border-orange-200";

                                    return (
                                        <tr key={cv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                            {/* Cột 1: Hạng */}
                                            <td className="p-4 pl-6 text-center">
                                                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-black text-sm ${rankColor}`}>
                                                    #{index + 1}
                                                </div>
                                            </td>

                                            {/* Cột 2: Thông tin cơ bản */}
                                            <td className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 mt-1">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-bold text-slate-800 dark:text-white line-clamp-1" title={cv.filename}>{cv.filename}</p>
                                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-[10px] font-bold rounded-full whitespace-nowrap">
                                                                {cv.status || 'Mới'}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {cv.candidate_info?.email && (
                                                                <a href={`mailto:${cv.candidate_info.email}`} className="text-xs text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1.5 transition-colors">
                                                                    <Mail className="w-3 h-3" /> {cv.candidate_info.email}
                                                                </a>
                                                            )}
                                                            {cv.candidate_info?.phone && (
                                                                <a href={`tel:${cv.candidate_info.phone.replace(/[^0-9+]/g, '')}`} className="text-xs text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1.5 transition-colors">
                                                                    <Phone className="w-3 h-3" /> {cv.candidate_info.phone}
                                                                </a>
                                                            )}
                                                            {cv.candidate_info?.github && (
                                                                <a href={cv.candidate_info.github.startsWith('http') ? cv.candidate_info.github : `https://${cv.candidate_info.github}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1.5">
                                                                    <GitCommitHorizontal className="w-3 h-3" /> {cv.candidate_info.github}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 3: Học vấn & Kinh nghiệm */}
                                            <td className="p-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <GraduationCap className="w-4 h-4 text-slate-400" />
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300 line-clamp-1" title={cv.candidate_info?.education_level}>{cv.candidate_info?.education_level || 'Không đề cập'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{cv.candidate_info?.years_of_experience || 0} năm kinh nghiệm</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 4: Tag Kỹ năng */}
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar">
                                                    {cv.ai_score?.matched_skills?.map((skill: string, idx: number) => (
                                                        <span key={`match-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider">
                                                            <CheckCircle2 className="w-3 h-3" /> {skill}
                                                        </span>
                                                    ))}
                                                    {cv.ai_score?.missing_required_skills?.map((skill: string, idx: number) => (
                                                        <span key={`miss-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold uppercase tracking-wider opacity-80">
                                                            <XCircle className="w-3 h-3" /> {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                                {otherSkillsCount > 0 && (
                                                    <p className="text-[10px] text-slate-400 mt-2 italic">
                                                        * AI phát hiện thêm {otherSkillsCount} kỹ năng khác trong CV
                                                    </p>
                                                )}
                                            </td>

                                            {/* Cột 5: Cột Điểm số */}
                                            <td className="p-4 pr-6">
                                                <div className="text-right mb-2">
                                                    <span className={`text-2xl font-black ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                        {score.toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-bold ml-1">/ 100</span>
                                                </div>

                                                {/* Mini progress bars cho TẤT CẢ các điểm thành phần */}
                                                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                                    <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-500">
                                                        <div className="flex justify-between"><span>KỸ NĂNG</span> <span>{breakdown.skills_score?.toFixed(0) || 0}</span></div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, breakdown.skills_score || 0)}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-500">
                                                        <div className="flex justify-between"><span>NGỮ NGHĨA</span> <span>{breakdown.nlp_score?.toFixed(0) || 0}</span></div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, breakdown.nlp_score || 0)}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-500">
                                                        <div className="flex justify-between"><span>KINH NGHIỆM</span> <span>{breakdown.experience_score?.toFixed(0) || 0}</span></div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, breakdown.experience_score || 0)}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-500">
                                                        <div className="flex justify-between"><span>HỌC VẤN</span> <span>{breakdown.education_score?.toFixed(0) || 0}</span></div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, breakdown.education_score || 0)}%` }}></div>
                                                        </div>
                                                    </div>
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