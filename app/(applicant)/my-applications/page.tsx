'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Building2, Calendar, Eye, ExternalLink, Briefcase, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '@/lib/api-client';
import StatusBadge from '@/components/ui/StatusBadge';
import DocumentViewer from '@/components/shared/DocumentViewer';

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [previewDocument, setPreviewDocument] = useState<{
        url: string;
        filename: string;
    } | null>(null);

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

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Tiêu đề & Thống kê */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        Việc làm đã nộp
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Theo dõi tiến độ và trạng thái các hồ sơ bạn đã ứng tuyển.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    Tổng cộng: <span className="text-primary-600 dark:text-primary-400">{applications.length}</span> hồ sơ
                </div>
            </div>

            {/* DANH SÁCH APPLICATION CARD */}
            {applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {applications.map(app => {
                        const cvSnapshot = app.cv_snapshot || {};
                        const appliedDate = app.applied_at?.$date || app.applied_at;
                        const formattedDate = appliedDate ? new Date(appliedDate).toLocaleDateString('vi-VN') : 'Không rõ';

                        return (
                            <div key={app.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group h-full relative overflow-hidden">

                                {/* Header Card: Job & Company */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/careers/${app.job_id}`} target="_blank" className="font-bold text-slate-900 dark:text-white text-base truncate block hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title={app.job_title}>
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
                                        href={`/careers/${app.job_id}`}
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
            ) : (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                    <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Bạn chưa ứng tuyển công việc nào</h3>
                    <p className="text-slate-500 font-medium mb-6">Hãy khám phá các cơ hội nghề nghiệp và gửi CV ngay nhé!</p>
                    <Link href="/careers" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-primary-500/20">
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