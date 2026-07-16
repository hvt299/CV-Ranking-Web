'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, CheckCircle, XCircle, AlertCircle, ExternalLink, Save, Briefcase } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole, CompanyStatus } from '@/types';
import Select from 'react-select';

const INDUSTRIES = [
    { label: 'Kinh doanh/Bán hàng', value: 'sales' },
    { label: 'Marketing/PR/Quảng cáo', value: 'marketing' },
    { label: 'Chăm sóc khách hàng/Vận hành', value: 'customer_service' },
    { label: 'Nhân sự/Hành chính/Pháp chế', value: 'hr_admin_legal' },
    { label: 'Công nghệ Thông tin', value: 'it' },
    { label: 'Lao động phổ thông', value: 'labor' },
    { label: 'Tài chính/Ngân hàng/Bảo hiểm', value: 'finance' },
    { label: 'Bất động sản', value: 'realestate' },
    { label: 'Xây dựng', value: 'construction' },
    { label: 'Kế toán/Kiểm toán/Thuế', value: 'accounting' },
    { label: 'Sản xuất', value: 'manufacturing' },
    { label: 'Giáo dục/Đào tạo', value: 'education' },
    { label: 'Bán lẻ/Dịch vụ đời sống', value: 'retail_lifestyle' },
    { label: 'Phim/Truyền hình/Báo chí/Xuất bản', value: 'media_publishing' },
    { label: 'Điện/Điện tử/Viễn thông', value: 'electronics_telecom' },
    { label: 'Logistics/Thu mua/Kho/Vận tải', value: 'logistics' },
    { label: 'Tư vấn chuyên môn', value: 'consulting' },
    { label: 'Dược/Y tế/Sức khoẻ/Công nghệ sinh học', value: 'healthcare' },
    { label: 'Thiết kế', value: 'design' },
    { label: 'Nhà hàng/Khách sạn/Du lịch', value: 'hospitality' },
    { label: 'Năng lượng/Môi trường/Nông nghiệp', value: 'energy_agriculture' },
    { label: 'Tài xế', value: 'driver' },
    { label: 'Biên phiên dịch', value: 'translation' },
    { label: 'Luật', value: 'law' },
    { label: 'Nhóm nghề khác', value: 'other' }
];

export default function AdminCompaniesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const [editingCompany, setEditingCompany] = useState<any | null>(null);
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
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditingCompany({ ...editingCompany, license_file_url: res.data.file_url || res.data.url });
            toast.success('Tải giấy phép lên thành công!');
        } catch (error) {
            toast.error('Lỗi khi tải file lên');
        } finally {
            setIsUploadingLicense(false);
        }
    };

    useEffect(() => {
        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
            borderColor: state.isFocused ? '#3b82f6' : (isDarkMode ? '#334155' : '#e2e8f0'),
            borderRadius: '0.75rem',
            minHeight: '42px',
            padding: '0 4px',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            fontSize: '0.875rem',
        }),
        menu: (base: any) => ({
            ...base, zIndex: 9999, backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', fontSize: '0.875rem'
        }),
        option: (base: any, state: any) => ({
            ...base, cursor: 'pointer',
            backgroundColor: state.isFocused ? (isDarkMode ? '#334155' : '#eff6ff') : 'transparent',
            color: isDarkMode ? '#e2e8f0' : '#334155'
        }),
        singleValue: (base: any) => ({ ...base, color: isDarkMode ? '#e2e8f0' : '#334155' }),
        input: (base: any) => ({ ...base, color: isDarkMode ? '#e2e8f0' : '#334155' }),
    };

    useEffect(() => {
        if (user && user.role !== UserRole.ADMIN) {
            toast.error('Bạn không có quyền truy cập trang này');
            router.push('/dashboard');
            return;
        }
        fetchCompanies();
    }, [user, router]);

    const fetchCompanies = () => {
        api.get('/admin/companies')
            .then(res => setCompanies(res.data))
            .catch(() => toast.error('Không thể tải danh sách công ty'))
            .finally(() => setIsLoading(false));
    };

    const handleVerify = async (companyId: string, approve: boolean) => {
        if (!approve && !rejectionReason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối!');
            return;
        }

        try {
            await api.patch(`/admin/companies/${companyId}/verify`, {
                approve,
                rejection_reason: approve ? null : rejectionReason
            });
            toast.success(approve ? 'Đã duyệt công ty thành công' : 'Đã từ chối công ty');
            setShowRejectModal(false);
            setRejectionReason('');
            setVerifyingId(null);
            fetchCompanies();
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Lỗi khi xử lý');
        }
    };

    const filtered = companies.filter(c => {
        const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.tax_code?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const pendingCount = companies.filter(c => c.status === CompanyStatus.PENDING_VERIFICATION).length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case CompanyStatus.VERIFIED: return <span className="px-2 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-700 rounded-md">Đã duyệt</span>;
            case CompanyStatus.PENDING_VERIFICATION: return <span className="px-2 py-1 text-[11px] font-bold bg-amber-100 text-amber-700 rounded-md">Chờ duyệt</span>;
            case CompanyStatus.REJECTED: return <span className="px-2 py-1 text-[11px] font-bold bg-rose-100 text-rose-700 rounded-md">Từ chối</span>;
            default: return <span className="px-2 py-1 text-[11px] font-bold bg-slate-100 text-slate-700 rounded-md">{status}</span>;
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-6 px-4 xl:px-0">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                            Kiểm duyệt Doanh nghiệp
                            {pendingCount > 0 && (
                                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                    {pendingCount} chờ duyệt
                                </span>
                            )}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Xác thực KYC (Mã số thuế, Giấy phép) để mở khóa tính năng đăng Job.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Tìm theo tên công ty, mã số thuế..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-blue-500 dark:text-white" />
                </div>
                <div className="sm:w-48 shrink-0">
                    <select
                        className="w-full p-2.5 pl-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium focus:border-blue-500 dark:text-white cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">Tất cả trạng thái</option>
                        <option value={CompanyStatus.PENDING_VERIFICATION}>Chờ duyệt</option>
                        <option value={CompanyStatus.VERIFIED}>Đã duyệt</option>
                        <option value={CompanyStatus.REJECTED}>Từ chối</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 pl-6">Doanh nghiệp</th>
                            <th className="p-4">Mã số thuế (KYC)</th>
                            <th className="p-4">Ngày đăng ký</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 pr-6 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filtered.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shrink-0">
                                            {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{c.name}</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                {INDUSTRIES.find(i => i.value === c.industry)?.label || 'Chưa cập nhật ngành'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-semibold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-700 dark:text-slate-300">{c.tax_code}</span>
                                        {c.license_file_url && (
                                            <a href={c.license_file_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600" title="Xem giấy phép kinh doanh">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-xs font-medium text-slate-500">
                                    {new Date(c.created_at).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(c.status)}
                                    {c.status === CompanyStatus.REJECTED && c.rejection_reason && (
                                        <p className="text-[10px] text-rose-500 mt-1 max-w-37.5 truncate" title={c.rejection_reason}>Lý do: {c.rejection_reason}</p>
                                    )}
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {c.status === CompanyStatus.PENDING_VERIFICATION && (
                                            <>
                                                <button onClick={() => handleVerify(c.id, true)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors">
                                                    <CheckCircle className="w-3 h-3" /> Duyệt
                                                </button>
                                                <button onClick={() => { setVerifyingId(c.id); setShowRejectModal(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors">
                                                    <XCircle className="w-3 h-3" /> Từ chối
                                                </button>
                                            </>
                                        )}
                                        <button onClick={() => setEditingCompany(c)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-xs font-bold transition-colors">
                                            Chi tiết / Sửa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">Không có dữ liệu doanh nghiệp.</div>}
            </div>

            {/* MODAL TỪ CHỐI */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-rose-500" /> Lý do từ chối KYC
                        </h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Mã số thuế không khớp, giấy phép giả mạo..."
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm mb-4 outline-none focus:border-rose-500"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => { setShowRejectModal(false); setVerifyingId(null); }} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl">Hủy</button>
                            <button onClick={() => handleVerify(verifyingId!, false)} className="px-4 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl">Xác nhận Từ chối</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT & SỬA CÔNG TY CHO ADMIN */}
            {editingCompany && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Chi tiết Doanh nghiệp</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Mã số thuế</label>
                                <input type="text" value={editingCompany.tax_code || ''} onChange={e => setEditingCompany({ ...editingCompany, tax_code: e.target.value })} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white focus:border-blue-500" placeholder="VD: 0312..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Tên công ty</label>
                                <input type="text" value={editingCompany.name || ''} onChange={e => setEditingCompany({ ...editingCompany, name: e.target.value })} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white focus:border-blue-500" placeholder="TechCorp" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Ngành nghề</label>
                                <Select
                                    options={INDUSTRIES}
                                    styles={customSelectStyles}
                                    placeholder="Tìm ngành nghề..."
                                    noOptionsMessage={() => "Không tìm thấy"}
                                    value={INDUSTRIES.find(i => i.value === editingCompany.industry) || null}
                                    onChange={(selected: any) => setEditingCompany({ ...editingCompany, industry: selected?.value || '' })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Quy mô</label>
                                <select value={editingCompany.size || ''} onChange={e => setEditingCompany({ ...editingCompany, size: e.target.value })} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white focus:border-blue-500 cursor-pointer">
                                    <option value="">Chọn quy mô</option>
                                    <option value="1-50">1-50 nhân sự</option>
                                    <option value="51-200">51-200 nhân sự</option>
                                    <option value="201-1000">201-1000 nhân sự</option>
                                    <option value="1000+">Hơn 1000 nhân sự</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Website</label>
                                <input type="url" value={editingCompany.website || ''} onChange={e => setEditingCompany({ ...editingCompany, website: e.target.value })} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white focus:border-blue-500" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Địa chỉ</label>
                                <input type="text" value={editingCompany.address || ''} onChange={e => setEditingCompany({ ...editingCompany, address: e.target.value })} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white focus:border-blue-500" placeholder="Địa chỉ đăng ký kinh doanh" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2">
                                    Giấy phép kinh doanh
                                </label>

                                {/* Link */}
                                <input
                                    type="text"
                                    value={editingCompany.license_file_url || ""}
                                    onChange={(e) =>
                                        setEditingCompany({
                                            ...editingCompany,
                                            license_file_url: e.target.value,
                                        })
                                    }
                                    placeholder="https://res.cloudinary.com/..."
                                    className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500 dark:text-white"
                                />

                                {/* Upload */}
                                <label
                                    className={`group flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 ${isUploadingLicense ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                                        }`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();

                                        if (isUploadingLicense) return;

                                        const file = e.dataTransfer.files?.[0];
                                        if (!file) return;

                                        const input = document.createElement("input");
                                        input.type = "file";
                                    }}
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={handleLicenseUpload}
                                        disabled={isUploadingLicense}
                                    />

                                    <Briefcase className="w-11 h-11 text-blue-500 mb-4" />

                                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                                        {isUploadingLicense ? "Đang tải lên..." : "Kéo & thả file vào đây"}
                                    </p>

                                    {!isUploadingLicense && (
                                        <>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                hoặc <span className="text-blue-600 font-semibold">bấm để chọn file</span>
                                            </p>

                                            <p className="mt-2 text-xs text-slate-400">
                                                PDF, JPG, PNG • Tối đa 10MB
                                            </p>
                                        </>
                                    )}

                                    {editingCompany.license_file_url && (
                                        <div className="mt-5 flex items-center gap-3">
                                           <a
                                                href={editingCompany.license_file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Xem file
                                            </a>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button onClick={() => setEditingCompany(null)} className="px-5 py-2.5 font-bold text-slate-500 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">Hủy</button>
                            <button disabled={isSaving} onClick={async () => {
                                setIsSaving(true);
                                try {
                                    await api.patch(`/admin/companies/${editingCompany.id}`, editingCompany);
                                    toast.success("Cập nhật thông tin thành công!");
                                    setEditingCompany(null);
                                    fetchCompanies();
                                } catch (e) {
                                    toast.error("Lỗi cập nhật!");
                                } finally {
                                    setIsSaving(false);
                                }
                            }} className="px-6 py-2.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-all flex items-center gap-2">
                                <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}