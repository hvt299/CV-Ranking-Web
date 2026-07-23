'use client';

import { useState, useEffect } from 'react';
import { Shield, Search, Building2, Users, Save, CheckCircle, Mail, Briefcase, ExternalLink, Globe, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole, CompanyStatus } from '@/types';
import Select from 'react-select';
import { INDUSTRIES } from '@/constants/job.constants';
import { ROLES } from '@/constants/user.constants';
import { companyService } from '@/features/company/company.service';

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) return null;

    if (user.role === UserRole.ADMIN) {
        return <AdminSettingsSection user={user} />;
    }

    if (user.role === UserRole.HR_OWNER || user.role === UserRole.HR_MEMBER) {
        return <CompanySettingsSection user={user} />;
    }

    router.push('/apply');
    return null;
}

function CompanySettingsSection({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState('info');
    const [company, setCompany] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);

    const [taxCode, setTaxCode] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(false);

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
        companyService.getSettings().then(res => {
            setCompany(res.data);
            setTaxCode(res.data.tax_code || '');
        }).catch(err => console.error(err));

        companyService.getMembers().then(res => {
            setMembers(res.data);
        }).catch(err => console.error(err));
    }, []);

    const handleLookupTax = async () => {
        if (!taxCode.trim()) return toast.error("Vui lòng nhập mã số thuế");
        try {
            const res = await companyService.lookupTax(taxCode)
            setCompany((prev: any) => ({
                ...prev,
                name: res.data.company_name,
                address: res.data.address
            }));
            toast.success("Đã tìm thấy thông tin công ty từ VietQR!");
        } catch (e) {
            toast.error("Không tìm thấy dữ liệu từ Mã số thuế này");
        }
    };

    const handleSaveCompany = async () => {
        setIsSaving(true);
        try {
            await companyService.updateSettings({
                tax_code: taxCode,
                name: company.name,
                industry: company.industry,
                size: company.size,
                website: company.website,
                address: company.address,
                license_file_url: company.license_file_url
            });
            toast.success("Đã cập nhật thông tin công ty. Nếu đổi MST, vui lòng đợi Admin duyệt lại.");
            const res = await companyService.getSettings()
            setCompany(res.data);
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
        <div className="max-w-5xl mx-auto pb-20 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Hồ sơ Doanh nghiệp</h1>
                    <p className="text-slate-500 text-sm">Quản lý KYC, Giấy phép và Đội ngũ Nhân sự</p>
                </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                <button onClick={() => setActiveTab('info')}
                    className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'info'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}>
                    Xác minh KYC
                </button>
                <button onClick={() => setActiveTab('members')}
                    className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'members'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}>
                    Đội ngũ Nhân sự
                </button>
            </div>

            {
                activeTab === 'info' && company && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Trạng thái Xác minh Doanh nghiệp (KYC)</p>
                                <p className="text-xs text-slate-500">Chỉ công ty Đã duyệt mới được phép xuất bản chiến dịch Job.</p>
                            </div>
                            {company.status === CompanyStatus.VERIFIED ? (
                                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Đã xác minh</span>
                            ) : company.status === CompanyStatus.PENDING_VERIFICATION ? (
                                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold flex items-center gap-1">⏳ Đang chờ duyệt</span>
                            ) : (
                                <span className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-sm font-bold flex items-center gap-1">❌ Bị từ chối</span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Mã số thuế (MST) <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <input type="text" value={taxCode} onChange={e => setTaxCode(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500" placeholder="VD: 0312345678" />
                                    <button onClick={handleLookupTax} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold rounded-xl text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 whitespace-nowrap">Tra cứu</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Tên Công ty</label>
                                <input type="text" value={company.name || ''} onChange={e => setCompany({ ...company, name: e.target.value })} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500" placeholder="Ví dụ: Công ty TNHH Công nghệ ABC" />
                            </div>

                            {/* SMART DROPDOWN NGÀNH NGHỀ */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Ngành nghề</label>
                                <Select
                                    options={INDUSTRIES}
                                    styles={customSelectStyles}
                                    placeholder="Tìm ngành nghề..."
                                    noOptionsMessage={() => "Không tìm thấy"}
                                    value={INDUSTRIES.find(i => i.value === company.industry) || null}
                                    onChange={(selected: any) => setCompany({ ...company, industry: selected?.value || '' })}
                                />
                            </div>

                            {/* DROPDOWN QUY MÔ ĐỒNG BỘ */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Quy mô nhân sự</label>
                                <select value={company.size || ''} onChange={e => setCompany({ ...company, size: e.target.value })} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 cursor-pointer">
                                    <option value="">Chọn quy mô</option>
                                    <option value="1-50">1-50 nhân sự</option>
                                    <option value="51-200">51-200 nhân sự</option>
                                    <option value="201-1000">201-1000 nhân sự</option>
                                    <option value="1000+">Hơn 1000 nhân sự</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Website (Tùy chọn)</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input type="url" value={company.website || ''} onChange={e => setCompany({ ...company, website: e.target.value })} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500" placeholder="https://www.company-website.com" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2">Địa chỉ Đăng ký kinh doanh</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input type="text" value={company.address || ''} onChange={e => setCompany({ ...company, address: e.target.value })} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500" placeholder="Ví dụ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2">
                                    Giấy phép kinh doanh
                                </label>

                                {/* Link */}
                                <input
                                    type="text"
                                    value={company.license_file_url || ""}
                                    onChange={(e) =>
                                        setCompany({
                                            ...company,
                                            license_file_url: e.target.value,
                                        })
                                    }
                                    placeholder="https://res.cloudinary.com/..."
                                    className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-blue-500 dark:text-white"
                                />

                                {/* Upload */}
                                <label
                                    className="group flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();

                                        const file = e.dataTransfer.files?.[0];
                                        if (!file) return;

                                        setCompany({
                                            ...company,
                                            license_file_url: file.name,
                                        });
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setCompany({
                                                ...company,
                                                license_file_url: file.name,
                                            });
                                        }}
                                    />

                                    <Briefcase className="w-11 h-11 text-blue-500 mb-4" />

                                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                                        Kéo & thả file vào đây
                                    </p>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        hoặc <span className="text-blue-600 font-semibold">bấm để chọn file</span>
                                    </p>

                                    <p className="mt-2 text-xs text-slate-400">
                                        PDF, JPG, PNG • Tối đa 10MB
                                    </p>

                                    <a
                                        href={company.license_file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Xem file
                                    </a>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                            {user.role === UserRole.HR_OWNER && (
                                <button onClick={handleSaveCompany} disabled={isSaving} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2">
                                    <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            )}
                        </div>
                    </div>
                )
            }

            {
                activeTab === 'members' && (
                    <div className="space-y-6">
                        {user.role === UserRole.HR_OWNER && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-indigo-500" /> Mời thành viên mới (HR Member)</h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Nhập email nhân viên..." className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" />
                                    <button onClick={handleInviteMember} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Gửi lời mời</button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                                    <tr><th className="p-4 pl-6">Thành viên</th><th className="p-4">Quyền hạn</th><th className="p-4">Trạng thái</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {members.map(m => (
                                        <tr key={m.id}>
                                            <td className="p-4 pl-6">
                                                <p className="font-bold text-sm text-slate-800 dark:text-white">{m.full_name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-[11px] font-bold rounded-md ${m.role === UserRole.HR_OWNER ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>{m.role.toUpperCase()}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-[11px] font-bold rounded-md ${m.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{m.is_verified ? 'Hoạt động' : 'Chưa kích hoạt'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

function AdminSettingsSection({ user }: { user: any }) {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        companyService.getAdminUsers()
            .then(res => setUsers(res.data))
            .catch(() => toast.error('Không thể tải danh sách người dùng'))
            .finally(() => setIsLoading(false));
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        try {
            await companyService.updateUserRole(userId, newRole)
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success('Đã cập nhật role thành công');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Lỗi khi cập nhật role');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()));

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" /></div>;

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Phân quyền Hệ thống</h1>
                    <p className="text-slate-500 text-sm">Quản lý người dùng cấp cao</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Tìm theo email hoặc tên..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-purple-500" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr><th className="p-4 pl-6">Người dùng</th><th className="p-4">Trạng thái</th><th className="p-4">Ngày tạo</th><th className="p-4 pr-6 text-right">Role</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filtered.map(u => {
                            const roleConfig = ROLES.find(r => r.value === u.role) || ROLES[0];
                            return (
                                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            {u.avatar ? <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 uppercase">{u.full_name?.charAt(0)}</div>}
                                            <div><p className="font-semibold text-sm text-slate-800 dark:text-white">{u.full_name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                                        </div>
                                    </td>
                                    <td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-lg ${u.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{u.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}</span></td>
                                    <td className="p-4 text-sm text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}</td>
                                    <td className="p-4 pr-6 text-right">
                                        <select value={u.role || UserRole.APPLICANT} disabled={updatingId === u.id || u.email === user?.email} onChange={e => handleRoleChange(u.id, e.target.value)} className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border-none shadow-sm ${roleConfig.color} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}