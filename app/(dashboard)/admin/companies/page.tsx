'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole, CompanyStatus } from '@/types';

export default function AdminCompaniesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

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

    const filtered = companies.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.tax_code?.toLowerCase().includes(search.toLowerCase())
    );

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
        <div className="max-w-6xl mx-auto pb-20 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Kiểm duyệt Doanh nghiệp</h1>
                    <p className="text-slate-500 text-sm">Xác thực KYC (Mã số thuế, Giấy phép) để mở khóa tính năng đăng Job.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Tìm theo tên công ty, mã số thuế..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-blue-500" />
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
                                    <p className="font-bold text-sm text-slate-800 dark:text-white">{c.name}</p>
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                        {c.industry || 'Chưa cập nhật ngành'}
                                    </p>
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
                                    {c.status === CompanyStatus.PENDING_VERIFICATION && (
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleVerify(c.id, true)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors">
                                                <CheckCircle className="w-3 h-3" /> Duyệt
                                            </button>
                                            <button onClick={() => { setVerifyingId(c.id); setShowRejectModal(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors">
                                                <XCircle className="w-3 h-3" /> Từ chối
                                            </button>
                                        </div>
                                    )}
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
        </div>
    );
}