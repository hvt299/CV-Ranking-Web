'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, Mail, Briefcase, Globe, MapPin, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import Select from 'react-select';
import { INDUSTRIES, GROUPED_INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES, COMPANY_STATUS_CONFIG } from '@/constants/company.constants';
import { companyService } from '@/features/company/company.service';
import { systemService, LocationUnit } from '@/features/system/system.service';
import ProfileForm from '@/components/shared/ProfileForm';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [mainTab, setMainTab] = useState<'personal' | 'business'>('personal');

    if (!user) return null;

    const isOwner = user.role === UserRole.HR_OWNER;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-32">

            {/* HEADER CÀI ĐẶT */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Cài đặt Hệ thống</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý tài khoản cá nhân và cấu hình doanh nghiệp.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-auto border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setMainTab('personal')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${mainTab === 'personal' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <UserIcon className="w-4 h-4" /> Cá nhân
                    </button>
                    {isOwner && (
                        <button
                            onClick={() => setMainTab('business')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${mainTab === 'business' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <Building2 className="w-4 h-4" /> Doanh nghiệp
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT RENDER */}
            <div className="w-full">
                {mainTab === 'personal' ? (
                    <ProfileForm />
                ) : isOwner ? (
                    <CompanySettingsSection user={user} />
                ) : null}
            </div>
        </div>
    );
}

function CompanySettingsSection({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState('info');
    const [company, setCompany] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);

    const [taxCode, setTaxCode] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isUploadingLicense, setIsUploadingLicense] = useState(false);

    const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLicense(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await companyService.uploadFile(formData);
            setCompany((prev: any) => ({ ...prev, license_file_url: res.file_url || res.url }));
            toast.success('Tải giấy phép lên thành công!');
        } catch (error) {
            toast.error('Lỗi khi tải file lên');
        } finally {
            setIsUploadingLicense(false);
        }
    };

    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const domesticVersion = company?.location?.version || 'new';
    const displayedProvinces = allProvinces.filter(p => p.version === domesticVersion);
    const [districts, setDistricts] = useState<LocationUnit[]>([]);
    const [wards, setWards] = useState<LocationUnit[]>([]);

    useEffect(() => {
        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        systemService.getLocations().then(res => setAllProvinces(res)).catch(console.error);
    }, []);

    useEffect(() => {
        companyService.getSettings().then(res => {
            const compData = res.data || res;

            if (!compData.location) {
                compData.location = { country: 'Việt Nam', version: 'new', province_code: '', district_code: '', ward_code: '', street_address: compData.address || '' };
            }

            setCompany(compData);
            setTaxCode(compData?.tax_code || '');

        }).catch(err => console.error(err));

        companyService.getMembers().then(res => {
            const memData = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
            setMembers(memData);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const loadInitialSubLocations = async () => {
            if (company?.location?.country === 'Việt Nam' && company?.location?.province_code) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(company.location.province_code);
                    setWards(wds.filter(item => item.version === 'new'));
                } else {
                    const dists = await systemService.getSubLocations(company.location.province_code);
                    setDistricts(dists.filter(item => item.version === 'old'));

                    if (company.location?.district_code) {
                        const wds = await systemService.getSubLocations(company.location.district_code);
                        setWards(wds.filter(item => item.version === 'old'));
                    }
                }
            }
        };
        if (company) loadInitialSubLocations();
    }, [company?.location?.province_code, domesticVersion]);

    const handleVersionChange = (ver: 'new' | 'old') => {
        setCompany({
            ...company, location: { ...company.location, version: ver }
        });
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const prov = displayedProvinces.find(p => p.code === code);
        setCompany({
            ...company,
            location: {
                ...company.location,
                province_code: code,
                province_name: prov?.name || '',
                version: domesticVersion,
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
        setCompany({ ...company, location: { ...company.location, district_code: code, district_name: dist?.name || '', ward_code: '', ward_name: '', full_address_snapshot: '' } });
        const wds = await systemService.getSubLocations(code);
        setWards(wds.filter(item => item.version === 'old'));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);
        setCompany({ ...company, location: { ...company.location, ward_code: code, ward_name: ward?.name || '' } });
    };

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
        singleValue: (base: any) => ({ ...base, color: isDarkMode ? '#e2e8f0' : '#334155' }),
        input: (base: any) => ({ ...base, color: isDarkMode ? '#e2e8f0' : '#334155' }),
    };

    const handleLookupTax = async () => {
        if (!taxCode.trim()) return toast.error("Vui lòng nhập mã số thuế");
        try {
            const res = await companyService.lookupTax(taxCode);

            let newLocation = { ...company.location, street_address: res.address || company.location.street_address };

            if (res.structured_location) {
                newLocation = {
                    ...company.location,
                    ...res.structured_location,
                    country: 'Việt Nam'
                };
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

    const handleSaveCompany = async () => {
        setIsSaving(true);
        try {
            const payload = {
                tax_code: taxCode,
                name: company.name,
                industry: company.industry,
                size: company.size,
                website: company.website,
                location: company.location,
                address: company.location.street_address,
                license_file_url: company.license_file_url
            };

            const res = await companyService.updateSettings(payload);

            setCompany((prev: any) => ({
                ...prev,
                ...payload,
                status: res.new_company_status || prev.status,
                updated_at: new Date().toISOString()
            }));

            toast.success("Đã cập nhật thông tin công ty thành công!");

        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Lỗi khi lưu thông tin");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInviteMember = async () => {
        if (!inviteEmail.trim()) return toast.error("Vui lòng nhập Email");
        try {
            await companyService.inviteMember(inviteEmail)
            toast.success("Đã gửi thư mời gia nhập công ty thành công!");
            setInviteEmail('');
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Không thể gửi thư mời");
        }
    };

    return (
        <div className="space-y-6">
            {/* TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 font-bold text-sm rounded-xl transition-colors ${activeTab === 'info'
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}>
                    Xác minh KYC
                </button>
                <button onClick={() => setActiveTab('members')}
                    className={`px-4 py-2 font-bold text-sm rounded-xl transition-colors ${activeTab === 'members'
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}>
                    Đội ngũ Nhân sự
                </button>
            </div>

            {
                activeTab === 'info' && company && (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 space-y-8 animate-in fade-in">
                        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-inner">
                            <div>
                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">Trạng thái Doanh nghiệp</p>
                                <p className="text-xs text-slate-500 font-medium">Chỉ công ty Đã duyệt mới được phép xuất bản chiến dịch Job.</p>
                            </div>
                            {(() => {
                                const config = COMPANY_STATUS_CONFIG[company.status] || COMPANY_STATUS_CONFIG['default'];
                                const Icon = config.icon;
                                return (
                                    <span className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-1.5 shadow-sm ${config.color}`}>
                                        <Icon className="w-4 h-4" />
                                        {config.label}
                                    </span>
                                );
                            })()}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Mã số thuế (MST) <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <input type="text" value={taxCode} onChange={e => setTaxCode(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors" placeholder="VD: 0312345678" />
                                    <button onClick={handleLookupTax} className="px-5 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold rounded-xl text-sm hover:bg-primary-200 dark:hover:bg-primary-900/50 whitespace-nowrap transition-colors">Tra cứu</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Tên Công ty</label>
                                <input type="text" value={company.name || ''} onChange={e => setCompany({ ...company, name: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors" placeholder="Ví dụ: Công ty TNHH Công nghệ ABC" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Ngành nghề</label>
                                <Select
                                    options={GROUPED_INDUSTRIES}
                                    styles={customSelectStyles}
                                    placeholder="Tìm ngành nghề..."
                                    noOptionsMessage={() => "Không tìm thấy"}
                                    value={INDUSTRIES.find(i => i.value === company.industry) || null}
                                    onChange={(selected: any) => setCompany({ ...company, industry: selected?.value || '' })}
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

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Website (Tùy chọn)</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="url" value={company.website || ''} onChange={e => setCompany({ ...company, website: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors" placeholder="https://www.company-website.com" />
                                </div>
                            </div>

                            {/* MODULE ĐỊA ĐIỂM CHUẨN */}
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

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Giấy phép kinh doanh</label>
                                <input
                                    type="text"
                                    value={company.license_file_url || ""}
                                    onChange={(e) => setCompany({ ...company, license_file_url: e.target.value })}
                                    placeholder="https://res.cloudinary.com/..."
                                    className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none focus:border-primary-500 transition-colors"
                                />

                                <label
                                    className={`group flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 ${isUploadingLicense ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (isUploadingLicense) return;
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) handleLicenseUpload({ target: { files: [file] } } as any);
                                    }}
                                >
                                    <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleLicenseUpload} disabled={isUploadingLicense} />
                                    <Briefcase className="w-12 h-12 text-primary-500 mb-4 group-hover:scale-110 transition-transform" />
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{isUploadingLicense ? "Đang tải lên..." : "Kéo & thả file vào đây"}</p>
                                    {!isUploadingLicense && (
                                        <>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">hoặc <span className="text-primary-600 font-bold">bấm để chọn file</span></p>
                                            <p className="mt-2 text-xs text-slate-400 font-medium">PDF, JPG, PNG • Tối đa 10MB</p>
                                        </>
                                    )}
                                    {company.license_file_url && (
                                        <a href={company.license_file_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary-600 hover:underline mt-4 inline-block relative z-10 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-lg shadow-sm" onClick={(e) => e.stopPropagation()}>Xem file hiện tại</a>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
                            <button onClick={handleSaveCompany} disabled={isSaving} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70">
                                <Save className="w-5 h-5" /> {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                )
            }

            {/* TAB MEMBERS GIỮ NGUYÊN HOẶC ĐỒNG BỘ CSS NẾU MUỐN */}
            {
                activeTab === 'members' && (
                    <div className="space-y-6 animate-in fade-in">
                        {user.role === UserRole.HR_OWNER && (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="font-black mb-4 flex items-center gap-2 text-slate-800 dark:text-white"><Mail className="w-5 h-5 text-primary-500" /> Mời thành viên mới (HR Member)</h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Nhập email nhân viên..." className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors" />
                                    <button onClick={handleInviteMember} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all">Gửi lời mời</button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                                    <tr><th className="p-5 pl-6">Thành viên</th><th className="p-5">Quyền hạn</th><th className="p-5">Trạng thái</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {members.map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-5 pl-6">
                                                <div className="flex items-center gap-4">
                                                    {m.avatar_url ? (
                                                        <img src={m.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 uppercase shadow-sm shrink-0">
                                                            {m.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">{m.full_name}</p>
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm ${m.role === UserRole.HR_OWNER ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>{m.role}</span>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm ${m.is_verified ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>{m.is_verified ? 'Hoạt động' : 'Chờ xác thực'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div>
    );
}