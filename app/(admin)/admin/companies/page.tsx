'use client';

import { useState, useEffect } from 'react';
import {
    Building2, Search, CheckCircle, XCircle, AlertCircle,
    ExternalLink, Save, Briefcase, Filter, MapPin, Globe,
    ChevronLeft, ChevronRight, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CompanyStatus } from '@/types';
import Select from 'react-select';
import { INDUSTRIES, GROUPED_INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES, COMPANY_STATUS_CONFIG } from '@/constants/company.constants';
import { companyService } from '@/features/company/company.service';
import { systemService, LocationUnit } from '@/features/system/system.service';
import { useAdminCompanies } from '@/features/company/useCompany';

import CompanyBrandAssets from '@/components/companies/settings/CompanyBrandAssets';
import CompanyBasicInfo from '@/components/companies/settings/CompanyBasicInfo';
import CompanyLocation from '@/components/companies/settings/CompanyLocation';
import CompanyCulture from '@/components/companies/settings/CompanyCulture';
import CompanyGallery from '@/components/companies/settings/CompanyGallery';
import CompanyLegal from '@/components/companies/settings/CompanyLegal';

export default function AdminCompaniesPage() {
    const { companies, isLoading, verifyCompany, updateCompany } = useAdminCompanies();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const [editingCompany, setEditingCompany] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

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
        multiValue: (base: any) => ({ ...base, backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '0.5rem' }),
        multiValueLabel: (base: any) => ({ ...base, color: isDarkMode ? '#f8fafc' : '#1e293b', fontWeight: 'bold' }),
        multiValueRemove: (base: any) => ({ ...base, ':hover': { backgroundColor: '#ef4444', color: 'white', borderRadius: '0 0.5rem 0.5rem 0' } }),
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
                            {paginatedCompanies.map((c, index) => (
                                <tr 
                                    key={c.id} 
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="p-5 pl-6">
                                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                            {c.logo_url ? (
                                                <img src={c.logo_url} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" referrerPolicy="no-referrer" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 shrink-0">
                                                    {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{c.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                                                        {c.industries && c.industries.length > 0 
                                                            ? INDUSTRIES.find(i => i.value === c.industries[0])?.label 
                                                            : 'Chưa cập nhật ngành'}
                                                    </p>
                                                    {c.industries && c.industries.length > 1 && (
                                                        <span 
                                                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-md cursor-help border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                                                            title={c.industries.slice(1).map((val: string) => INDUSTRIES.find(i => i.value === val)?.label).filter(Boolean).join(', ')}
                                                        >
                                                            +{c.industries.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                            <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">{c.tax_code}</span>
                                            {c.license_file_url && (
                                                <a href={c.license_file_url} target="_blank" rel="noreferrer" className="p-1.5 bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400 rounded-lg hover:bg-info-100 transition-colors" title="Xem giấy phép kinh doanh">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm font-medium text-slate-500">
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                            {new Date(c.created_at).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                            {getStatusBadge(c.status)}
                                        {c.status === CompanyStatus.REJECTED && c.rejection_reason && (
                                            <p className="text-[10px] text-error-500 mt-1.5 max-w-37.5 truncate font-medium" title={c.rejection_reason}>Lý do: {c.rejection_reason}</p>
                                        )}
                                        </div>
                                    </td>
                                    <td className="p-5 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
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
                                {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)} 
                                        disabled={page === '...'}
                                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${page !== '...' ? 'shadow-sm' : ''} ${currentPage === page ? 'bg-primary-600 text-white' : page === '...' ? 'text-slate-400 bg-transparent cursor-default' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
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
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-primary-500" /> Cấu hình Doanh nghiệp
                            </h2>
                            <button onClick={() => setEditingCompany(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

                        {/* ADMIN CONTROL BLOCK */}
                        <div className="bg-error-50/50 dark:bg-error-500/5 p-5 rounded-2xl border border-error-200/50 dark:border-error-500/20 mb-6">
                            <label className="text-xs font-black text-error-600 dark:text-error-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Trạng thái Công ty (Quyền Admin)
                            </label>
                            <select
                                value={editingCompany.status || ''}
                                onChange={e => setEditingCompany({ ...editingCompany, status: e.target.value })}
                                className="w-full p-3 bg-white dark:bg-slate-900 border border-error-200 dark:border-error-500/30 text-error-700 dark:text-error-400 rounded-xl text-sm font-bold outline-none focus:border-error-500 cursor-pointer shadow-sm appearance-none"
                            >
                                {Object.entries(COMPANY_STATUS_CONFIG).map(([key, config]) => {
                                    if (key === 'default') return null;
                                    return <option key={key} value={key}>{config.label}</option>;
                                })}
                            </select>
                        </div>

                        <CompanyBrandAssets company={editingCompany} setCompany={setEditingCompany} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <CompanyBasicInfo company={editingCompany} setCompany={setEditingCompany} />
                            <CompanyLocation company={editingCompany} setCompany={setEditingCompany} />
                            <CompanyCulture company={editingCompany} setCompany={setEditingCompany} />
                            <CompanyGallery company={editingCompany} setCompany={setEditingCompany} />
                            <CompanyLegal company={editingCompany} setCompany={setEditingCompany} />
                        </div>

                        </div>
                        
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                            <button onClick={() => setEditingCompany(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Hủy bỏ</button>
                            <button
                                disabled={isSaving}
                                onClick={() => setShowConfirmSave(true)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30"
                            >
                                <Save className="w-4 h-4" /> {isSaving ? 'Đang xử lý...' : 'Lưu thay đổi'}
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