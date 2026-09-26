'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Building2, MapPin, Globe, Search, ChevronLeft, ChevronRight, Users, Star , Building } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { ROUTES } from '@/constants/routes';
import { COMPANY_SIZES } from '@/constants/company.constants';

export default function SavedCompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await apiClient.get('/apply/saved-companies/list');
                const data = res.data?.data || [];
                setCompanies(data);
            } catch (error) {
                toast.error('Không thể tải danh sách công ty đã lưu.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleUnsave = async (companyId: string) => {
        try {
            await apiClient.delete('/apply/saved-companies/' + companyId);
            setCompanies(prev => prev.filter(c => (c.id || c._id) !== companyId));
            toast.success('Đã bỏ lưu công ty.');
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

    const filtered = companies.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Công ty đã lưu</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Danh sách các công ty nổi bật mà bạn quan tâm và theo dõi.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 shrink-0">
                    <Heart className="w-4 h-4 text-primary-500" />
                    Tổng cộng: <span className="text-primary-600 dark:text-primary-400">{companies.length}</span> công ty
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
                    {paginated.map(company => (
                        <div key={company.id || company._id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white">
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black text-xl text-slate-300 bg-slate-50">
                                            {company.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate group-hover:text-primary-600 transition-colors" title={company.name}>{company.name}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                        {company.avg_rating ? company.avg_rating.toFixed(1) : 'Chưa có đánh giá'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <MapPin className="w-4 h-4 text-slate-400" /> {company.location?.province_name || company.location?.country || 'Chưa cập nhật'}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Users className="w-4 h-4 text-slate-400" /> {COMPANY_SIZES.find(s => s.value === company.size)?.label || company.size || 'Chưa cập nhật'}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 truncate">
                                    <Globe className="w-4 h-4 text-slate-400" /> 
                                    {company.website ? (
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline">{company.website}</a>
                                    ) : 'Chưa cập nhật'}
                                </div>
                            </div>

                            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3">
                                <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(company.id || company._id)} className="flex-1 text-center py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 font-bold rounded-xl transition-colors text-sm">
                                    Xem chi tiết
                                </Link>
                                <button onClick={() => handleUnsave(company.id || company._id)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm">
                                    Bỏ lưu
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy công ty nào.</div>
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
