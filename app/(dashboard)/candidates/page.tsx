'use client';

import { useState, useEffect } from 'react';
import {
    Search, FileText, Mail, Phone, GraduationCap, Briefcase,
    GitCommitHorizontal, UploadCloud, FolderOutput, Trash2,
    Users, Globe, Eye
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';

export default function TalentPoolPage() {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    const [mappingCvId, setMappingCvId] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<any>(null);

    const fetchData = async () => {
        try {
            const [cvRes, jobRes] = await Promise.all([
                api.get('/cv/pool'),
                api.get('/jobs')
            ]);
            setCandidates(cvRes.data);
            setJobs(jobRes.data.filter((j: any) => j.status === 'open'));
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu hệ thống!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress({ current: 0, total: files.length });
        let successCount = 0, failCount = 0;

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            setUploadProgress(prev => ({ ...prev, current: i + 1 }));

            try {
                const res = await api.post('/cv/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data.is_existing) {
                    toast.error(`CV ${files[i].name} đã có trong kho!`);
                } else {
                    successCount++;
                }
            } catch (error: any) {
                failCount++;
                toast.error(`Lỗi: ${error.response?.data?.detail || 'Lỗi file'}`);
            }
        }

        setIsUploading(false);
        if (successCount > 0) toast.success(`Đã thêm ${successCount} CV mới vào Kho!`);
        fetchData();
        e.target.value = '';
    };

    const handleMapToJob = async () => {
        if (!mappingCvId || !selectedJobId) return toast.error("Vui lòng chọn một chiến dịch!");

        try {
            await api.post(`/cv/${mappingCvId}/map`, { job_id: selectedJobId });
            toast.success("Đã đưa ứng viên vào chiến dịch & bắt đầu chấm điểm!");
            setMappingCvId(null);
            setSelectedJobId('');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi ghép CV");
        }
    };

    const handleDeleteCV = async (cvId: string, filename: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${filename} khỏi hệ thống không? Dữ liệu ứng tuyển cũng sẽ bị xóa!`)) return;
        try {
            await api.delete(`/cv/${cvId}`);
            toast.success("Đã xóa vĩnh viễn CV!");
            setCandidates(prev => prev.filter(cv => cv.id !== cvId));
        } catch (error) {
            toast.error("Lỗi khi xóa CV");
        }
    };

    const filteredCandidates = candidates.filter(cv => {
        const term = searchTerm.toLowerCase();
        return cv.filename?.toLowerCase().includes(term) ||
            cv.candidate_info?.email?.toLowerCase().includes(term) ||
            cv.extracted_skills?.some((s: string) => s.toLowerCase().includes(term));
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-350 mx-auto pb-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Kho hồ sơ (Talent Pool)</h1>
                    <p className="text-slate-500 mt-1">Lưu trữ tập trung. Phân tích 1 lần, ứng tuyển nhiều dự án.</p>
                </div>
            </div>

            {/* KHU VỰC UPLOAD CHUNG */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-3xl p-8 text-center relative hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                <input type="file" multiple accept=".pdf,.docx" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Đang tải và Bóc tách NLP...</h3>
                        <p className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm">Tiến độ: {uploadProgress.current} / {uploadProgress.total} file</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <UploadCloud className="w-8 h-8 text-blue-500 mb-1" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Kéo thả CV mới vào Kho (Nhiều file cùng lúc)</h3>
                        <p className="text-slate-500 text-xs font-medium">Hệ thống sẽ tự động bóc tách dữ liệu. Hỗ trợ .PDF, .DOCX</p>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Tìm theo Tên, Email hoặc Kỹ năng..." className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* BẢNG DANH SÁCH CV GỐC */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th className="p-4 pl-6">Ứng viên</th>
                                <th className="p-4">Học vấn & Kinh nghiệm</th>
                                <th className="p-4 w-1/3">Kỹ năng phân tích được</th>
                                <th className="p-4 pr-6 text-right w-40">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {filteredCandidates.map((cv) => {
                                const skillExp = cv.candidate_info?.skill_experience || {};

                                return (
                                    <tr key={cv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        {/* CỘT 1: ỨNG VIÊN & SOCIAL LINKS */}
                                        <td className="p-4 pl-6">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 mt-1"><FileText className="w-4 h-4" /></div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 mb-1">{cv.filename}</p>
                                                    <div className="space-y-1.5 mt-1">
                                                        {cv.candidate_info?.email && <a href={`mailto:${cv.candidate_info.email}`} className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max"><Mail className="w-3 h-3 shrink-0" /> {cv.candidate_info.email}</a>}
                                                        {cv.candidate_info?.phone && <a href={`tel:${cv.candidate_info.phone.replace(/[^0-9+]/g, '')}`} className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max"><Phone className="w-3 h-3 shrink-0" /> {cv.candidate_info.phone}</a>}
                                                        {cv.candidate_info?.linkedin && <a href={cv.candidate_info.linkedin.startsWith('http') ? cv.candidate_info.linkedin : `https://${cv.candidate_info.linkedin}`} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max"><Users className="w-3 h-3 shrink-0" /><span className="truncate max-w-45">{cv.candidate_info.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span></a>}
                                                        {cv.candidate_info?.github && <a href={cv.candidate_info.github.startsWith('http') ? cv.candidate_info.github : `https://${cv.candidate_info.github}`} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max"><GitCommitHorizontal className="w-3 h-3 shrink-0" /><span className="truncate max-w-45">{cv.candidate_info.github.replace(/^https?:\/\/(www\.)?/, '')}</span></a>}
                                                        {cv.candidate_info?.portfolio && cv.candidate_info.portfolio.length > 0 && cv.candidate_info.portfolio.map((link: string, i: number) => (
                                                            <a key={i} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max"><Globe className="w-3 h-3 shrink-0" /><span className="truncate max-w-45">{link.replace(/^https?:\/\/(www\.)?/, '')}</span></a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* CỘT 2: HỌC VẤN & KINH NGHIỆM */}
                                        <td className="p-4">
                                            <div className="space-y-2 mb-2">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <GraduationCap className="w-3 h-3 text-slate-400" />
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                        {cv.candidate_info?.education_level || 'Không đề cập'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs">
                                                    <Briefcase className="w-3 h-3 text-slate-400" />
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200 border-b border-dashed border-slate-400 cursor-help" title="Số năm kinh nghiệm hệ thống dự đoán">
                                                        {cv.candidate_info?.years_of_experience || 0} năm KN
                                                    </span>
                                                </div>

                                                {/* NÚT MỞ MODAL XEM CHI TIẾT */}
                                                <button
                                                    onClick={() => setSelectedCandidateForSkills(cv)}
                                                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-2 py-1.5 rounded-md transition-colors w-max mt-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Xem chi tiết kỹ năng & kinh nghiệm
                                                </button>
                                            </div>
                                        </td>

                                        {/* CỘT 3: KỸ NĂNG */}
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {/* Hiển thị 5 kỹ năng đầu tiên */}
                                                {cv.extracted_skills?.slice(0, 5).map((skill: string, idx: number) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-600">
                                                        {skill}
                                                    </span>
                                                ))}

                                                {/* Nút chỉ báo còn kỹ năng bị ẩn */}
                                                {cv.extracted_skills?.length > 5 && (
                                                    <span
                                                        className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-200 cursor-pointer hover:bg-blue-100"
                                                        onClick={() => setSelectedCandidateForSkills(cv)}
                                                        title="Bấm vào để xem toàn bộ kỹ năng"
                                                    >
                                                        +{cv.extracted_skills.length - 5} kỹ năng khác
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* CỘT 4: HÀNH ĐỘNG */}
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <button onClick={() => setMappingCvId(cv.id)} className="flex items-center gap-1 text-[11px] font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                                    <FolderOutput className="w-3 h-3" /> Đưa vào Job
                                                </button>
                                                <button onClick={() => handleDeleteCV(cv.id, cv.filename)} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors">
                                                    <Trash2 className="w-3 h-3" /> Xóa CV
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: GHÉP CV VÀO JOB */}
            {mappingCvId && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <FolderOutput className="w-5 h-5 text-blue-500" /> Chọn chiến dịch
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">Hệ thống sẽ đối chiếu và chấm điểm AI CV này dựa trên yêu cầu của chiến dịch bạn chọn.</p>

                        <select
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-blue-500 dark:text-white mb-6"
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                            <option value="" disabled>-- Vui lòng chọn chiến dịch đang mở --</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title} ({job.company_name})</option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setMappingCvId(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Hủy</button>
                            <button onClick={handleMapToJob} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30">Ghép & Chấm điểm AI</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KỸ NĂNG */}
            <CandidateSkillsModal
                isOpen={!!selectedCandidateForSkills}
                onClose={() => setSelectedCandidateForSkills(null)}
                candidate={selectedCandidateForSkills}
            />
        </div>
    );
}