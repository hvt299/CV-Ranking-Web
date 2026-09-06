'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { systemService, LocationUnit } from '@/features/system/system.service';

export default function CompanyLocation({ company, setCompany }: { company: any, setCompany: any }) {
    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const [districts, setDistricts] = useState<LocationUnit[]>([]);
    const [wards, setWards] = useState<LocationUnit[]>([]);

    const domesticVersion = company?.location?.version || 'new';
    const displayedProvinces = allProvinces.filter(p => p.version === domesticVersion);

    useEffect(() => {
        systemService.getLocations().then(res => setAllProvinces(res)).catch(console.error);
    }, []);

    useEffect(() => {
        const loadInitialSubLocations = async () => {
            if (company?.location?.country === 'Việt Nam' && company?.location?.province_code) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(company.location.province_code);
                    setWards(wds.filter((item: LocationUnit) => item.version === 'new'));
                    setDistricts([]);
                } else {
                    const dists = await systemService.getSubLocations(company.location.province_code);
                    setDistricts(dists.filter((item: LocationUnit) => item.version === 'old'));

                    if (company.location?.district_code) {
                        const wds = await systemService.getSubLocations(company.location.district_code);
                        setWards(wds.filter((item: LocationUnit) => item.version === 'old'));
                    }
                }
            }
        };
        if (company) loadInitialSubLocations();
    }, [company?.location?.province_code, domesticVersion, company?.location?.country]);

    const handleVersionChange = (ver: 'new' | 'old') => {
        setCompany({ ...company, location: { ...company.location, version: ver } });
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const prov = displayedProvinces.find(p => p.code === code);
        setCompany({
            ...company,
            location: {
                ...company.location, province_code: code, province_name: prov?.name || '',
                version: domesticVersion, district_code: '', district_name: '', ward_code: '', ward_name: '', full_address_snapshot: ''
            }
        });

        if (domesticVersion === 'new') {
            const wds = await systemService.getSubLocations(code);
            setWards(wds.filter((item: LocationUnit) => item.version === 'new'));
            setDistricts([]);
        } else {
            const dists = await systemService.getSubLocations(code);
            setDistricts(dists.filter((item: LocationUnit) => item.version === 'old'));
            setWards([]);
        }
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const dist = districts.find(d => d.code === code);
        setCompany({ ...company, location: { ...company.location, district_code: code, district_name: dist?.name || '', ward_code: '', ward_name: '', full_address_snapshot: '' } });
        const wds = await systemService.getSubLocations(code);
        setWards(wds.filter((item: LocationUnit) => item.version === 'old'));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);
        setCompany({ ...company, location: { ...company.location, ward_code: code, ward_name: ward?.name || '' } });
    };

    return (
        <div className="md:col-span-2 bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-500" /> Trụ sở kinh doanh
                </label>
                {(company.location?.country || 'Việt Nam') === 'Việt Nam' && (
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button type="button" onClick={() => handleVersionChange('new')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'new' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Mới (Hiện tại)</button>
                        <button type="button" onClick={() => handleVersionChange('old')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'old' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Cũ (Trước 1/7/2025)</button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                    className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer"
                    value={company.location?.country || 'Việt Nam'}
                    onChange={e => setCompany({ ...company, location: { ...company.location, country: e.target.value, province_code: '', district_code: '', ward_code: '' } })}
                >
                    <option value="Việt Nam">Việt Nam</option>
                    <option value="Nước ngoài">Nước ngoài</option>
                </select>

                {(company.location?.country || 'Việt Nam') === 'Việt Nam' ? (
                    <>
                        <select className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer" value={company.location?.province_code || ''} onChange={handleProvinceChange}>
                            <option value="" disabled>Tỉnh/Thành phố</option>
                            {displayedProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>

                        {domesticVersion === 'old' && (
                            <select className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer disabled:opacity-50" value={company.location?.district_code || ''} onChange={handleDistrictChange} disabled={!company.location?.province_code}>
                                <option value="" disabled>Quận/Huyện</option>
                                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                            </select>
                        )}

                        <select className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer disabled:opacity-50" value={company.location?.ward_code || ''} onChange={handleWardChange} disabled={domesticVersion === 'new' ? !company.location?.province_code : !company.location?.district_code}>
                            <option value="" disabled>Phường/Xã</option>
                            {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                        </select>

                        <div className="col-span-1 md:col-span-4 mt-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Số nhà, tên đường (Hoặc địa chỉ tự động điền từ Tra cứu MST)"
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 transition-colors"
                                value={company.location?.street_address || ''}
                                onChange={e => setCompany({ ...company, location: { ...company.location, street_address: e.target.value } })}
                            />
                        </div>
                    </>
                ) : (
                    <div className="col-span-1 md:col-span-3 mt-1 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="VD: 123 Orchard Road, Singapore"
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 transition-colors"
                            value={company.location?.street_address || ''}
                            onChange={e => setCompany({ ...company, location: { ...company.location, street_address: e.target.value } })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}