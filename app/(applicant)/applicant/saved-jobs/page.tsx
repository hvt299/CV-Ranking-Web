'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookmarkX, Bookmark, Building2, Calendar, MapPin, DollarSign, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { ROUTES } from '@/constants/routes';
import { formatSalaryRange } from '@/utils/format';

export default function SavedJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await apiClient.get('/apply/saved-jobs/list');
                const data = res.data?.data || [];
                setJobs(data);
            } catch (error) {
                toast.error('Không thể tải danh sách việc làm đã lưu.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleUnsave = async (jobId: string) => {
        try {
            await apiClient.delete('/apply/saved-jobs/' + jobId);
            setJobs(prev => prev.filter(j => j.id !== jobId));
            toast.success('Đã bỏ lưu chiến dịch.');
        } catch (error) {
            toast.error('Lỗi khi bỏ lưu.');
        }
    };

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

    const filtered = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Việc làm đã lưu</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý danh sách các chiến dịch tuyển dụng bạn đã quan tâm.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 shrink-0">
                    <Bookmark className="w-4 h-4 text-primary-500" />
                    Tổng cộng: <span className="text-primary-600 dark:text-primary-400">{jobs.length}</span> việc làm
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 transition-colors shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {paginated.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map(job => (
                        <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white flex items-center justify-center shadow-sm">
                                    {job.company_logo ? (
                                        <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <span className="font-black text-xl text-slate-300 bg-slate-50 w-full h-full flex items-center justify-center">
                                            {job.company_name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate group-hover:text-primary-600 transition-colors" title={job.title}>{job.title}</h4>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
                                        {job.company_name}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        {typeof job.location === 'object' ? (job.location?.country && job.location.country !== 'Việt Nam' ? job.location.country : job.location?.province_name || 'Toàn quốc') : (job.location || 'Không xác định')}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        {formatSalaryRange(job.salary) || 'Thỏa thuận'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-3.5 h-3.5" /> Hạn nộp: {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                                </div>
                            </div>

                            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3">
                                <Link href={ROUTES.PUBLIC_JOB_DETAIL(job.id)} className="flex-1 text-center py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 font-bold rounded-xl transition-colors text-sm">
                                    Xem chi tiết
                                </Link>
                                <button onClick={() => handleUnsave(job.id)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm">
                                    Bỏ lưu
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy việc làm nào.</div>
            )}
            
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
                    <p className="text-sm font-medium text-slate-500">
                        Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> kết quả
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
