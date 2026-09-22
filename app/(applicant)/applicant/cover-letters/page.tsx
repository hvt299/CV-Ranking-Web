'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, Eye, Clock, GraduationCap, Briefcase, ChevronRight, Zap, Search, ChevronLeft, Activity, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import DocumentViewer from '@/components/shared/DocumentViewer';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';
import { useCoverLetterLibrary } from '@/features/application/useApplication';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';

export default function CoverLetterLibraryPage() {
    const { coverLetters, isLoading, isUploading, uploadProgress, uploadFiles, deleteCoverLetter, addCoverLetterUrl } = useCoverLetterLibrary();

    // Lấy thông tin sức chứa Thư giới thiệu theo gói
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('applicant');
    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'app_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const maxCvUploads = currentPlan?.features?.max_cover_letters_uploads || 2;
    const isQuotaExceeded = coverLetters.length >= maxCvUploads;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const [previewDocument, setPreviewDocument] = useState<{
        url: string;
        filename: string;
    } | null>(null);

    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<any | null>(null);

    const [urlInput, setUrlInput] = useState('');
    const [urlName, setUrlName] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isQuotaExceeded) {
            toast.error(`Đã đạt giới hạn lưu trữ (${maxCvUploads} CV). Vui lòng xóa Thư giới thiệu cũ hoặc nâng cấp gói!`);
            e.target.value = '';
            return;
        }
        await uploadFiles(e.target.files);
        e.target.value = '';
    };

    const handleAddUrl = async () => {
        if (isQuotaExceeded) {
            toast.error(`Đã đạt giới hạn lưu trữ (${maxCvUploads} CV). Vui lòng xóa Thư giới thiệu cũ hoặc nâng cấp gói!`);
            return;
        }
        if (!urlInput) return;
        
        // Add URL
        await addCoverLetterUrl(urlInput, urlName || 'Thư giới thiệu của tôi (Từ URL)');
        setUrlInput('');
        setUrlName('');
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-primary-600 rounded-full"></div></div>;

    const filtered = coverLetters.filter(cl =>
        cl.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cl.filename?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedCoverLetters = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* Tiêu đề & Thống kê */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Thư viện Thư giới thiệu của tôi</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý các bản Thư giới thiệu của bạn. Tải lên và đính kèm dễ dàng khi ứng tuyển để ghi điểm với nhà tuyển dụng.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    <div className="bg-info-50 dark:bg-info-500/10 border border-info-100 dark:border-info-500/20 p-2.5 pr-4 rounded-2xl flex items-center gap-3 transition-colors">
                        <div className="w-10 h-10 bg-info-100 dark:bg-info-500/20 text-info-600 dark:text-info-500 flex items-center justify-center rounded-xl shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-info-600 dark:text-info-500 uppercase tracking-wider mb-0.5">Sức chứa Thư viện</p>
                            <p className="text-sm font-black text-info-700 dark:text-info-100">
                                <span className={isQuotaExceeded ? "text-error-600 dark:text-error-500" : ""}>{coverLetters.length}</span> / {maxCvUploads} tài liệu
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BỘ LỌC TÌM KIẾM */}
            {coverLetters.length > 0 && (
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên hiển thị hoặc Tên file gốc..."
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 transition-colors shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* KHU VỰC UPLOAD CHUNG */}
            <div className={`relative ${isQuotaExceeded ? 'bg-error-50/50 dark:bg-error-900/10 border-error-200 dark:border-error-800/50' : 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20'} border-2 border-dashed rounded-3xl p-10 text-center transition-all group overflow-hidden`}>
                <input type="file" multiple accept=".pdf,.docx" onChange={handleUpload} disabled={isUploading || isQuotaExceeded} className={`absolute inset-0 w-full h-full opacity-0 z-5 ${isQuotaExceeded ? 'cursor-not-allowed' : 'cursor-pointer disabled:cursor-not-allowed'}`} />
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
                        <div className="relative w-14 h-14">
                            <div className="absolute inset-0 border-4 border-primary-200/50 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Đang tải lên...</h3>
                            <p className="text-sm text-primary-600 font-medium mt-1">Tiến độ: {uploadProgress.current} / {uploadProgress.total} file</p>
                        </div>
                    </div>
                ) : isQuotaExceeded ? (
                    <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none relative z-0">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                            <AlertTriangle className="w-8 h-8 text-error-500" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mt-2">Đã đạt giới hạn sức chứa ({maxCvUploads} CV)</h3>
                        <p className="text-error-500 text-sm font-medium">Vui lòng xóa bớt Thư giới thiệu cũ hoặc nâng cấp gói cước để tải thêm.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none relative z-0">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="w-8 h-8 text-primary-500" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mt-2">Kéo thả hoặc bấm để thêm Thư giới thiệu (Nhiều file cùng lúc)</h3>
                        <p className="text-slate-500 text-sm font-medium"> Hỗ trợ .PDF, .DOCX (Max 5MB)</p>
                    </div>
                )}
            </div>

            {/* NHẬP URL */}
            {!isQuotaExceeded && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Nhập URL Thư giới thiệu (VD: Google Drive, Notion...)" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-primary-500 transition-colors shadow-sm" disabled={isUploading} />
                    </div>
                    <div className="w-full md:w-1/3">
                        <input type="text" value={urlName} onChange={e => setUrlName(e.target.value)} placeholder="Tên hiển thị" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-primary-500 transition-colors shadow-sm" disabled={isUploading} />
                    </div>
                    <button onClick={handleAddUrl} disabled={!urlInput.trim() || isUploading} className="w-full md:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors shrink-0 shadow-sm">
                        Thêm từ URL
                    </button>
                </div>
            )}

            {/* DANH SÁCH CV CARD */}
            {coverLetters.length > 0 && (
                <>
                    <div className="text-sm font-medium text-slate-500 px-2">
                        Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> kết quả
                    </div>
                    {paginatedCoverLetters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginatedCoverLetters.map(cl => {
                                const cInfo = cl.candidate_info || {};
                                const skills = cl.extracted_skills || [];
                                const displayName = cl.display_name || cl.filename || 'Thư giới thiệu chưa xác định';

                                return (
                                    <div key={cl.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group h-full">

                                        {/* Tiêu đề & Icon */}
                                        <div className="flex items-start gap-4 mb-5">
                                            <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-base truncate group-hover:text-primary-600 transition-colors" title={displayName}>
                                                    {displayName}
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium truncate mt-0.5" title={cl.filename}>{cl.filename}</p>
                                                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mt-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {cl.created_at ? new Date(cl.created_at).toLocaleDateString('vi-VN') : (cl.created_at ? new Date(cl.created_at).toLocaleDateString('vi-VN') : 'Không xác định')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer Hành động */}
                                        <div className="mt-5 flex justify-between items-center px-1">
                                            <button
                                                onClick={() => setPreviewDocument({ url: cl.file_url || '', filename: displayName })}
                                                className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" /> Xem chi tiết
                                            </button>
                                            <button
                                                onClick={() => deleteCoverLetter(cl.id, displayName)}
                                                className="p-2 text-slate-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-xl transition-colors"
                                                title="Xóa Thư giới thiệu"
                                            >
                                                <Trash2 className="w-4.5 h-4.5" />
                                            </button>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-slate-400 text-sm font-medium">Không có Thư giới thiệu nào khớp với từ khóa "{searchTerm}".</div>
                    )}

                    {/* UI PHÂN TRANG */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
                            <p className="text-sm font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> kết quả
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors shadow-sm ${currentPage === page ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {coverLetters.length === 0 && !isUploading && !isLoading && (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                    <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Chưa có Thư giới thiệu nào</h3>
                    <p className="text-slate-500 font-medium">Hãy tải lên ít nhất một bản CV để gửi kèm khi ứng tuyển.</p>
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