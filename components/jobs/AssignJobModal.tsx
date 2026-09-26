'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Search, CheckCircle2, User } from 'lucide-react';
import { companyService } from '@/features/company/company.service';
import { jobService } from '@/features/job/job.service';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';

export default function AssignJobModal({
    isOpen,
    onClose,
    jobId,
    initialAssignedIds = [],
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    initialAssignedIds?: string[];
    onSuccess?: () => void;
}) {
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>(initialAssignedIds);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(initialAssignedIds);
            fetchMembers();
        }
    }, [isOpen, initialAssignedIds]);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const res = await companyService.getMembers();
            const memData = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
            // Chỉ hiển thị các thành viên đã xác thực (có thể bao gồm cả Owner)
            setMembers(memData.filter((m: any) => m.is_verified));
        } catch (e) {
            toast.error("Không thể tải danh sách nhân sự");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMember = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await jobService.assignJob(jobId, selectedIds);
            toast.success("Đã phân công chiến dịch thành công!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Lỗi khi phân công chiến dịch");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const filteredMembers = members.filter(m => 
        m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">Giao Việc (Phân công)</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Chọn nhân sự phụ trách chiến dịch này</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="py-10 text-center text-slate-500">Không tìm thấy thành viên nào.</div>
                        ) : (
                            filteredMembers.map(m => (
                                <div 
                                    key={m.id}
                                    onClick={() => toggleMember(m.id)}
                                    className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${selectedIds.includes(m.id) ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800/50' : 'bg-white border-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'}`}
                                >
                                    {m.avatar_url ? (
                                        <img src={m.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 uppercase shadow-sm shrink-0">
                                            {m.full_name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{m.full_name}</p>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{m.email}</p>
                                    </div>
                                    <div className="shrink-0 text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-500 mr-2">
                                        {m.role === UserRole.HR_OWNER ? 'Owner' : 'Member'}
                                    </div>
                                    <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${selectedIds.includes(m.id) ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        {selectedIds.includes(m.id) && <CheckCircle2 className="w-4 h-4" />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Hủy
                    </button>
                    <button onClick={handleSave} disabled={isSaving || isLoading} className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 flex items-center gap-2 transition-all disabled:opacity-70">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu phân công'}
                    </button>
                </div>
            </div>
        </div>
    );
}
