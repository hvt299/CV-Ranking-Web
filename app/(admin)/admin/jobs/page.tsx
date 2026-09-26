'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/features/admin/admin.service';
import { Search, Loader2, Ban, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const JOB_STATUS_CONFIG: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
    'open': { label: 'Đang mở', badgeClass: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400 border-success-200 dark:border-success-500/20', dotClass: 'bg-success-500' },
    'closed': { label: 'Đã đóng', badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700', dotClass: 'bg-slate-400' },
    'draft': { label: 'Bản nháp', badgeClass: 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500 border-slate-200 dark:border-slate-800', dotClass: 'bg-slate-300' },
    'suspended': { label: 'Đình chỉ', badgeClass: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400 border-error-200 dark:border-error-500/20', dotClass: 'bg-error-500' },
    'default': { label: 'Không xác định', badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700', dotClass: 'bg-slate-400' }
};

const getStatusBadge = (status: string) => {
    const config = JOB_STATUS_CONFIG[status] || JOB_STATUS_CONFIG['default'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.badgeClass} shadow-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
            {config.label}
        </span>
    );
};

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getJobs();
            setJobs(data);
        } catch (e) {
            toast.error('Không thể tải danh sách Jobs');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleUnlock = async (jobId: string) => {
        if (!confirm('Bạn có chắc chắn muốn mở khóa chiến dịch này?')) return;
        try {
            await adminService.unlockJob(jobId);
            toast.success('Đã mở khóa chiến dịch');
            fetchJobs();
        } catch {
            toast.error('Lỗi khi mở khóa');
        }
    };

    const handleSuspend = async (jobId: string) => {
        const reason = prompt('Nhập lý do đình chỉ:');
        if (!reason) return;
        try {
            await adminService.suspendJob(jobId, reason);
            toast.success('Đã đình chỉ chiến dịch');
            fetchJobs();
        } catch {
            toast.error('Lỗi đình chỉ');
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa chiến dịch này vĩnh viễn?')) return;
        try {
            await adminService.deleteJob(jobId);
            toast.success('Đã xóa chiến dịch');
            fetchJobs();
        } catch {
            toast.error('Lỗi khi xóa');
        }
    };

    const filtered = jobs.filter(j => {
        const matchesSearch = j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              j.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const actualStatus = j.is_suspended ? 'suspended' : j.status;
        const matchesStatus = statusFilter === 'All' || actualStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedJobs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        Quản lý Chiến dịch
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Giám sát, tìm kiếm và đình chỉ các chiến dịch vi phạm trên nền tảng.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tiêu đề hoặc tên công ty..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                    <div className="relative min-w-48 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none shadow-sm cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            {Object.entries(JOB_STATUS_CONFIG).map(([key, config]) => {
                                if (key === 'default') return null;
                                return (
                                    <option key={key} value={key}>
                                        {config.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            </div>



                                    <div className="flex items-center justify-between mt-2 mb-4 px-2">
                <div className="text-sm font-medium text-slate-500">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> chiến dịch
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-5 pl-6">Chiến dịch</th>
                                <th className="p-5">Công ty</th>
                                <th className="p-5">Ngày tạo</th>
                                <th className="p-5">Trạng thái</th>
                                <th className="p-5 pr-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">
                                        Không tìm thấy chiến dịch nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                paginatedJobs.map((job, index) => (
                                    <tr 
                                        key={job.id} 
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="p-5 pl-6">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{job.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 font-medium">{job.job_level} • {job.employment_type}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                {job.company_logo ? (
                                                    <img src={job.company_logo} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 shrink-0">
                                                        {job.company_name ? job.company_name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                )}
                                                <p className="font-bold text-sm text-slate-700 dark:text-slate-300 line-clamp-1">{job.company_name || 'Chưa cập nhật'}</p>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-slate-500">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                {job.created_at ? new Date(job.created_at).toLocaleDateString('vi-VN') : '—'}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                {getStatusBadge(job.is_suspended ? 'suspended' : job.status)}
                                            </div>
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                {job.is_suspended ? (
                                                    <button onClick={() => handleUnlock(job.id)} className="p-2 text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10 rounded-lg transition-colors" title="Mở khóa chiến dịch">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><path d="M12 11v4"/></svg>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleSuspend(job.id)} className="p-2 text-warning-500 hover:bg-warning-50 dark:hover:bg-warning-500/10 rounded-lg transition-colors" title="Đình chỉ chiến dịch">
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(job.id)} className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-colors" title="Xóa vĩnh viễn">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* THÀNH PHẦN PHÂN TRANG */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 mt-auto">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> kết quả
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)} 
                                        disabled={page === '...'}
                                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${page !== '...' ? 'shadow-sm' : ''} ${currentPage === page ? 'bg-primary-600 text-white' : page === '...' ? 'text-slate-400 bg-transparent cursor-default' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
