'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Building2, Calendar, Eye, ExternalLink, Briefcase, ChevronRight, Search, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '@/lib/api-client';
import StatusBadge from '@/components/ui/StatusBadge';
import DocumentViewer from '@/components/shared/DocumentViewer';
import { ROUTES } from '@/constants/routes';

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [previewDocument, setPreviewDocument] = useState<{
        url: string;
        filename: string;
    } | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await apiClient.get('/apply/my-applications');
                const appData = res.data?.data || res.data || [];
                setApplications(Array.isArray(appData) ? appData : []);
            } catch (error) {
                toast.error('Không thể tải lịch sử ứng tuyển.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
        );
    }

    const filtered = applications.filter(app =>
        app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedApps = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            {/* Tiêu đề & Thống kê */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Việc làm đã nộp</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Theo dõi tiến độ và trạng thái các hồ sơ bạn đã ứng tuyển.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 shrink-0">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    Tổng cộng: <span className="text-primary-600 dark:text-primary-400">{applications.length}</span> hồ sơ
                </div>
            </div>

            {/* BỘ LỌC TÌM KIẾM */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên công việc hoặc Công ty..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 transition-colors shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="text-sm font-medium text-slate-500 px-2">
                Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> kết quả
            </div>

            {/* DANH SÁCH APPLICATION CARD */}
            {paginatedApps.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedApps.map(app => {
                            const cvSnapshot = app.cv_snapshot || {};
                            const appliedDate = app.applied_at?.$date || app.applied_at;
                            const formattedDate = appliedDate ? new Date(appliedDate).toLocaleDateString('vi-VN') : 'Không rõ';

                            return (
                                <div key={app.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group h-full relative overflow-hidden">

                                    {/* Header Card: Job & Company */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <Link href={ROUTES.PUBLIC_JOB_DETAIL(app.job_id)} target="_blank" className="font-bold text-slate-900 dark:text-white text-base truncate block hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title={app.job_title}>
                                                {app.job_title}
                                            </Link>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                                <Building2 className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate" title={app.company_name}>{app.company_name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-4">
                                        <StatusBadge status={app.status || 'new'} />
                                    </div>

                                    {/* Thông tin chi tiết */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex-1 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                Ngày nộp: {formattedDate}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate" title={cvSnapshot.display_name || cvSnapshot.filename}>
                                                CV: {cvSnapshot.display_name || cvSnapshot.filename || 'Không rõ'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer Hành động */}
                                    <div className="mt-5 flex justify-between items-center px-1">
                                        <button
                                            onClick={() => setPreviewDocument({ url: cvSnapshot.file_url || '', filename: cvSnapshot.display_name || 'CV' })}
                                            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" /> Xem lại CV
                                        </button>

                                        <Link
                                            href={ROUTES.PUBLIC_JOB_DETAIL(app.job_id)}
                                            target="_blank"
                                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
                                            title="Xem chi tiết việc làm"
                                        >
                                            <ExternalLink className="w-4.5 h-4.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

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
            ) : searchTerm ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Không tìm thấy công việc</h3>
                    <p className="text-slate-500 font-medium mb-6">Không có hồ sơ nào khớp với từ khóa "{searchTerm}".</p>
                </div>
            ) : (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                    <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Bạn chưa ứng tuyển công việc nào</h3>
                    <p className="text-slate-500 font-medium mb-6">Hãy khám phá các cơ hội nghề nghiệp và gửi CV ngay nhé!</p>
                    <Link href={ROUTES.PUBLIC_JOBS} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-primary-500/20">
                        Tìm việc ngay <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
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