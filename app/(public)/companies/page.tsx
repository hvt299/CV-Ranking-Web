'use client';

import { useState, useEffect, useMemo } from 'react';
import { Building2, Loader2, XCircle, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanySearchBar from '@/components/companies/CompanySearchBar';
import { useAuth } from '@/context/AuthContext';
import { Company } from '@/types';
import apiClient from '@/lib/api-client';
import { systemService } from '@/features/system/system.service';

export default function PublicCompaniesPage() {
    const { isAuthenticated, user } = useAuth();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('rating'); // rating, views, newest

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ industry: '', location: '', size: '' });
    const [filterOptions, setFilterOptions] = useState({ industries: [] as string[], locations: [] as any[], sizes: [] as string[] });

    // Detect Scroll for Header
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch danh sách công ty và hệ thống Location (để popover địa điểm chạy được)
                const [compRes, locRes] = await Promise.all([
                    apiClient.get('/companies/public/list'),
                    systemService.getLocations()
                ]);

                const data = compRes.data;
                setCompanies(data);

                // Tự động build options từ danh sách trả về
                const industries = [...new Set(data.map((c: Company) => c.industry).filter(Boolean))] as string[];
                const sizes = [...new Set(data.map((c: Company) => c.size).filter(Boolean))] as string[];

                // Cung cấp locRes trực tiếp cho filterOptions để Popover Location hoạt động
                setFilterOptions({ industries, locations: locRes, sizes });
            } catch (error) {
                toast.error('Không thể tải danh sách công ty');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const filteredCompanies = useMemo(() => {
        let result = [...companies];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(query) ||
                (c.tax_code && c.tax_code.includes(query))
            );
        }

        if (filters.industry) result = result.filter(c => c.industry === filters.industry);
        if (filters.size) result = result.filter(c => c.size === filters.size);
        if (filters.location) {
            const locQuery = filters.location.toLowerCase();
            result = result.filter(c =>
                c.location?.province_name?.toLowerCase().includes(locQuery) ||
                c.location?.country?.toLowerCase().includes(locQuery)
            );
        }

        switch (sortBy) {
            case 'rating': result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0)); break;
            case 'views': result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0)); break;
            case 'newest': result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()); break;
        }

        return result;
    }, [companies, searchQuery, filters, sortBy]);

    const activeFiltersCount = Object.values(filters).filter(value => value !== '').length + (searchQuery ? 1 : 0);

    const clearFilters = () => {
        setFilters({ industry: '', location: '', size: '' });
        setSearchQuery('');
        setSortBy('rating');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Pattern */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Khám phá các <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">công ty hàng đầu</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Tìm hiểu văn hóa doanh nghiệp và cơ hội nghề nghiệp tại {companies.length > 0 ? companies.length : 'hàng trăm'} tổ chức uy tín.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 space-y-10">
                {/* Search Bar mới */}
                <div className="relative z-20">
                    <CompanySearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        filters={filters}
                        onFiltersChange={setFilters}
                        filterOptions={filterOptions}
                        onClearFilters={clearFilters}
                        activeFiltersCount={activeFiltersCount}
                    />
                </div>

                {/* Khu vực Điều hướng Lọc Phụ & Chế độ xem */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-text p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                        Tìm thấy <span className="text-blue-600 dark:text-blue-400">{filteredCompanies.length}</span> doanh nghiệp
                    </span>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4">
                            <label className="font-bold hidden sm:block">Sắp xếp:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#1e293b] text-slate-800 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer">
                                <option value="rating">Đánh giá cao</option>
                                <option value="views">Nhiều lượt xem</option>
                                <option value="newest">Mới gia nhập</option>
                            </select>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-[#1e293b] p-1 rounded-xl">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Lưới">
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Danh sách">
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danh sách Công ty */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Đang tải danh sách công ty...</p>
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-text rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Không tìm thấy công ty phù hợp</h3>
                        <p className="text-slate-500 font-medium mb-6">Thử thay đổi từ khóa hoặc thiết lập lại bộ lọc.</p>
                        <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                            Xóa toàn bộ bộ lọc
                        </button>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {filteredCompanies.map(company => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}