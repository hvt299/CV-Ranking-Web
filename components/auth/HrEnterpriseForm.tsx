'use client';

import { Search, Globe, MapPin, Users } from 'lucide-react';
import Select from 'react-select';
import { INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { companyService } from '@/features/company/company.service';
import toast from 'react-hot-toast';
import { parseVietnameseAddress } from '@/utils/format';

interface HrInfoState {
    companyName: string;
    taxCode: string;
    industry: string;
    size: string;
    address: string;
    website: string;
}

interface HrEnterpriseFormProps {
    hrInfo: HrInfoState;
    setHrInfo: React.Dispatch<React.SetStateAction<HrInfoState>>;
    isDarkMode: boolean;
}

export default function HrEnterpriseForm({ hrInfo, setHrInfo, isDarkMode }: HrEnterpriseFormProps) {

    // Logic Lookup Tax với màng bọc an toàn 3 lớp (Bulletproof)
    const handleLookupTax = async () => {
        if (!hrInfo.taxCode.trim()) return toast.error("Vui lòng nhập Mã số thuế");
        const loadingToast = toast.loading("Đang tra cứu dữ liệu...");
        try {
            const res = await companyService.lookupTax(hrInfo.taxCode);

            // Lớp bọc an toàn: Tìm object chứa dữ liệu thật sự dù Axios có unwrap hay không
            const actualData = res?.data?.data || res?.data || res;

            // Quét tìm trường Tên công ty từ các định dạng API khác nhau
            const companyName = actualData.company_name || actualData.name || '';
            const rawAddress = actualData.address || '';

            if (!companyName) throw new Error("Mã số thuế hợp lệ nhưng không tải được tên công ty.");

            // Parse địa chỉ để lấy full_address hiển thị
            const parsedLoc = parseVietnameseAddress(rawAddress);

            setHrInfo(prev => ({
                ...prev,
                companyName: companyName,
                address: parsedLoc.full_address_snapshot
            }));

            toast.success("Đã tìm thấy thông tin công ty!", { id: loadingToast });
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
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngành nghề</label>
                <Select
                    options={INDUSTRIES}
                    styles={customSelectStyles}
                    placeholder="Chọn lĩnh vực..."
                    noOptionsMessage={() => "Không tìm thấy"}
                    value={INDUSTRIES.find(i => i.value === hrInfo.industry) || null}
                    onChange={(selected: any) => setHrInfo({ ...hrInfo, industry: selected?.value || '' })}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Quy mô</label>
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                        value={hrInfo.size}
                        onChange={e => setHrInfo({ ...hrInfo, size: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white appearance-none transition-all"
                    >
                        <option value="">Chọn quy mô</option>
                        {COMPANY_SIZES.map(size => (
                            <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Địa chỉ</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        value={hrInfo.address}
                        onChange={e => setHrInfo({ ...hrInfo, address: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900 dark:text-white transition-all"
                        placeholder="Địa chỉ trụ sở chính"
                    />
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