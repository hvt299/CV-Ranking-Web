'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/features/admin/admin.service';
import { Search, Loader2, Trash2, ChevronLeft, ChevronRight, ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCoverLettersPage() {
    const [coverLetters, setCoverLetters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const fetchCoverLetters = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getCoverLetters();
            setCoverLetters(data);
        } catch (e) {
            toast.error('Không thể tải danh sách Thư giới thiệu');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoverLetters();
    }, []);

    const handleDelete = async (clId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa Thư giới thiệu này vĩnh viễn?')) return;
        try {
            await adminService.deleteCoverLetter(clId);
            toast.success('Đã xóa Thư giới thiệu');
            fetchCoverLetters();
        } catch {
            toast.error('Lỗi khi xóa');
        }
    };

    const filtered = coverLetters.filter(c => {
        const matchSearch = c.file_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSource = sourceFilter === 'All' || c.source === sourceFilter;
        return matchSearch && matchSource;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sourceFilter]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedCoverLetters = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                            Quản lý Thư giới thiệu
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Giám sát các hồ sơ Thư giới thiệu được tải lên hệ thống.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên file..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm focus:border-primary-500 shadow-sm transition-colors text-slate-700 dark:text-slate-200 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                    <div className="relative min-w-48 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                        >
                            <option value="All">Tất cả nguồn</option>
                            <option value="upload">Upload</option>
                            <option value="generated">Tạo từ hệ thống</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-4 px-2">
                <div className="text-sm font-medium text-slate-500">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> Thư giới thiệu
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-5 pl-6">Tên File</th>
                                <th className="p-5">Kích thước</th>
                                <th className="p-5">Loại Thư giới thiệu</th>
                                <th className="p-5">Ngày tải lên</th>
                                <th className="p-5 pr-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto" />
                                        <p className="text-slate-500 text-sm mt-3 font-medium">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">
                                        Không tìm thấy Thư giới thiệu nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                paginatedCoverLetters.map((cv, index) => (
                                    <tr 
                                        key={cv.id} 
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="p-5 pl-6">
                                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{cv.file_name || 'Thư giới thiệu Document'}</p>
                                                {cv.file_url && (
                                                    <a href={cv.file_url} target="_blank" rel="noreferrer" className="p-1.5 bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400 rounded-lg hover:bg-info-100 transition-colors" title="Xem Thư giới thiệu">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-slate-500">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                {(cv.file_size / 1024).toFixed(2)} KB
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 shadow-sm">
                                                {cv.source || 'Upload'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-slate-500">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                {cv.created_at ? new Date(cv.created_at).toLocaleDateString('vi-VN') : '—'}
                                            </div>
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <button onClick={() => handleDelete(cv.id)} className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-colors" title="Xóa vĩnh viễn">
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

                {!isLoading && totalPages > 1 && (
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
