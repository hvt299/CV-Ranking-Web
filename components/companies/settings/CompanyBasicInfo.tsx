'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { companyService } from '@/features/company/company.service';
import { INDUSTRIES, GROUPED_INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';

export default function CompanyBasicInfo({ company, setCompany }: { company: any, setCompany: any }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Lắng nghe thay đổi Dark mode cho react-select
    useEffect(() => {
        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
            borderColor: state.isFocused ? '#3b82f6' : (isDarkMode ? '#334155' : '#e2e8f0'),
            borderRadius: '0.75rem', minHeight: '42px', padding: '0 4px',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none', fontSize: '0.875rem',
        }),
        menu: (base: any) => ({ ...base, zIndex: 9999, backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', fontSize: '0.875rem' }),
        option: (base: any, state: any) => ({
            ...base, cursor: 'pointer',
            backgroundColor: state.isFocused ? (isDarkMode ? '#334155' : '#eff6ff') : 'transparent',
            color: isDarkMode ? '#e2e8f0' : '#334155'
        }),
        multiValue: (base: any) => ({ ...base, backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '0.5rem' }),
        multiValueLabel: (base: any) => ({ ...base, color: isDarkMode ? '#f8fafc' : '#1e293b', fontWeight: 'bold' }),
        multiValueRemove: (base: any) => ({ ...base, ':hover': { backgroundColor: '#ef4444', color: 'white', borderRadius: '0 0.5rem 0.5rem 0' } }),
    };

    const handleLookupTax = async () => {
        if (!company.tax_code?.trim()) return toast.error("Vui lòng nhập mã số thuế");
        try {
            const res = await companyService.lookupTax(company.tax_code);
            let newLocation = { ...company.location, street_address: res.address || company.location?.street_address };

            if (res.structured_location) {
                newLocation = { ...company.location, ...res.structured_location, country: 'Việt Nam' };
            }

            setCompany((prev: any) => ({
                ...prev,
                name: res.company_name || prev.name,
                location: newLocation
            }));

            toast.success("Đã tìm thấy và tự động điền địa chỉ!");
        } catch (e) {
            toast.error("Không tìm thấy dữ liệu từ Mã số thuế này");
        }
    };

    return (
        <>
            <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Mã số thuế (MST) <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={company.tax_code || ''}
                        onChange={e => setCompany({ ...company, tax_code: e.target.value })}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors"
                        placeholder="VD: 0312345678"
                    />
                    <button type="button" onClick={handleLookupTax} className="px-5 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold rounded-xl text-sm hover:bg-primary-200 dark:hover:bg-primary-900/50 whitespace-nowrap transition-colors">Tra cứu</button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Tên Công ty</label>
                <input
                    type="text"
                    value={company.name || ''}
                    onChange={e => setCompany({ ...company, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors"
                    placeholder="Ví dụ: Công ty TNHH Công nghệ ABC"
                />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Ngành nghề (Tối đa 3)</label>
                <Select
                    isMulti
                    options={GROUPED_INDUSTRIES}
                    styles={customSelectStyles}
                    placeholder="Chọn lĩnh vực hoạt động..."
                    noOptionsMessage={() => "Không tìm thấy"}
                    value={(company.industries || []).map((val: string) => {
                        const ind = INDUSTRIES.find(i => i.value === val);
                        return ind ? { value: ind.value, label: ind.label } : null;
                    }).filter(Boolean)}
                    onChange={(selected: any) => {
                        if (selected && selected.length > 3) {
                            return toast.error("Chỉ được chọn tối đa 3 ngành nghề!");
                        }
                        setCompany({ ...company, industries: selected ? selected.map((s: any) => s.value) : [] });
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Quy mô nhân sự</label>
                <select value={company.size || ''} onChange={e => setCompany({ ...company, size: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 cursor-pointer transition-colors">
                    <option value="">Chọn quy mô</option>
                    {COMPANY_SIZES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Website (Tùy chọn)</label>
                <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="url" value={company.website || ''} onChange={e => setCompany({ ...company, website: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors" placeholder="https://company.com" />
                </div>
            </div>
        </>
    );
}