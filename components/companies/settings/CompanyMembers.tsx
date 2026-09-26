'use client';

import { useState, useEffect } from 'react';
import { Mail, Loader2, UserCog, UserMinus, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';
import { companyService } from '@/features/company/company.service';

export default function CompanyMembers({ user, companyId }: { user: any, companyId: string }) {
    const [members, setMembers] = useState<any[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    
    // For actions
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const loadMembers = () => {
        companyService.getMembers().then(res => {
            const memData = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
            setMembers(memData);
            setIsLoading(false);
        }).catch(() => {
            toast.error("Lỗi khi tải danh sách nhân sự");
            setIsLoading(false);
        });
    }

    useEffect(() => {
        loadMembers();
    }, [companyId]);

    const handleInviteMember = async () => {
        if (!inviteEmail.trim()) return toast.error("Vui lòng nhập Email");
        setIsInviting(true);
        try {
            await companyService.inviteMember(inviteEmail);
            toast.success("Đã gửi thư mời gia nhập công ty thành công!");
            setInviteEmail('');
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Không thể gửi thư mời");
        } finally {
            setIsInviting(false);
        }
    };

    const handleChangeRole = async (memberId: string, currentRole: string) => {
        const newRole = currentRole === UserRole.HR_OWNER ? UserRole.HR_MEMBER : UserRole.HR_OWNER;
        if (!window.confirm(`Xác nhận đổi quyền của thành viên này thành ${newRole}?`)) return;
        
        setLoadingAction(`role-${memberId}`);
        try {
            await companyService.updateMemberRole(memberId, newRole);
            toast.success("Cập nhật quyền thành công");
            loadMembers();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Lỗi khi cập nhật quyền");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi công ty? Họ sẽ không thể truy cập vào dữ liệu công ty nữa.")) return;
        
        setLoadingAction(`remove-${memberId}`);
        try {
            await companyService.removeMember(memberId);
            toast.success("Đã xóa thành viên khỏi công ty");
            loadMembers();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Lỗi khi xóa thành viên");
        } finally {
            setLoadingAction(null);
        }
    };

    if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in">
            {user.role === UserRole.HR_OWNER && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-black mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Mail className="w-5 h-5 text-primary-500" /> Mời thành viên mới (HR Member)
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="Nhập email nhân viên..."
                            className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500 transition-colors"
                        />
                        <button
                            onClick={handleInviteMember}
                            disabled={isInviting}
                            className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all flex justify-center items-center disabled:opacity-70"
                        >
                            {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gửi lời mời'}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-5 pl-6">Thành viên</th>
                            <th className="p-5">Quyền hạn</th>
                            <th className="p-5">Trạng thái</th>
                            {user.role === UserRole.HR_OWNER && <th className="p-5 text-right pr-6">Thao tác</th>}
                        </tr>
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
                                            <p className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">{m.full_name} {m.id === user.id && '(Bạn)'}</p>
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
                                {user.role === UserRole.HR_OWNER && (
                                    <td className="p-5 pr-6 text-right">
                                        {m.id !== user.id && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleChangeRole(m.id, m.role)}
                                                    disabled={loadingAction === `role-${m.id}`}
                                                    title={m.role === UserRole.HR_OWNER ? 'Giáng quyền xuống Member' : 'Nâng cấp lên Owner'}
                                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {loadingAction === `role-${m.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCog className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveMember(m.id)}
                                                    disabled={loadingAction === `remove-${m.id}`}
                                                    title="Xóa khỏi công ty"
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {loadingAction === `remove-${m.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}