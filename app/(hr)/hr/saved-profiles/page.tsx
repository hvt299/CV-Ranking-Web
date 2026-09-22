'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Bookmark, MapPin, Briefcase, Mail, Phone, ExternalLink, Calendar, Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { ROUTES } from '@/constants/routes';
import DocumentViewer from '@/components/shared/DocumentViewer';

export default function SavedProfilesPage() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const [previewDocument, setPreviewDocument] = useState<{
        url: string;
        filename: string;
    } | null>(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await apiClient.get('/cv/talent-pool/bookmarked');
                const data = res.data || [];
                setProfiles(data);
            } catch (error) {
                toast.error('Không thể tải danh sách hồ sơ đã lưu.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfiles();
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

    const filtered = profiles.filter(p =>
        p.applicant_user_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Hồ sơ đã lưu</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý kho hồ sơ (Talent Pool) các ứng viên tiềm năng.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 shrink-0">
                    <Bookmark className="w-4 h-4 text-primary-500" />
                    Tổng cộng: <span className="text-primary-600 dark:text-primary-400">{profiles.length}</span> hồ sơ
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
                    {paginated.map(profile => (
                        <div key={profile._id || profile.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate transition-colors">ID Ứng viên: {profile.applicant_user_id.substring(0,8)}...</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                                        <Calendar className="w-3.5 h-3.5" /> Lưu ngày: {new Date(profile.created_at || profile.created_at?.$date).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
                                {profile.notes ? (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                                        "{profile.notes}"
                                    </div>
                                ) : (
                                    <span className="italic text-slate-400">Không có ghi chú</span>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy hồ sơ nào.</div>
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
