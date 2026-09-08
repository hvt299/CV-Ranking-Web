'use client';

import { useState, useEffect } from 'react';
import { Activity, Clock, User, Target, ChevronLeft, ChevronRight, Eye, X, Filter } from 'lucide-react';
import { companyService } from '@/features/company/company.service';
import { AUDIT_ACTION_CONFIG } from '@/constants/audit.constants';
import toast from 'react-hot-toast';
import { formatDateTimeGMT7 } from '@/utils/format';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const [filters, setFilters] = useState({
        page: 1,
        action: '',
        start_date: '',
        end_date: ''
    });

    const [selectedLog, setSelectedLog] = useState<any | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const params: any = { page: filters.page, page_size: 15 };

        if (filters.action) params.action = filters.action;
        if (filters.start_date) params.start_date = new Date(filters.start_date).toISOString();
        if (filters.end_date) params.end_date = new Date(filters.end_date).toISOString();

        companyService.getAuditLogs(params)
            .then(res => {
                setLogs(res.items || []);
                setPagination(res.pagination || { current_page: 1, total_pages: 1, total_items: 0 });
            })
            .catch(() => toast.error('Không thể tải Audit Logs'))
            .finally(() => setIsLoading(false));
    }, [filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Lưu vết Hệ thống (Audit Logs)</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Giám sát mọi thao tác nhạy cảm. Dữ liệu được bảo vệ và phân trang tối ưu.</p>
                </div>
            </div>

            {/* BỘ LỌC TÌM KIẾM SERVER-SIDE */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                        value={filters.action}
                        onChange={e => handleFilterChange('action', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-primary-500 appearance-none cursor-pointer"
                    >
                        <option value="">Tất cả Hành động</option>
                        {Object.entries(AUDIT_ACTION_CONFIG).map(([actionValue, config]) => (
                            <option key={actionValue} value={actionValue}>{config.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4 flex-1">
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={e => handleFilterChange('start_date', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-primary-500 text-slate-700 dark:text-slate-200 cursor-pointer"
                    />
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={e => handleFilterChange('end_date', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-primary-500 text-slate-700 dark:text-slate-200 cursor-pointer"
                    />
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-5 pl-6">Thời gian</th>
                                    <th className="p-5">Người thực hiện</th>
                                    <th className="p-5">Hành động (Action)</th>
                                    <th className="p-5">Đối tượng</th>
                                    <th className="p-5">Ghi chú</th>
                                    <th className="p-5 pr-6 text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {logs.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-5 pl-6 text-xs text-slate-500 font-bold">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDateTimeGMT7(l.created_at)}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-1.5 text-sm font-black text-slate-800 dark:text-slate-200 uppercase">
                                                <User className="w-4 h-4 text-primary-500" /> {l.actor_role}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-mono mt-1 bg-slate-100 dark:bg-slate-900 inline-block px-1.5 py-0.5 rounded">{l.actor_id}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${AUDIT_ACTION_CONFIG[l.action]?.colorClass || 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                {AUDIT_ACTION_CONFIG[l.action]?.label || l.action}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 font-bold uppercase mt-2">
                                            <Target className="w-4 h-4 text-slate-400" /> {l.target_type}
                                        </td>
                                        <td className="p-5 text-xs font-medium text-slate-500 max-w-50 truncate" title={l.note}>
                                            {l.note || '-'}
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <button
                                                onClick={() => setSelectedLog(l)}
                                                className="p-2 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 dark:bg-slate-900 dark:hover:bg-primary-500/10 rounded-xl transition-colors"
                                                title="Xem mã nguồn thay đổi"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {!isLoading && logs.length === 0 && (
                    <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy bản ghi nào khớp với bộ lọc.</div>
                )}

                {/* SERVER-SIDE PAGINATION UI */}
                {!isLoading && pagination.total_pages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(pagination.current_page - 1) * 15 + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(pagination.current_page * 15, pagination.total_items)}</span> trong <span className="font-bold text-slate-800 dark:text-white">{pagination.total_items}</span> bản ghi
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleFilterChange('page', String(Math.max(1, pagination.current_page - 1)))} disabled={pagination.current_page === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                                    let pageNum = i + 1;
                                    if (pagination.total_pages > 5 && pagination.current_page > 3) {
                                        pageNum = pagination.current_page - 2 + i;
                                        if (pageNum > pagination.total_pages) return null;
                                    }
                                    return (
                                        <button key={pageNum} onClick={() => handleFilterChange('page', String(pageNum))} className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors shadow-sm ${pagination.current_page === pageNum ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-white hover:border-slate-200'}`}>{pageNum}</button>
                                    )
                                })}
                            </div>
                            <button onClick={() => handleFilterChange('page', String(Math.min(pagination.total_pages, pagination.current_page + 1)))} disabled={pagination.current_page === pagination.total_pages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DIFF VIEWER */}
            {selectedLog && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-3xl">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <Activity className="w-6 h-6 text-primary-500" /> Chi tiết biến động dữ liệu
                                </h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">ID Bản ghi: {selectedLog.id}</p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-error-600 bg-white dark:bg-slate-800 rounded-xl transition-colors shadow-sm border border-slate-200 dark:border-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body - 2 Columns Diff */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Dữ liệu Cũ */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-error-50 dark:bg-error-500/10 text-error-600 dark:text-error-400 border border-error-200 dark:border-error-500/30 rounded-xl font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-error-500"></div> Trạng thái Cũ (Before State)
                                    </div>
                                    <pre className="p-4 bg-slate-950 text-slate-100 rounded-2xl overflow-x-auto text-xs font-mono border border-slate-800 shadow-inner h-[50vh]">
                                        {selectedLog.before_state ? JSON.stringify(selectedLog.before_state, null, 2) : '// Không có dữ liệu cũ\n// (Có thể đây là thao tác Tạo mới)'}
                                    </pre>
                                </div>

                                {/* Dữ liệu Mới */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 border border-success-200 dark:border-success-500/30 rounded-xl font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-success-500"></div> Trạng thái Mới (After State)
                                    </div>
                                    <pre className="p-4 bg-slate-950 text-slate-100 rounded-2xl overflow-x-auto text-xs font-mono border border-slate-800 shadow-inner h-[50vh]">
                                        {selectedLog.after_state ? JSON.stringify(selectedLog.after_state, null, 2) : '// Không có dữ liệu mới\n// (Có thể đây là thao tác Xóa)'}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}