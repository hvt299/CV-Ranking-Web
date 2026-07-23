'use client';

import { useState, useEffect } from 'react';
import {
    Search, FileText, Mail, Phone, GraduationCap, Briefcase,
    GitCommitHorizontal, UploadCloud, FolderOutput, Trash2,
    Users, Globe, Eye, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';
import DocumentViewer from '@/components/shared/DocumentViewer';
import { CV, Job, JobStatus } from '@/types';
import { useTalentPool } from '@/features/candidate/useCandidate';

export default function TalentPoolPage() {
    const {
        candidates, jobs, isLoading, isUploading, uploadProgress,
        uploadFiles, deleteCV, mapCvToJob
    } = useTalentPool();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEducation, setFilterEducation] = useState('All');
    const [filterExperience, setFilterExperience] = useState('All');

    const [mappingCvId, setMappingCvId] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<CV | null>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string, name: string } | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Toàn bộ logic check size, chia chunk, gọi API upload đã nằm trong uploadFiles()
        await uploadFiles(e.target.files);
        e.target.value = ''; // Reset lại input để lần sau chọn lại file đó không bị lỗi
    };

    const handleMapToJob = async () => {
        if (!mappingCvId || !selectedJobId) return toast.error("Vui lòng chọn một chiến dịch!");

        // Logic gọi API đã nằm trong mapCvToJob()
        const success = await mapCvToJob(mappingCvId, selectedJobId);
        if (success) {
            setMappingCvId(null);
            setSelectedJobId('');
        }
    };

    const filteredCandidates = candidates.filter(cv => {
        const term = searchTerm.toLowerCase();
        const cInfo = cv.candidate_info || {};

        // 1. Lọc theo Text (Search)
        const matchSearch = cv.filename?.toLowerCase().includes(term) ||
            cInfo.email?.toLowerCase().includes(term) ||
            (cv.extracted_skills || []).some((s: string) => s.toLowerCase().includes(term));

        // 2. Lọc theo Học vấn
        const matchEdu = filterEducation === 'All' || cInfo.education_level === filterEducation;

        // 3. Lọc theo Kinh nghiệm
        let matchExp = true;
        if (filterExperience !== 'All') {
            const yoe = cInfo.years_of_experience || 0;
            if (filterExperience === '0') matchExp = yoe < 1;
            else if (filterExperience === '1-3') matchExp = yoe >= 1 && yoe <= 3;
            else if (filterExperience === '3-5') matchExp = yoe > 3 && yoe <= 5;
            else if (filterExperience === '5+') matchExp = yoe > 5;
        }

        return matchSearch && matchEdu && matchExp;
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Kho hồ sơ (Talent Pool)</h1>
                    <p className="text-slate-500 mt-1">Lưu trữ tập trung. Phân tích 1 lần, ứng tuyển nhiều dự án.</p>
                </div>
            </div>

            {/* KHU VỰC UPLOAD CHUNG */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-3xl p-8 text-center relative hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                <input type="file" multiple accept=".pdf,.docx" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Đang tải và Bóc tách NLP...</h3>
                        <p className="text-xs text-slate-500 font-medium bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">Tiến độ: {uploadProgress.current} / {uploadProgress.total} file</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <UploadCloud className="w-8 h-8 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Kéo thả CV mới vào Kho (Nhiều file cùng lúc)</h3>
                        <p className="text-slate-500 text-xs font-medium">Hệ thống tự bóc tách dữ liệu. Hỗ trợ .PDF, .DOCX (Tối đa 5MB/file)</p>
                    </div>
                )}
            </div>

            {/* THANH TÌM KIẾM & BỘ LỌC */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm theo Tên, Email hoặc Kỹ năng..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-blue-500 dark:text-white transition-colors placeholder:font-normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Dropdown Filters */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="relative min-w-42.5 grow sm:grow-0">
                            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none cursor-pointer focus:border-blue-500 dark:text-white transition-colors appearance-none"
                                value={filterEducation}
                                onChange={(e) => setFilterEducation(e.target.value)}
                            >
                                <option value="All">Tất cả học vấn</option>
                                <option value="Không đề cập">Không đề cập</option>
                                <option value="Trung cấp">Trung cấp</option>
                                <option value="Cao đẳng">Cao đẳng</option>
                                <option value="Cử nhân">Cử nhân / Đại học</option>
                                <option value="Thạc sĩ">Thạc sĩ</option>
                                <option value="Tiến sĩ">Tiến sĩ</option>
                            </select>
                        </div>

                        <div className="relative min-w-45 grow sm:grow-0">
                            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none cursor-pointer focus:border-blue-500 dark:text-white transition-colors appearance-none"
                                value={filterExperience}
                                onChange={(e) => setFilterExperience(e.target.value)}
                            >
                                <option value="All">Tất cả kinh nghiệm</option>
                                <option value="0">Chưa có kinh nghiệm</option>
                                <option value="1-3">Từ 1 - 3 năm</option>
                                <option value="3-5">Từ 3 - 5 năm</option>
                                <option value="5+">Trên 5 năm</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer Bộ Lọc */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-sm font-bold text-slate-500">
                        Đã tìm thấy <span className="text-blue-600 dark:text-blue-400 text-base">{filteredCandidates.length}</span> hồ sơ
                    </div>
                    {(searchTerm || filterEducation !== 'All' || filterExperience !== 'All') && (
                        <button
                            onClick={() => { setSearchTerm(''); setFilterEducation('All'); setFilterExperience('All'); }}
                            className="text-rose-500 hover:text-rose-600 text-xs font-bold hover:underline bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </div>
            </div>

            {/* DANH SÁCH CV GỐC (LIST VIEW TOPCV STYLE) */}
            <div className="space-y-4">
                {filteredCandidates.map((cv) => {
                    const cInfo = cv.candidate_info || {};
                    const filename = cv.filename || 'CV Không tên';
                    const skills = cv.extracted_skills || [];

                    return (
                        <div key={cv.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start xl:items-center">

                                {/* Cột 1: Thông tin ứng viên (Col span 4) */}
                                <div className="xl:col-span-4 flex items-start gap-4">
                                    <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-bold text-xl bg-blue-100 text-blue-600 border-2 border-blue-200">
                                        {filename.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight" title={filename}>{filename}</h3>
                                        <div className="space-y-1.5">
                                            {cInfo.email && <a href={`mailto:${cInfo.email}`} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{cInfo.email}</span></a>}
                                            {cInfo.phone && <a href={`tel:${cInfo.phone}`} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5 truncate"><Phone className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{cInfo.phone}</span></a>}
                                            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate"><Clock className="w-3.5 h-3.5 shrink-0" /> Tải lên: {new Date(cv.created_at || Date.now()).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cột 2: Học vấn & Kinh nghiệm (Col span 3) */}
                                <div className="xl:col-span-3 flex flex-col justify-center gap-3 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-700 pt-4 xl:pt-0 xl:pl-6 h-full">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <GraduationCap className="w-4 h-4 text-slate-400" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                {cInfo.education_level || 'Không đề cập học vấn'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="w-4 h-4 text-slate-400" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-200 border-b border-dashed border-slate-400 cursor-help" title="Số năm kinh nghiệm hệ thống dự đoán">
                                                {cInfo.years_of_experience || 0} năm kinh nghiệm
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cột 3: Kỹ năng bóc tách (Col span 3) */}
                                <div className="xl:col-span-3 flex flex-col justify-center border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-700 pt-4 xl:pt-0 xl:pl-6 h-full">
                                    <p className="text-xs font-bold text-slate-500 mb-2">Kỹ năng phân tích được:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {skills.slice(0, 5).map((skill: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-600">
                                                {skill}
                                            </span>
                                        ))}
                                        {skills.length > 5 && (
                                            <span
                                                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-200 cursor-pointer hover:bg-blue-100"
                                                onClick={() => setSelectedCandidateForSkills(cv)}
                                            >
                                                +{skills.length - 5} khác
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Cột 4: Thao tác (Col span 2) */}
                                <div className="xl:col-span-2 flex flex-row xl:flex-col justify-between items-center xl:items-end border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-700 pt-4 xl:pt-0 xl:pl-6 h-full w-full">
                                    <button onClick={() => setMappingCvId(cv.id)} className="w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-3 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                                        <FolderOutput className="w-4 h-4" /> Đưa vào Job
                                    </button>

                                    <div className="flex items-center gap-2 mt-0 xl:mt-auto">
                                        {cv.file_url && (
                                            <button onClick={() => setPreviewFile({ url: cv.file_url || '', name: cv.filename })} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem CV gốc">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button onClick={() => setSelectedCandidateForSkills(cv)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Xem chi tiết kỹ năng">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteCV(cv.id, cv.filename)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa vĩnh viễn">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                })}

                {filteredCandidates.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 font-medium">Chưa có hồ sơ nào khớp với tìm kiếm.</p>
                    </div>
                )}
            </div>

            {/* MODAL: GHÉP CV VÀO JOB */}
            {mappingCvId && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <FolderOutput className="w-5 h-5 text-blue-500" /> Chọn chiến dịch
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">Hệ thống sẽ đối chiếu và chấm điểm AI CV này dựa trên yêu cầu của chiến dịch bạn chọn.</p>

                        <select
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-blue-500 dark:text-white mb-6"
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                            <option value="" disabled>-- Vui lòng chọn chiến dịch đang mở --</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title} ({job.company_name || 'Công ty của bạn'})</option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setMappingCvId(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl">Hủy</button>
                            <button onClick={handleMapToJob} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30">Ghép & Chấm điểm AI</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KỸ NĂNG */}
            {selectedCandidateForSkills && (
                <CandidateSkillsModal
                    isOpen={!!selectedCandidateForSkills}
                    onClose={() => setSelectedCandidateForSkills(null)}
                    candidate={selectedCandidateForSkills}
                />
            )}

            {/* MODAL DOCUMENT VIEWER */}
            {previewFile && (
                <DocumentViewer
                    url={previewFile.url}
                    filename={previewFile.name}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </div>
    );
}