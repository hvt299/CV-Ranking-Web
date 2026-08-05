'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Select from 'react-select';
import { INDUSTRIES, GROUPED_INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';

export const customSelectStyles = (isDark: boolean) => ({
    control: (base: any, state: any) => ({
        ...base,
        minHeight: '48px',
        borderRadius: '0.75rem',
        backgroundColor: isDark ? '#0f172a' : 'transparent',
        borderColor: state.isFocused ? '#2563eb' : isDark ? '#334155' : '#e2e8f0',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(37,99,235,.2)' : 'none',
        '&:hover': { borderColor: '#2563eb' }
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderRadius: '0.75rem',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        overflow: 'hidden',
        zIndex: 9999,
    }),
    option: (base: any, state: any) => ({
        ...base,
        padding: '10px 12px',
        cursor: 'pointer',
        borderRadius: '0.5rem',
        margin: '2px 0',
        backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? (isDark ? '#1e293b' : '#eff6ff') : 'transparent',
        color: state.isSelected ? 'white' : isDark ? '#e2e8f0' : '#334155',
        fontSize: '14px',
        fontWeight: 500,
    }),
    singleValue: (base: any) => ({
        ...base,
        color: isDark ? '#f8fafc' : '#334155',
        fontWeight: 500,
        fontSize: '14px'
    }),
    placeholder: (base: any) => ({
        ...base,
        color: '#94a3b8',
        fontWeight: 500,
        fontSize: '14px'
    }),
});

interface CompanySearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: any;
    onFiltersChange: (filters: any) => void;
    filterOptions: any;
    onClearFilters: () => void;
    activeFiltersCount: number;
}

export default function CompanySearchBar({
    searchQuery, onSearchChange, filters, onFiltersChange, filterOptions,
    onClearFilters, activeFiltersCount
}: CompanySearchBarProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [showFilters, setShowFilters] = useState(false);

    const [showLocationPopover, setShowLocationPopover] = useState(false);
    const [mainTab, setMainTab] = useState<'domestic' | 'foreign'>('domestic');
    const [domesticVersion, setDomesticVersion] = useState<'new' | 'old'>('new');
    const [foreignInput, setForeignInput] = useState(filters.foreignLocation || '');
    const [locationSearchKeyword, setLocationSearchKeyword] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);

    const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
    const [subLocations, setSubLocations] = useState<any[]>([]);

    const locations = filterOptions?.locations || [];
    const activeProvinces = locations.filter((l: any) => l.version === domesticVersion);
    const displayedProvinces = activeProvinces.filter((l: any) =>
        l.name?.toLowerCase().includes(locationSearchKeyword.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) setShowLocationPopover(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExpandProvince = async (provCode: string) => {
        if (expandedProvince === provCode) {
            setExpandedProvince(null);
            setSubLocations([]);
        } else {
            setExpandedProvince(provCode);
            const { systemService } = await import('@/features/system/system.service');
            const subs = await systemService.getSubLocations(provCode);
            setSubLocations(subs.filter((s: any) => s.version === domesticVersion));
        }
    };

    const handleForeignSubmit = () => {
        if (foreignInput.trim()) {
            onFiltersChange({ ...filters, foreignLocation: foreignInput.trim() });
            setShowLocationPopover(false);
        } else {
            onFiltersChange({ ...filters, foreignLocation: '' });
        }
    };

    const selectedLocCount = (filters.provinceCodes?.length || 0) + (filters.districtCodes?.length || 0) + (filters.wardCodes?.length || 0) + (filters.foreignLocation ? 1 : 0);

    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            {/* Thanh Tìm kiếm Chính */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm công ty theo tên, mã số thuế..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 md:py-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-sm md:text-base"
                />
            </div>

            {/* Các Tùy chọn Phụ trợ */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-colors border ${showFilters ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Bộ lọc chuyên sâu
                    {activeFiltersCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {activeFiltersCount > 0 && (
                    <button onClick={onClearFilters} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl transition-colors">
                        <X className="w-4 h-4" /> Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Danh sách Bộ Lọc Nâng Cao (Xếp Dọc đồng bộ với JobSearchBar) */}
            {showFilters && (
                <div className="flex flex-col gap-5 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">

                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngành nghề</label>
                        <Select
                            options={[{ value: '', label: 'Tất cả Ngành' }, ...GROUPED_INDUSTRIES]}
                            value={INDUSTRIES.find(i => i.value === filters.industry) || { value: '', label: 'Tất cả Ngành' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, industry: selected?.value || '' })}
                            styles={customSelectStyles(isDark)}
                            isSearchable={true}
                            placeholder="Chọn ngành..."
                        />
                    </div>

                    {/* ĐỊA ĐIỂM (CUSTOM POPOVER MULTI-SELECT) */}
                    <div className="w-full relative" ref={popoverRef}>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Địa điểm</label>
                        <div
                            className="w-full min-h-12 text-slate-900 dark:text-white bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 cursor-pointer flex items-center justify-between hover:border-blue-500 transition-colors"
                            onClick={() => setShowLocationPopover(!showLocationPopover)}
                        >
                            <span className={`text-sm font-medium ${selectedLocCount > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                {selectedLocCount > 0 ? `Đã chọn ${selectedLocCount} khu vực` : 'Địa điểm'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>

                        {showLocationPopover && (
                            <div className="absolute top-[110%] left-0 w-full min-w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl z-50 overflow-hidden text-left flex flex-col">
                                <div className="flex border-b border-slate-200 dark:border-slate-700">
                                    <button className={`flex-1 py-3 text-sm font-bold transition-colors ${mainTab === 'domestic' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setMainTab('domestic')}>Trong nước</button>
                                    <button className={`flex-1 py-3 text-sm font-bold transition-colors ${mainTab === 'foreign' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setMainTab('foreign')}>Nước ngoài</button>
                                </div>

                                {mainTab === 'domestic' && (
                                    <div className="p-3 flex flex-col h-95">
                                        <div className="flex mb-3 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl shrink-0">
                                            <button className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${domesticVersion === 'new' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`} onClick={() => { setDomesticVersion('new'); setExpandedProvince(null); }}>Mới (Tỉnh → Xã)</button>
                                            <button className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${domesticVersion === 'old' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`} onClick={() => { setDomesticVersion('old'); setExpandedProvince(null); }}>Cũ (Tỉnh → Huyện)</button>
                                        </div>

                                        <input
                                            type="text" placeholder="Tìm nhanh Tỉnh/Thành phố..."
                                            value={locationSearchKeyword}
                                            onChange={(e) => setLocationSearchKeyword(e.target.value)}
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm mb-3 outline-none focus:border-blue-500 dark:text-white placeholder:text-slate-400 font-medium shrink-0"
                                        />

                                        <div className="overflow-y-auto flex-1 custom-scrollbar pr-2 space-y-2">
                                            {displayedProvinces.map((prov: any) => (
                                                <div key={prov.code} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                                    <div className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                            <input type="checkbox"
                                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                checked={filters.provinceCodes?.includes(prov.code)}
                                                                onChange={() => {
                                                                    const isChecked = filters.provinceCodes?.includes(prov.code);
                                                                    const newCodes = isChecked ? filters.provinceCodes.filter((c: string) => c !== prov.code) : [...(filters.provinceCodes || []), prov.code];
                                                                    onFiltersChange({ ...filters, provinceCodes: newCodes });
                                                                }}
                                                            />
                                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{prov.name}</span>
                                                        </label>
                                                        <button onClick={() => handleExpandProvince(prov.code)} className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                                                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedProvince === prov.code ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>

                                                    {expandedProvince === prov.code && (
                                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2 space-y-1.5 border-t border-slate-100 dark:border-slate-800 max-h-48 overflow-y-auto custom-scrollbar">
                                                            {subLocations.length > 0 ? subLocations.map(sub => {
                                                                const isOld = domesticVersion === 'old';
                                                                const isChecked = isOld ? filters.districtCodes?.includes(sub.code) : filters.wardCodes?.includes(sub.code);
                                                                return (
                                                                    <label key={sub.code} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors pl-8">
                                                                        <input type="checkbox"
                                                                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                            checked={isChecked}
                                                                            onChange={() => {
                                                                                const newProvCodes = filters.provinceCodes?.filter((c: string) => c !== prov.code) || [];
                                                                                if (isOld) {
                                                                                    const newCodes = isChecked ? filters.districtCodes.filter((c: string) => c !== sub.code) : [...(filters.districtCodes || []), sub.code];
                                                                                    onFiltersChange({ ...filters, districtCodes: newCodes, provinceCodes: newProvCodes });
                                                                                } else {
                                                                                    const newCodes = isChecked ? filters.wardCodes.filter((c: string) => c !== sub.code) : [...(filters.wardCodes || []), sub.code];
                                                                                    onFiltersChange({ ...filters, wardCodes: newCodes, provinceCodes: newProvCodes });
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{sub.name}</span>
                                                                    </label>
                                                                )
                                                            }) : (
                                                                <div className="text-center text-xs text-slate-400 py-3 font-medium">Đang tải...</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {displayedProvinces.length === 0 && <div className="text-center text-slate-400 text-xs py-4 font-medium">Không tìm thấy địa điểm</div>}
                                        </div>
                                    </div>
                                )}

                                {mainTab === 'foreign' && (
                                    <div className="p-4 flex flex-col h-80">
                                        <p className="text-xs text-slate-500 font-medium mb-3">Nhập tên quốc gia hoặc khu vực làm việc ở nước ngoài:</p>
                                        <input type="text" placeholder="VD: Nhật Bản, Mỹ, Singapore..." value={foreignInput} onChange={(e) => setForeignInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleForeignSubmit()} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-3" />
                                        <button onClick={handleForeignSubmit} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">Xác nhận</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Quy mô</label>
                        <Select
                            options={[{ value: '', label: 'Tất cả Quy mô' }, ...COMPANY_SIZES]}
                            value={COMPANY_SIZES.find(s => s.value === filters.size) || { value: '', label: 'Tất cả Quy mô' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, size: selected?.value || '' })}
                            styles={customSelectStyles(isDark)}
                            placeholder="Chọn quy mô..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}