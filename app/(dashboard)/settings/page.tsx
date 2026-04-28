'use client';

import { useState, useEffect } from 'react';
import { Shield, Search } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ROLES = [
    { value: 'applicant', label: 'Ứng viên', color: 'bg-slate-100 text-slate-700' },
    { value: 'hr', label: 'HR', color: 'bg-blue-100 text-blue-700' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700' },
];

export default function AdminSettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            toast.error('Bạn không có quyền truy cập trang này');
            router.push('/dashboard');
            return;
        }
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(() => toast.error('Không thể tải danh sách người dùng'))
            .finally(() => setIsLoading(false));
    }, [user, router]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        try {
            await api.patch(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success('Đã cập nhật role thành công');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Lỗi khi cập nhật role');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Cài đặt hệ thống</h1>
                    <p className="text-slate-500 text-sm">Quản lý người dùng và phân quyền</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo email hoặc tên..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 pl-6">Người dùng</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Ngày tạo</th>
                            <th className="p-4 pr-6 text-right">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filtered.map(u => {
                            const roleConfig = ROLES.find(r => r.value === u.role) || ROLES[0];
                            return (
                                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            {u.avatar ? (
                                                <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 uppercase">
                                                    {u.full_name?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800 dark:text-white">{u.full_name}</p>
                                                <p className="text-xs text-slate-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${u.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {u.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <select
                                            value={u.role || 'applicant'}
                                            disabled={updatingId === u.id || u.email === user?.email}
                                            onChange={e => handleRoleChange(u.id, e.target.value)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border-none shadow-sm ${roleConfig.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {ROLES.map(r => (
                                                <option key={r.value} value={r.value}>{r.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">Không tìm thấy người dùng nào</div>
                )}
            </div>
        </div>
    );
}
