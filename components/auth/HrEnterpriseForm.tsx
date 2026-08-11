'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, MapPin, Users } from 'lucide-react';
import Select from 'react-select';
import { GROUPED_INDUSTRIES, INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { companyService } from '@/features/company/company.service';
import { systemService, LocationUnit } from '@/features/system/system.service';
import { LocationDetail } from '@/types';
import toast from 'react-hot-toast';

export interface HrInfoState {
    companyName: string;
    taxCode: string;
    industry: string;
    size: string;
    location: LocationDetail;
    website: string;
}

export const DEFAULT_HR_INFO: HrInfoState = {
    companyName: '',
    taxCode: '',
    industry: '',
    size: '',
    website: '',
    location: {
        country: 'Việt Nam',
        version: 'new',
        province_code: '',
        district_code: '',
        ward_code: '',
        street_address: ''
    }
};

interface HrEnterpriseFormProps {
    hrInfo: HrInfoState;
    setHrInfo: React.Dispatch<React.SetStateAction<HrInfoState>>;
    isDarkMode: boolean;
}

export default function HrEnterpriseForm({ hrInfo, setHrInfo, isDarkMode }: HrEnterpriseFormProps) {
    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const domesticVersion = hrInfo.location?.version || 'new';
    const displayedProvinces = allProvinces.filter(p => p.version === domesticVersion);
    const [districts, setDistricts] = useState<LocationUnit[]>([]);
    const [wards, setWards] = useState<LocationUnit[]>([]);

    useEffect(() => {
        systemService.getLocations().then(res => setAllProvinces(res)).catch(console.error);
    }, []);

    useEffect(() => {
        const loadInitialSubLocations = async () => {
            const currentCountry = hrInfo.location?.country || 'Việt Nam';
            if (currentCountry === 'Việt Nam' && hrInfo.location?.province_code) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(hrInfo.location.province_code);
                    setWards(wds.filter(item => item.version === 'new'));
                    setDistricts([]);
                } else {
                    const dists = await systemService.getSubLocations(hrInfo.location.province_code);
                    setDistricts(dists.filter(item => item.version === 'old'));

                    if (hrInfo.location?.district_code) {
                        const wds = await systemService.getSubLocations(hrInfo.location.district_code);
                        setWards(wds.filter(item => item.version === 'old'));
                    } else {
                        setWards([]);
                    }
                }
            }
        };
        if (hrInfo.location) loadInitialSubLocations();
    }, [hrInfo.location?.province_code, domesticVersion, hrInfo.location?.country]);

    const handleVersionChange = (ver: 'new' | 'old') => {
        setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, version: ver } }));
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const prov = displayedProvinces.find(p => p.code === code);
        setHrInfo((prev: any) => ({
            ...prev,
            location: {
                ...prev.location, province_code: code, province_name: prov?.name || '', version: domesticVersion,
                district_code: '', district_name: '', ward_code: '', ward_name: '', full_address_snapshot: ''
            }
        }));

        if (domesticVersion === 'new') {
            const wds = await systemService.getSubLocations(code);
            setWards(wds.filter(item => item.version === 'new'));
            setDistricts([]);
        } else {
            const dists = await systemService.getSubLocations(code);
            setDistricts(dists.filter(item => item.version === 'old'));
            setWards([]);
        }
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const dist = districts.find(d => d.code === code);
        setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, district_code: code, district_name: dist?.name || '', ward_code: '', ward_name: '', full_address_snapshot: '' } }));
        const wds = await systemService.getSubLocations(code);
        setWards(wds.filter(item => item.version === 'old'));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);
        setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, ward_code: code, ward_name: ward?.name || '' } }));
    };

    const handleLookupTax = async () => {
        if (!hrInfo.taxCode.trim()) return toast.error("Vui lòng nhập Mã số thuế");
        const loadingToast = toast.loading("Đang tra cứu dữ liệu...");
        try {
            const res = await companyService.lookupTax(hrInfo.taxCode);
            const actualData = res?.data?.data || res?.data || res;

            const companyName = actualData.company_name || actualData.name || '';
            const rawAddress = actualData.address || '';

            if (!companyName) throw new Error("Mã số thuế hợp lệ nhưng không tải được tên công ty.");

            let newLocation = { ...hrInfo.location, street_address: rawAddress };

            if (actualData.structured_location) {
                newLocation = {
                    ...hrInfo.location,
                    ...actualData.structured_location,
                    country: 'Việt Nam'
                };
            }

            setHrInfo(prev => ({
                ...prev,
                companyName: companyName,
                location: newLocation
            }));

            toast.success("Đã tìm thấy và tự động điền địa chỉ!", { id: loadingToast });
        } catch (e: any) {
            toast.error(e.message || e.response?.data?.detail || "Không tìm thấy dữ liệu doanh nghiệp", { id: loadingToast });
        }
    };

    const customSelectStyles = {
        control: (base: any, state: any) => ({ ...base, backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderColor: state.isFocused ? '#3b82f6' : isDarkMode ? '#334155' : '#cbd5e1', borderRadius: '0.75rem', minHeight: '42px', padding: '0 4px', boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none' }),
        input: (base: any) => ({ ...base, color: isDarkMode ? '#e2e8f0' : '#334155' }),
        singleValue: (base: any) => ({ ...base, color: isDarkMode ? '#f8fafc' : '#334155' }),
        placeholder: (base: any) => ({ ...base, color: '#94a3b8' }),
        menu: (base: any) => ({ ...base, zIndex: 9999, backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: '0.75rem', overflow: 'hidden' }),
        menuList: (base: any) => ({ ...base, backgroundColor: isDarkMode ? '#1e293b' : '#fff' }),
        option: (base: any, state: any) => ({ ...base, backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? (isDarkMode ? '#334155' : '#eff6ff') : 'transparent', color: state.isSelected ? '#fff' : isDarkMode ? '#e2e8f0' : '#334155', cursor: 'pointer' })
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mã số thuế <span className="text-rose-500">*</span></label>
                <div className="flex gap-2">
                    <input
                        type="text" required
                        value={hrInfo.taxCode}
                        onChange={e => setHrInfo({ ...hrInfo, taxCode: e.target.value })}
                        className="min-w-0 flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all"
                        placeholder="VD: 0312..."
                    />
                    <button
                        type="button"
                        onClick={handleLookupTax}
                        className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shrink-0 transition-colors shadow-sm"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tên Công ty <span className="text-rose-500">*</span></label>
                <input
                    type="text" required
                    value={hrInfo.companyName}
                    onChange={e => setHrInfo({ ...hrInfo, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all"
                    placeholder="Tên doanh nghiệp"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngành nghề <span className="text-rose-500">*</span></label>
                <Select
                    options={GROUPED_INDUSTRIES}
                    styles={customSelectStyles}
                    placeholder="Chọn lĩnh vực..."
                    noOptionsMessage={() => "Không tìm thấy"}
                    value={INDUSTRIES.find(i => i.value === hrInfo.industry) || null}
                    onChange={(selected: any) => setHrInfo({ ...hrInfo, industry: selected?.value || '' })}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Quy mô <span className="text-rose-500">*</span></label>
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                        value={hrInfo.size}
                        onChange={e => setHrInfo({ ...hrInfo, size: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white appearance-none transition-all cursor-pointer"
                    >
                        <option value="">Chọn quy mô</option>
                        {COMPANY_SIZES.map(size => (
                            <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* MODULE ĐỊA ĐIỂM CHUẨN */}
            <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trụ sở kinh doanh</label>
                    {(hrInfo.location?.country || 'Việt Nam') === 'Việt Nam' && (
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button type="button" onClick={() => handleVersionChange('new')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'new' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Mới</button>
                            <button type="button" onClick={() => handleVersionChange('old')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'old' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Cũ</button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all cursor-pointer"
                        value={hrInfo.location?.country || 'Việt Nam'}
                        onChange={e => setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, country: e.target.value, province_code: '', district_code: '', ward_code: '' } }))}
                    >
                        <option value="Việt Nam">Việt Nam</option>
                        <option value="Nước ngoài">Nước ngoài</option>
                    </select>

                    {(hrInfo.location?.country || 'Việt Nam') === 'Việt Nam' ? (
                        <>
                            <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all cursor-pointer" value={hrInfo.location?.province_code || ''} onChange={handleProvinceChange}>
                                <option value="" disabled>Tỉnh/Thành phố</option>
                                {displayedProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>

                            {domesticVersion === 'old' && (
                                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all cursor-pointer disabled:opacity-50" value={hrInfo.location?.district_code || ''} onChange={handleDistrictChange} disabled={!hrInfo.location?.province_code}>
                                    <option value="" disabled>Quận/Huyện</option>
                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                </select>
                            )}

                            <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all cursor-pointer disabled:opacity-50" value={hrInfo.location?.ward_code || ''} onChange={handleWardChange} disabled={domesticVersion === 'new' ? !hrInfo.location?.province_code : !hrInfo.location?.district_code}>
                                <option value="" disabled>Phường/Xã</option>
                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                            </select>

                            <div className="col-span-1 md:col-span-4 relative mt-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Số nhà, tên đường (Hoặc địa chỉ tự điền từ Tra cứu MST)"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all"
                                    value={hrInfo.location?.street_address || ''}
                                    onChange={e => setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, street_address: e.target.value } }))}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="col-span-1 md:col-span-3 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="VD: 123 Orchard Road, Singapore"
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all"
                                value={hrInfo.location?.street_address || ''}
                                onChange={e => setHrInfo((prev: any) => ({ ...prev, location: { ...prev.location, street_address: e.target.value } }))}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Website (Tùy chọn)</label>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="url"
                        value={hrInfo.website}
                        onChange={e => setHrInfo({ ...hrInfo, website: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all"
                        placeholder="https://www.company.com"
                    />
                </div>
            </div>
        </div>
    );
}