'use client';

import { useState, useEffect } from 'react';
import {
    Building2, Search, CheckCircle, XCircle, AlertCircle,
    ExternalLink, Save, Briefcase, Filter, MapPin, Globe,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CompanyStatus } from '@/types';
import Select from 'react-select';
import { INDUSTRIES, GROUPED_INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES, COMPANY_STATUS_CONFIG } from '@/constants/company.constants';
import { companyService } from '@/features/company/company.service';
import { systemService, LocationUnit } from '@/features/system/system.service';
import { useAdminCompanies } from '@/features/company/useCompany';

export default function AdminCompaniesPage() {
    const { companies, isLoading, verifyCompany, updateCompany } = useAdminCompanies();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const [editingCompany, setEditingCompany] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isUploadingLicense, setIsUploadingLicense] = useState(false);

    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const domesticVersion = editingCompany?.location?.version || 'new';
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
        const loadInitialSubLocations = async () => {
            const currentCountry = editingCompany?.location?.country || 'Việt Nam';
            if (currentCountry === 'Việt Nam' && editingCompany?.location?.province_code) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(editingCompany.location.province_code);
                    setWards(wds.filter(item => item.version === 'new'));
                    setDistricts([]);
                } else {
                    const dists = await systemService.getSubLocations(editingCompany.location.province_code);
                    setDistricts(dists.filter(item => item.version === 'old'));

                    if (editingCompany.location?.district_code) {
                        const wds = await systemService.getSubLocations(editingCompany.location.district_code);
                        setWards(wds.filter(item => item.version === 'old'));
                    } else {
                        setWards([]);
                    }
                }
            }
        };
        if (editingCompany?.location) loadInitialSubLocations();
    }, [editingCompany?.location?.province_code, domesticVersion, editingCompany?.location?.country]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filtered = companies.filter(c => {
        const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.tax_code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const paginatedCompanies = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const pendingCount = companies.filter(c => c.status === CompanyStatus.PENDING_VERIFICATION).length;

    const handleVersionChange = (ver: 'new' | 'old') => {
        setEditingCompany((prev: any) => ({ ...prev, location: { ...prev.location, version: ver } }));
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const prov = displayedProvinces.find(p => p.code === code);
        setEditingCompany((prev: any) => ({
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
        setEditingCompany((prev: any) => ({ ...prev, location: { ...prev.location, district_code: code, district_name: dist?.name || '', ward_code: '', ward_name: '', full_address_snapshot: '' } }));
        const wds = await systemService.getSubLocations(code);
        setWards(wds.filter(item => item.version === 'old'));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);
        setEditingCompany((prev: any) => ({ ...prev, location: { ...prev.location, ward_code: code, ward_name: ward?.name || '' } }));
    };

    const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLicense(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await companyService.uploadFile(formData);
            setEditingCompany({ ...editingCompany, license_file_url: res.file_url || res.url });
            toast.success('Tải giấy phép lên thành công!');
        } catch (error) {
            toast.error('Lỗi khi tải file lên');
        } finally {
            setIsUploadingLicense(false);
        }
    };

    const handleLookupTax = async () => {
        if (!editingCompany?.tax_code?.trim()) return toast.error("Vui lòng nhập Mã số thuế trước khi tra cứu");
        const loadingToast = toast.loading("Đang tra cứu dữ liệu từ Tổng cục Thuế...");
        try {
            const res = await companyService.lookupTax(editingCompany.tax_code);
            const actualData = res?.data?.data || res?.data || res;

            const companyName = actualData.company_name || actualData.name || '';
            const rawAddress = actualData.address || '';

            let newLocation = { ...editingCompany.location, street_address: rawAddress };

            if (actualData.structured_location) {
                newLocation = {
                    ...editingCompany.location,
                    ...actualData.structured_location,
                    country: 'Việt Nam'
                };
            }

            setEditingCompany((prev: any) => ({
                ...prev,
                name: companyName || prev.name,
                location: newLocation
            }));

            toast.success("Đã tra cứu thành công! Hệ thống tự động điền địa chỉ mới.", { id: loadingToast });
        } catch (e: any) {
            toast.error(e.message || "Không tìm thấy dữ liệu từ Mã số thuế này", { id: loadingToast });
        }
    };

    const handleVerify = async (companyId: string, approve: boolean) => {
        if (!approve && !rejectionReason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối!');
            return;
        }

        const success = await verifyCompany(companyId, approve, rejectionReason);
        if (success) {
            setShowRejectModal(false);
            setRejectionReason('');
            setVerifyingId(null);
        }
    };

    const openEditModal = (c: any) => {
        setEditingCompany({
            ...c,
            location: c.location || { country: 'Việt Nam', version: 'new', province_code: '', district_code: '', ward_code: '', street_address: c.address || '' }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case CompanyStatus.VERIFIED: return <span className="px-3 py-1 text-xs font-bold bg-success-100 text-success-700 rounded-md">Đã duyệt</span>;
            case CompanyStatus.PENDING_VERIFICATION: return <span className="px-3 py-1 text-xs font-bold bg-warning-100 text-warning-700 rounded-md animate-pulse">Chờ duyệt</span>;
            case CompanyStatus.REJECTED: return <span className="px-3 py-1 text-xs font-bold bg-error-100 text-error-700 rounded-md">Từ chối</span>;
            case CompanyStatus.SUSPENDED: return <span className="px-3 py-1 text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-md">Tạm khóa</span>;
            default: return <span className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md">{status}</span>;
        }
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

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

            {/* HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                            Kiểm duyệt Doanh nghiệp
                            {pendingCount > 0 && (
                                <span className="bg-error-500 text-white text-xs px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                                    {pendingCount} chờ duyệt
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Xác thực KYC (Mã số thuế, Giấy phép) để bảo vệ nền tảng.</p>
                    </div>
                </div>
            </div>

            {/* BỘ LỌC (FILTER & SEARCH) */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên công ty, mã số thuế..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 transition-colors shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                    <div className="relative min-w-48 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            {Object.entries(COMPANY_STATUS_CONFIG).map(([key, config]) => {
                                if (key === 'default') return null;
                                return (
                                    <option key={key} value={key}>
                                        {config.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            </div>

            {/* ĐẾM SỐ LƯỢNG */}
            <div className="flex items-center justify-between mt-2 mb-4 px-2">
                <div className="text-sm font-medium text-slate-500">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> doanh nghiệp
                </div>
            </div>

            {/* KẾT QUẢ & BẢNG DỮ LIỆU */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-5 pl-6">Doanh nghiệp</th>
                                <th className="p-5">Mã số thuế (KYC)</th>
                                <th className="p-5">Ngày đăng ký</th>
                                <th className="p-5">Trạng thái</th>
                                <th className="p-5 pr-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {paginatedCompanies.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-5 pl-6">
                                        <div className="flex items-center gap-3">
                                            {c.logo_url ? (
                                                <img src={c.logo_url} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" referrerPolicy="no-referrer" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 shrink-0">
                                                    {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{c.name}</p>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                    {INDUSTRIES.find(i => i.value === c.industry)?.label || 'Chưa cập nhật ngành'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">{c.tax_code}</span>
                                            {c.license_file_url && (
                                                <a href={c.license_file_url} target="_blank" rel="noreferrer" className="p-1.5 bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400 rounded-lg hover:bg-info-100 transition-colors" title="Xem giấy phép kinh doanh">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm font-medium text-slate-500">
                                        {new Date(c.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-5">
                                        {getStatusBadge(c.status)}
                                        {c.status === CompanyStatus.REJECTED && c.rejection_reason && (
                                            <p className="text-[10px] text-error-500 mt-1.5 max-w-37.5 truncate font-medium" title={c.rejection_reason}>Lý do: {c.rejection_reason}</p>
                                        )}
                                    </td>
                                    <td className="p-5 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {c.status === CompanyStatus.PENDING_VERIFICATION && (
                                                <>
                                                    <button onClick={() => handleVerify(c.id, true)} className="flex items-center gap-1 px-3 py-1.5 bg-success-50 text-success-600 hover:bg-success-100 dark:bg-success-500/10 dark:text-success-400 dark:hover:bg-success-500/20 rounded-lg text-xs font-bold transition-colors shadow-sm">
                                                        <CheckCircle className="w-3 h-3" /> Duyệt
                                                    </button>
                                                    <button onClick={() => { setVerifyingId(c.id); setShowRejectModal(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-error-50 text-error-600 hover:bg-error-100 dark:bg-error-500/10 dark:text-error-400 dark:hover:bg-error-500/20 rounded-lg text-xs font-bold transition-colors shadow-sm">
                                                        <XCircle className="w-3 h-3" /> Từ chối
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => openEditModal(c)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors shadow-sm">
                                                Cấu hình
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy doanh nghiệp nào khớp với bộ lọc.</div>
                )}

                {/* THÀNH PHẦN PHÂN TRANG */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> trong số <span className="font-bold text-slate-800 dark:text-white">{filtered.length}</span> kết quả
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors shadow-sm ${currentPage === page ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL TỪ CHỐI KYC */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-error-500" /> Lý do từ chối KYC
                        </h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Mã số thuế không khớp, giấy phép giả mạo..."
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm mb-6 outline-none focus:border-error-500 font-medium shadow-inner"
                            rows={4}
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowRejectModal(false); setVerifyingId(null); }} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">Hủy</button>
                            <button onClick={() => handleVerify(verifyingId!, false)} className="px-5 py-2.5 text-sm font-bold text-white bg-error-500 hover:bg-error-600 rounded-xl shadow-lg shadow-error-500/30 transition-all">Xác nhận Từ chối</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CẤU HÌNH DOANH NGHIỆP DÀNH CHO ADMIN */}
            {editingCompany && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-primary-500" /> Cấu hình Doanh nghiệp
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mã số thuế</label>
                                <div className="flex gap-2">
                                    <input type="text" value={editingCompany.tax_code || ''} onChange={e => setEditingCompany({ ...editingCompany, tax_code: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none dark:text-white focus:border-primary-500 transition-colors" placeholder="VD: 0312..." />
                                    <button onClick={handleLookupTax} className="px-5 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold rounded-xl text-sm hover:bg-primary-200 dark:hover:bg-primary-900/50 whitespace-nowrap transition-colors">Tra cứu</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tên công ty</label>
                                <input type="text" value={editingCompany.name || ''} onChange={e => setEditingCompany({ ...editingCompany, name: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none dark:text-white focus:border-primary-500 transition-colors" placeholder="TechCorp" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ngành nghề</label>
                                <Select
                                    options={GROUPED_INDUSTRIES}
                                    styles={customSelectStyles}
                                    placeholder="Tìm ngành nghề..."
                                    noOptionsMessage={() => "Không tìm thấy"}
                                    value={INDUSTRIES.find(i => i.value === editingCompany.industry) || null}
                                    onChange={(selected: any) => setEditingCompany({ ...editingCompany, industry: selected?.value || '' })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quy mô</label>
                                <select value={editingCompany.size || ''} onChange={e => setEditingCompany({ ...editingCompany, size: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none dark:text-white focus:border-primary-500 cursor-pointer transition-colors appearance-none">
                                    <option value="">Chọn quy mô</option>
                                    {COMPANY_SIZES.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* MODULE CẤP QUYỀN TRẠNG THÁI CHO ADMIN */}
                            <div className="md:col-span-2 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                                <label className="text-xs font-black text-error-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Trạng thái Công ty (Quyền Admin)
                                </label>
                                <select
                                    value={editingCompany.status || ''}
                                    onChange={e => setEditingCompany({ ...editingCompany, status: e.target.value })}
                                    className="w-full p-3 bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/30 text-error-700 dark:text-error-400 rounded-xl text-sm font-bold outline-none focus:border-error-500 cursor-pointer transition-colors appearance-none"
                                >
                                    {Object.entries(COMPANY_STATUS_CONFIG).map(([key, config]) => {
                                        if (key === 'default') return null;
                                        return <option key={key} value={key}>{config.label}</option>;
                                    })}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="url" value={editingCompany.website || ''} onChange={e => setEditingCompany({ ...editingCompany, website: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none dark:text-white focus:border-primary-500 transition-colors" placeholder="https://..." />
                                </div>
                            </div>

                            {/* MODULE ĐỊA ĐIỂM ĐƯỢC BỨNG TỪ HR SANG */}
                            <div className="md:col-span-2 bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 mt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary-500" /> Trụ sở kinh doanh
                                    </label>
                                    {(editingCompany.location?.country || 'Việt Nam') === 'Việt Nam' && (
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                            <button type="button" onClick={() => handleVersionChange('new')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'new' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Mới (Hiện tại)</button>
                                            <button type="button" onClick={() => handleVersionChange('old')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'old' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Cũ (Trước 1/7/2025)</button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer"
                                        value={editingCompany.location?.country || 'Việt Nam'}
                                        onChange={e => setEditingCompany({ ...editingCompany, location: { ...editingCompany.location, country: e.target.value, province_code: '', district_code: '', ward_code: '' } })}
                                    >
                                        <option value="Việt Nam">Việt Nam</option>
                                        <option value="Nước ngoài">Nước ngoài</option>
                                    </select>

                                    {(editingCompany.location?.country || 'Việt Nam') === 'Việt Nam' ? (
                                        <>
                                            <select className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer" value={editingCompany.location?.province_code || ''} onChange={handleProvinceChange}>
                                                <option value="" disabled>Tỉnh/Thành phố</option>
                                                {displayedProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                            </select>

                                            {domesticVersion === 'old' && (
                                                <select className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer disabled:opacity-50" value={editingCompany.location?.district_code || ''} onChange={handleDistrictChange} disabled={!editingCompany.location?.province_code}>
                                                    <option value="" disabled>Quận/Huyện</option>
                                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                                </select>
                                            )}

                                            <select className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 cursor-pointer disabled:opacity-50" value={editingCompany.location?.ward_code || ''} onChange={handleWardChange} disabled={domesticVersion === 'new' ? !editingCompany.location?.province_code : !editingCompany.location?.district_code}>
                                                <option value="" disabled>Phường/Xã</option>
                                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                            </select>

                                            <div className="col-span-1 md:col-span-4 mt-1 relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="Số nhà, tên đường chi tiết..."
                                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm shadow-sm focus:border-primary-500 transition-colors"
                                                    value={editingCompany.location?.street_address || ''}
                                                    onChange={e => setEditingCompany({ ...editingCompany, location: { ...editingCompany.location, street_address: e.target.value } })}
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
                                                value={editingCompany.location?.street_address || ''}
                                                onChange={e => setEditingCompany({ ...editingCompany, location: { ...editingCompany.location, street_address: e.target.value } })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Giấy phép kinh doanh</label>
                                <input
                                    type="text"
                                    value={editingCompany.license_file_url || ""}
                                    onChange={(e) => setEditingCompany({ ...editingCompany, license_file_url: e.target.value })}
                                    placeholder="https://res.cloudinary.com/..."
                                    className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold outline-none focus:border-primary-500 transition-colors"
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
                                    {editingCompany.license_file_url && (
                                        <a href={editingCompany.license_file_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary-600 hover:underline mt-4 inline-block relative z-10 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-lg shadow-sm" onClick={(e) => e.stopPropagation()}>Xem file hiện tại</a>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <button onClick={() => setEditingCompany(null)} className="px-6 py-3 font-bold text-slate-500 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">Hủy</button>
                            <button
                                disabled={isSaving}
                                onClick={() => setShowConfirmSave(true)}
                                className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70"
                            >
                                <Save className="w-5 h-5" /> {isSaving ? 'Đang xử lý...' : 'Lưu cấu hình'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN LƯU CẤU HÌNH CÔNG TY */}
            {showConfirmSave && editingCompany && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-warning-500" /> Xác nhận lưu thay đổi
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn áp dụng cấu hình này cho doanh nghiệp <strong className="text-primary-600">{editingCompany.name}</strong> không?<br /><br />
                            <span className="italic text-xs text-slate-500">Lưu ý: Mọi thay đổi về Trạng thái (Khóa/Từ chối) sẽ có hiệu lực tức thì đối với tất cả nhân viên thuộc doanh nghiệp này.</span>
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowConfirmSave(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">Kiểm tra lại</button>
                            <button
                                onClick={async () => {
                                    setShowConfirmSave(false);
                                    setIsSaving(true);
                                    const payload = { ...editingCompany, address: editingCompany.location?.street_address };
                                    const success = await updateCompany(editingCompany.id, payload);
                                    if (success) setEditingCompany(null);
                                    setIsSaving(false);
                                }}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all"
                            >
                                Xác nhận Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}