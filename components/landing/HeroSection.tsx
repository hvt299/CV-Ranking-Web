'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sparkles, Search, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import Typewriter from '@/components/ui/Typewriter';
import Select from 'react-select';
import { INDUSTRIES, GROUPED_INDUSTRIES } from '@/constants/job.constants';

const HERO_WORDS = ["Kỹ sư phần mềm", "Chuyên viên Marketing", "Giám đốc tài chính", "Nhà thiết kế UI/UX"];

const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

const heroSelectStyles = (isDark = false) => ({
    control: (base: any) => ({ ...base, border: 'none', boxShadow: 'none', backgroundColor: 'transparent', cursor: 'text', minHeight: '44px' }),
    valueContainer: (base: any) => ({ ...base, padding: '0 8px' }),
    input: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#0f172a', margin: 0, padding: 0 }),
    singleValue: (base: any, state: any) => ({ ...base, color: (!state.data || state.data.value === '') ? '#94a3b8' : isDark ? '#f8fafc' : '#334155', fontSize: '14px', fontWeight: 500 }),
    placeholder: (base: any) => ({ ...base, color: '#94a3b8', fontSize: '14px', fontWeight: 500 }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base: any) => ({ ...base, color: '#94a3b8' }),
    menu: (base: any) => ({ ...base, zIndex: 9999, borderRadius: '1rem', overflow: 'hidden', padding: '8px', backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }),
    menuList: (base: any) => ({ ...base, padding: 0 }),
    option: (base: any, state: any) => ({ ...base, backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? isDark ? '#1e293b' : '#eff6ff' : 'transparent', color: state.isSelected ? '#fff' : isDark ? '#e2e8f0' : '#334155', fontSize: '14px', fontWeight: 500, cursor: 'pointer', borderRadius: '0.5rem', margin: '2px 0' })
});

interface HeroSectionProps {
    searchQuery: string; setSearchQuery: (val: string) => void;
    filters: any; setFilters: (val: any) => void;
    filterOptions?: any;
}

export default function HeroSection({ searchQuery, setSearchQuery, filters, setFilters, filterOptions }: HeroSectionProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
        l.name.toLowerCase().includes(locationSearchKeyword.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowLocationPopover(false);
            }
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
            // HeroSection nằm trong Client Component nên gọi được API
            const { systemService } = await import('@/features/system/system.service');
            const subs = await systemService.getSubLocations(provCode);
            setSubLocations(subs.filter((s: any) => s.version === domesticVersion));
        }
    };

    const handleForeignSubmit = () => {
        if (foreignInput.trim()) {
            setFilters({ ...filters, foreignLocation: foreignInput.trim() });
            setShowLocationPopover(false);
        } else {
            setFilters({ ...filters, foreignLocation: '' });
        }
    };

    const selectedLocCount = (filters.provinceCodes?.length || 0) + (filters.districtCodes?.length || 0) + (filters.wardCodes?.length || 0) + (filters.foreignLocation ? 1 : 0);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('keyword', searchQuery.trim());
        if (filters.industry) params.append('industry', filters.industry);

        if (filters.provinceCodes?.length > 0) params.append('provinces', filters.provinceCodes.join(','));
        if (filters.districtCodes?.length > 0) params.append('districts', filters.districtCodes.join(','));
        if (filters.wardCodes?.length > 0) params.append('wards', filters.wardCodes.join(','));
        if (filters.foreignLocation) params.append('foreign', filters.foreignLocation);

        router.push(`/careers?${params.toString()}`);
    };

    return (
        <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-blue-400/20 dark:bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />

            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-30 max-w-5xl mx-auto text-center flex flex-col items-center">

                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-bold mb-8 backdrop-blur-md text-slate-600 dark:text-slate-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Nền tảng Tuyển dụng AI thế hệ mới
                </motion.div>
                <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2] pb-3 mb-6">
                    Khám phá cơ hội cho <br className="hidden md:block" />
                    <Typewriter words={HERO_WORDS} />
                </motion.h1>
                <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed">
                    Ứng dụng mô hình LLM và Vector Database để loại bỏ định kiến, tự động khớp nối CV và Yêu cầu công việc với độ chính xác lên đến 98%.
                </motion.p>

                <motion.div variants={fadeUp} className="w-full max-w-5xl bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 p-2 rounded-3xl md:rounded-full flex flex-col md:flex-row gap-2 shadow-2xl dark:shadow-black/40 relative">

                    {/* 1. TỪ KHÓA */}
                    <div className="flex items-center flex-[1.35] min-w-72 px-4 py-3">
                        <Search className="w-5 h-5 text-slate-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Từ khóa, công ty..."
                            className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-white px-3 placeholder:text-slate-400 text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700 self-center" />

                    {/* 2. NGÀNH NGHỀ */}
                    <div className="flex items-center flex-1 px-4 py-2 min-w-64 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                        <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                        <div className="w-full text-slate-800 dark:text-white text-left">
                            <Select
                                instanceId="hero-industry-select"
                                options={[{ value: '', label: 'Tất cả Ngành' }, ...GROUPED_INDUSTRIES]}
                                value={INDUSTRIES.find(i => i.value === filters.industry) || { value: '', label: 'Tất cả Ngành' }}
                                onChange={(selected: any) => setFilters({ ...filters, industry: selected?.value || '', skills: [] })}
                                placeholder="Tất cả Ngành..."
                                styles={{ ...heroSelectStyles(isDark), menu: (base: any) => ({ ...heroSelectStyles(isDark).menu(base), width: '320px', minWidth: '320px' }) }}
                                isSearchable={true}
                                className="dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700 self-center" />

                    {/* 3. ĐỊA ĐIỂM (MULTI-SELECT POPOVER) */}
                    <div className="flex items-center flex-1 px-4 py-2 min-w-50 border-t md:border-t-0 border-slate-100 dark:border-slate-700 relative" ref={popoverRef}>
                        <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                        <div
                            className="w-full text-slate-800 dark:text-white text-left px-3 py-2 cursor-pointer flex items-center justify-between"
                            onClick={() => setShowLocationPopover(!showLocationPopover)}
                        >
                            <span className={`text-sm font-medium ${selectedLocCount > 0 ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                {selectedLocCount > 0 ? `Đã chọn ${selectedLocCount} khu vực` : 'Địa điểm'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>

                        {showLocationPopover && (
                            <div className="absolute top-[120%] left-0 w-87.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl z-50 overflow-hidden text-left flex flex-col">
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
                                                                    setFilters({ ...filters, provinceCodes: newCodes });
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
                                                                                    setFilters({ ...filters, districtCodes: newCodes, provinceCodes: newProvCodes });
                                                                                } else {
                                                                                    const newCodes = isChecked ? filters.wardCodes.filter((c: string) => c !== sub.code) : [...(filters.wardCodes || []), sub.code];
                                                                                    setFilters({ ...filters, wardCodes: newCodes, provinceCodes: newProvCodes });
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

                    <button onClick={handleSearch} className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl md:rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors w-full md:w-auto shrink-0 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
                        Tìm việc
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}