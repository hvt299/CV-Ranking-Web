'use client';

import { useState, useEffect } from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import { systemService, LocationUnit } from '@/features/system/system.service';
import { parseCurrency, formatCurrency } from '@/utils/format';

interface Step2Props {
    formData: any;
    setFormData: (data: any) => void;
    isNegotiable: boolean;
    setIsNegotiable: (val: boolean) => void;
}

export default function Step2LocationSalary({ formData, setFormData, isNegotiable, setIsNegotiable }: Step2Props) {
    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const [domesticVersion, setDomesticVersion] = useState<'new' | 'old'>(formData.location?.version || 'new');
    const [districts, setDistricts] = useState<LocationUnit[]>([]);
    const [wards, setWards] = useState<LocationUnit[]>([]);

    const displayedProvinces = allProvinces.filter(p => p.version === domesticVersion);

    // 1. Fetch Provinces lần đầu
    useEffect(() => {
        systemService.getLocations().then(res => setAllProvinces(res)).catch(console.error);
    }, []);

    // 2. [FIX EDIT JOB] Load Districts & Wards nếu formData đã có sẵn (Edit Mode)
    useEffect(() => {
        const loadInitialSubLocations = async () => {
            if (formData.location?.country === 'Việt Nam' && formData.location?.province_code) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(formData.location.province_code);
                    setWards(wds.filter(item => item.version === 'new'));
                } else {
                    const dists = await systemService.getSubLocations(formData.location.province_code);
                    setDistricts(dists.filter(item => item.version === 'old'));

                    if (formData.location?.district_code) {
                        const wds = await systemService.getSubLocations(formData.location.district_code);
                        setWards(wds.filter(item => item.version === 'old'));
                    }
                }
            }
        };

        loadInitialSubLocations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.location?.province_code, domesticVersion]); // Chỉ trigger khi Province thay đổi hoặc đổi Version

    const handleVersionChange = (ver: 'new' | 'old') => {
        setDomesticVersion(ver);
        setFormData({
            ...formData, location: { ...formData.location, version: ver }
        });
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;

        // FIX: tìm trong displayedProvinces (đã lọc theo domesticVersion đang active),
        // KHÔNG tìm trong allProvinces — vì mã tỉnh có thể trùng giữa bộ dữ liệu
        // "old" và "new" (VD: Hà Nội/TP.HCM giữ nguyên code ở cả 2 hệ), khiến .find()
        // trên mảng chưa lọc trả nhầm bản ghi khác phiên bản.
        const prov = displayedProvinces.find(p => p.code === code);

        setFormData({
            ...formData,
            location: {
                ...formData.location,
                province_code: code,
                province_name: prov?.name || '',
                version: domesticVersion, // Dùng thẳng tab đang active làm nguồn sự thật, KHÔNG suy ra từ prov.version
                district_code: '', district_name: '', ward_code: '', ward_name: '', full_address_snapshot: ''
            }
        });

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
        setFormData({ ...formData, location: { ...formData.location, district_code: code, district_name: dist?.name || '', ward_code: '', ward_name: '', full_address_snapshot: '' } });
        const wds = await systemService.getSubLocations(code);
        setWards(wds.filter(item => item.version === 'old'));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);
        setFormData({ ...formData, location: { ...formData.location, ward_code: code, ward_name: ward?.name || '' } });
    };

    const [salaryStr, setSalaryStr] = useState({
        min: formatCurrency(formData.salary?.min_salary || 10000000),
        max: formatCurrency(formData.salary?.max_salary || 30000000)
    });

    useEffect(() => {
        setSalaryStr({
            min: formatCurrency(formData.salary?.min_salary || 0),
            max: formatCurrency(formData.salary?.max_salary || 0)
        });
    }, [formData.salary?.min_salary, formData.salary?.max_salary]);

    const handleManualSalaryChange = (type: 'min' | 'max', value: string) => {
        const numVal = parseCurrency(value);
        setSalaryStr(prev => ({ ...prev, [type]: formatCurrency(numVal) }));
        setFormData({ ...formData, salary: { ...formData.salary, [`${type}_salary`]: numVal } });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            {/* --- KHU VỰC ĐỊA ĐIỂM LÀM VIỆC --- */}
            <div className="space-y-6">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Khu vực làm việc</h2>
                            <p className="text-xs text-slate-500 mt-1">Đồng bộ chính xác với cơ sở dữ liệu hành chính mới nhất.</p>
                        </div>
                    </div>
                    {(formData.location?.country || 'Việt Nam') === 'Việt Nam' && (
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button type="button" onClick={() => handleVersionChange('new')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'new' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Mới (Hiện tại)</button>
                            <button type="button" onClick={() => handleVersionChange('old')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'old' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Cũ (Trước 1/7/2025)</button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer"
                        value={formData.location?.country || 'Việt Nam'}
                        onChange={e => setFormData({ ...formData, location: { ...formData.location, country: e.target.value, province_code: '', district_code: '', ward_code: '' } })}
                    >
                        <option value="Việt Nam">Việt Nam</option>
                        <option value="Nước ngoài">Nước ngoài</option>
                    </select>

                    {(formData.location?.country || 'Việt Nam') === 'Việt Nam' ? (
                        <>
                            <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer" value={formData.location?.province_code || ''} onChange={handleProvinceChange}>
                                <option value="" disabled>Tỉnh/Thành phố</option>
                                {displayedProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>

                            {domesticVersion === 'old' && (
                                <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer disabled:opacity-50" value={formData.location?.district_code || ''} onChange={handleDistrictChange} disabled={!formData.location?.province_code}>
                                    <option value="" disabled>Quận/Huyện</option>
                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                </select>
                            )}

                            <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer disabled:opacity-50" value={formData.location?.ward_code || ''} onChange={handleWardChange} disabled={domesticVersion === 'new' ? !formData.location?.province_code : !formData.location?.district_code}>
                                <option value="" disabled>Phường/Xã</option>
                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                            </select>

                            <div className="col-span-1 md:col-span-4 mt-1 relative">
                                <input
                                    type="text"
                                    placeholder="Nhập số nhà, tên đường, tòa nhà..."
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 transition-colors"
                                    value={formData.location?.street_address || ''}
                                    onChange={e => setFormData({ ...formData, location: { ...formData.location, street_address: e.target.value } })}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="col-span-1 md:col-span-3 mt-1 relative">
                            <input
                                type="text"
                                placeholder="VD: 123 Orchard Road, Singapore"
                                className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 transition-colors"
                                value={formData.location?.street_address || ''}
                                onChange={e => setFormData({ ...formData, location: { ...formData.location, street_address: e.target.value } })}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* --- KHU VỰC MỨC LƯƠNG & CHẾ ĐỘ --- */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Lương & Chế độ</h2>
                        <p className="text-xs text-slate-500 mt-1">Ngân sách dự kiến và thời gian làm việc.</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                    <label className="font-bold text-slate-800 dark:text-white">Mức lương dự kiến</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                        <input type="checkbox" className="w-4 h-4 accent-amber-500 rounded" checked={isNegotiable} onChange={(e) => setIsNegotiable(e.target.checked)} />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Lương thỏa thuận</span>
                    </label>
                </div>

                {!isNegotiable ? (
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tiền tệ</label>
                                <select className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm" value={formData.salary.currency} onChange={e => setFormData({ ...formData, salary: { ...formData.salary, currency: e.target.value } })}>
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tối thiểu</label>
                                <div className="relative">
                                    <input type="text" value={salaryStr.min} onChange={(e) => handleManualSalaryChange('min', e.target.value)} className="w-full p-3 pr-16 font-bold text-lg text-primary-700 dark:text-primary-400 bg-slate-50 dark:bg-slate-900 border border-primary-200 dark:border-primary-800 rounded-xl outline-none focus:ring-2 ring-primary-100 dark:ring-primary-900 shadow-sm transition-colors" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{formData.salary.currency}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tối đa</label>
                                <div className="relative">
                                    <input type="text" value={salaryStr.max} onChange={(e) => handleManualSalaryChange('max', e.target.value)} className="w-full p-3 pr-16 font-bold text-lg text-emerald-700 dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl outline-none focus:ring-2 ring-emerald-100 dark:ring-emerald-900 shadow-sm transition-colors" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{formData.salary.currency}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 px-6 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Mức lương thỏa thuận</span>
                            <span className="text-xs text-slate-500 mt-0.5">Sẽ được trao đổi trực tiếp khi phỏng vấn ứng viên</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Thời gian làm việc</label>
                        <input type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-amber-500 transition-colors" value={formData.working_hours} onChange={e => setFormData({ ...formData, working_hours: e.target.value })} placeholder="VD: 08:00 - 17:30, Thứ 2 - Thứ 6" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Thời gian thử việc</label>
                        <input type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-amber-500 transition-colors" value={formData.probation_period} onChange={e => setFormData({ ...formData, probation_period: e.target.value })} placeholder="VD: 2 tháng, 100% lương" />
                    </div>
                </div>
            </div>
        </div>
    );
}