'use client';

import { useState, useEffect } from 'react';
import { Activity, Search, Clock, User, Target } from 'lucide-react';
import { companyService } from '@/features/company/company.service';
import toast from 'react-hot-toast';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        companyService.getAuditLogs()
            .then(res => setLogs(res.data))
            .catch(() => toast.error('Không thể tải Audit Logs'))
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = logs.filter(l =>
        l.action?.toLowerCase().includes(search.toLowerCase()) ||
        l.note?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Lưu vết Hệ thống (Audit Logs)</h1>
                    <p className="text-slate-500 text-sm">Theo dõi các thao tác nhạy cảm để đảm bảo tính minh bạch.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Tìm theo hành động hoặc ghi chú..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-indigo-500" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 pl-6">Thời gian</th>
                            <th className="p-4">Người thực hiện</th>
                            <th className="p-4">Hành động (Action)</th>
                            <th className="p-4">Mục tiêu (Target)</th>
                            <th className="p-4 pr-6">Chi tiết / Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filtered.map(l => (
                            <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 pl-6 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(l.created_at).toLocaleString('vi-VN')}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <User className="w-4 h-4 text-slate-400" /> {l.actor_role.toUpperCase()}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{l.actor_id}</p>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-xs font-bold font-mono">
                                        {l.action}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                    <Target className="w-3 h-3" /> {l.target_type}
                                </td>
                                <td className="p-4 pr-6 text-sm text-slate-500">
                                    {l.note || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}