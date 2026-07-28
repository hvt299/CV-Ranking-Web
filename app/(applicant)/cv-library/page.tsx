'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, Eye, Clock, GraduationCap, Briefcase, CheckCircle2 } from 'lucide-react';
import DocumentViewer from '@/components/shared/DocumentViewer';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';
import { useMyCvLibrary } from '@/features/application/useApplication';

export default function CVLibraryPage() {
    const { cvs, isLoading, isUploading, uploadProgress, uploadFiles, deleteCV } = useMyCvLibrary();

    const [previewDocument, setPreviewDocument] = useState<{
        url: string;
        filename: string;
    } | null>(null);

    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<any | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await uploadFiles(e.target.files);
        e.target.value = ''; // Reset input
    };

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div></div>;

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Thư viện CV của tôi</h1>
                    <p className="text-slate-500 mt-1">Quản lý các bản CV của bạn. Tải lên 1 lần, ứng tuyển "1 chạm" cho nhiều công việc.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                    Đã lưu: <span className="text-blue-600 dark:text-blue-400">{cvs.length}</span> CV
                </div>
            </div>

            {/* KHU VỰC UPLOAD CHUNG */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-3xl p-8 text-center relative hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                <input type="file" multiple accept=".pdf,.docx" onChange={handleUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Đang tải và Bóc tách AI...</h3>
                        <p className="text-xs text-slate-500 font-medium bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">Tiến độ: {uploadProgress.current} / {uploadProgress.total} file</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <UploadCloud className="w-8 h-8 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Kéo thả hoặc bấm để thêm CV (Nhiều file cùng lúc)</h3>
                        <p className="text-slate-500 text-sm font-medium">Hệ thống AI sẽ tự động phân tích kỹ năng và kinh nghiệm. Hỗ trợ .PDF, .DOCX (Max 5MB)</p>
                    </div>
                )}
            </div>

            {/* DANH SÁCH CV CARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cvs.map(cv => {
                    const cInfo = cv.candidate_info || {};
                    const skills = cv.extracted_skills || [];
                    const displayName = cv.display_name || cv.filename;

                    return (
                        <div key={cv.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col hover:shadow-md transition-all group h-full">

                            {/* Tiêu đề & Icon */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg bg-blue-100 text-blue-600 border-2 border-blue-200">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 dark:text-white truncate" title={displayName}>{displayName}</h4>
                                    <p className="text-xs text-slate-500 truncate" title={cv.filename}>{cv.filename}</p>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1.5">
                                        <Clock className="w-3 h-3" />
                                        {new Date(cv.created_at || Date.now()).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            {/* Thông tin phân tích AI */}
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">AI Phân tích dữ liệu:</p>

                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2 text-xs">
                                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="font-semibold text-slate-700 dark:text-slate-200 truncate" title={cInfo.education_level}>
                                            {cInfo.education_level || 'Không đề cập'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                                            {cInfo.years_of_experience || 0} năm kinh nghiệm
                                        </span>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {skills.slice(0, 4).map((skill, idx) => (
                                        <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-600">
                                            {skill.name}
                                        </span>
                                    ))}
                                    {skills.length > 4 && (
                                        <span
                                            onClick={() => setSelectedCandidateForSkills(cv)}
                                            className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold border border-blue-200 cursor-pointer transition-colors"
                                        >
                                            +{skills.length - 4} khác
                                        </span>
                                    )}
                                    {skills.length === 0 && (
                                        <span className="text-xs text-slate-400 italic">Không tìm thấy kỹ năng</span>
                                    )}
                                </div>
                            </div>

                            {/* Footer Hành động */}
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <button
                                    onClick={() => setPreviewDocument({ url: cv.file_url || '', filename: displayName })}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <Eye className="w-4 h-4" /> Xem chi tiết
                                </button>
                                <button
                                    onClick={() => deleteCV(cv.id, displayName)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Xóa CV"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

            {cvs.length === 0 && !isUploading && (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Bạn chưa tải lên CV nào trong thư viện.</p>
                </div>
            )}

            {/* Modal Chi tiết kỹ năng */}
            {selectedCandidateForSkills && (
                <CandidateSkillsModal
                    isOpen={!!selectedCandidateForSkills}
                    onClose={() => setSelectedCandidateForSkills(null)}
                    candidate={selectedCandidateForSkills}
                />
            )}

            {/* Document Viewer */}
            {previewDocument && (
                <DocumentViewer
                    url={previewDocument.url}
                    filename={previewDocument.filename}
                    onClose={() => setPreviewDocument(null)}
                />
            )}
        </div>
    );
}