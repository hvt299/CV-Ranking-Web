'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, ExternalLink, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';

export default function AdminSupportTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/admin/support-tickets');
            if (response.data && response.data.data) {
                setTickets(response.data.data);
            } else if (Array.isArray(response.data)) {
                setTickets(response.data);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách yêu cầu hỗ trợ.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResolveTicket = async () => {
        if (!selectedTicket) return;

        setIsResolving(true);
        try {
            const payload = {
                status: updateStatus || selectedTicket.status,
                admin_notes: adminNotes,
                reply_message: replyMessage
            };

            await apiClient.patch(`/admin/support-tickets/${selectedTicket.id || selectedTicket._id}/resolve`, payload);
            toast.success('Đã cập nhật yêu cầu hỗ trợ.');

            fetchTickets();
            setSelectedTicket(null);
        } catch (error) {
            toast.error('Cập nhật yêu cầu thất bại.');
        } finally {
            setIsResolving(false);
        }
    };

    const openTicketModal = (ticket: any) => {
        setSelectedTicket(ticket);
        setReplyMessage('');
        setAdminNotes(ticket.admin_notes || '');
        setUpdateStatus(ticket.status);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN': return <span className="px-2.5 py-1 text-xs font-bold bg-error-100 text-error-700 rounded-md">Mới</span>;
            case 'IN_PROGRESS': return <span className="px-2.5 py-1 text-xs font-bold bg-primary-100 text-primary-700 rounded-md">Đang xử lý</span>;
            case 'WAITING_FOR_USER': return <span className="px-2.5 py-1 text-xs font-bold bg-warning-100 text-warning-700 rounded-md">Chờ KH phản hồi</span>;
            case 'RESOLVED': return <span className="px-2.5 py-1 text-xs font-bold bg-success-100 text-success-700 rounded-md">Đã giải quyết</span>;
            case 'CLOSED': return <span className="px-2.5 py-1 text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-md">Đã đóng</span>;
            default: return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md">{status}</span>;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'tech_bug': return 'Kỹ thuật / Lỗi';
            case 'billing': return 'Thanh toán';
            case 'kyc': return 'Xác thực KYC';
            case 'other': return 'Khác';
            default: return category;
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchSearch =
            (t.ticket_number && t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;

        return matchSearch && matchStatus && matchCategory;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-primary-500" />
                        Hỗ trợ Người dùng
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý và phản hồi yêu cầu từ người dùng.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã ticket, email, chủ đề..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 shrink-0">
                    <div className="relative min-w-40">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none shadow-sm cursor-pointer"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">Tất cả chủ đề</option>
                            <option value="tech_bug">Kỹ thuật</option>
                            <option value="billing">Thanh toán</option>
                            <option value="kyc">KYC</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div className="relative min-w-40">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none shadow-sm cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="OPEN">Mới</option>
                            <option value="IN_PROGRESS">Đang xử lý</option>
                            <option value="WAITING_FOR_USER">Chờ phản hồi</option>
                            <option value="RESOLVED">Đã giải quyết</option>
                            <option value="CLOSED">Đã đóng</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-5 pl-6">Mã / Người gửi</th>
                                    <th className="p-5">Chủ đề</th>
                                    <th className="p-5">Ngày gửi</th>
                                    <th className="p-5">Trạng thái</th>
                                    <th className="p-5 pr-6 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredTickets.length > 0 ? filteredTickets.map((t) => (
                                    <tr key={t.id || t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => openTicketModal(t)}>
                                        <td className="p-5 pl-6">
                                            <p className="font-bold text-sm text-primary-600 dark:text-primary-400">#{t.ticket_number}</p>
                                            <p className="text-xs text-slate-800 dark:text-white font-medium mt-1">{t.full_name}</p>
                                            <p className="text-[11px] text-slate-500">{t.email}</p>
                                        </td>
                                        <td className="p-5 max-w-75">
                                            <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded mb-1">
                                                {getCategoryLabel(t.category)}
                                            </span>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate" title={t.subject}>{t.subject}</p>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-slate-500">
                                            {new Date(t.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td className="p-5">
                                            {getStatusBadge(t.status)}
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <button
                                                className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors"
                                                onClick={(e) => { e.stopPropagation(); openTicketModal(t); }}
                                            >
                                                Xem & Phản hồi
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-slate-400 text-sm font-medium">
                                            Không có yêu cầu hỗ trợ nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT TICKET */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden" onClick={(e) => e.stopPropagation()}>

                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white">
                                        #{selectedTicket.ticket_number} - {selectedTicket.subject}
                                    </h3>
                                    {getStatusBadge(selectedTicket.status)}
                                </div>
                                <p className="text-sm text-slate-500">
                                    Từ: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedTicket.full_name}</span> ({selectedTicket.email}) • {new Date(selectedTicket.created_at).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2">
                                <span className="sr-only">Đóng</span>
                                &times;
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-primary-500" /> Nội dung yêu cầu
                                    </h4>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                {selectedTicket.last_replied_at && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Đã phản hồi lần cuối: {new Date(selectedTicket.last_replied_at).toLocaleString('vi-VN')}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <div>
                                    <label className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                        Ghi chú nội bộ
                                    </label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Ghi chú nội bộ (Khách hàng không thấy)..."
                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 shadow-sm"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                        Phản hồi qua Email
                                    </label>
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Nhập nội dung email sẽ gửi cho khách hàng (Để trống nếu không gửi mail)..."
                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 shadow-sm"
                                        rows={5}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                        Cập nhật trạng thái
                                    </label>
                                    <select
                                        value={updateStatus}
                                        onChange={(e) => setUpdateStatus(e.target.value)}
                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:border-primary-500 shadow-sm cursor-pointer"
                                    >
                                        <option value="OPEN">Mới (Open)</option>
                                        <option value="IN_PROGRESS">Đang xử lý (In Progress)</option>
                                        <option value="WAITING_FOR_USER">Chờ KH phản hồi (Waiting for User)</option>
                                        <option value="RESOLVED">Đã giải quyết (Resolved)</option>
                                        <option value="CLOSED">Đã đóng (Closed)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button onClick={() => setSelectedTicket(null)} className="px-6 py-2.5 font-bold text-slate-500 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                Hủy
                            </button>
                            <button
                                disabled={isResolving}
                                onClick={handleResolveTicket}
                                className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 flex items-center gap-2 shadow-md shadow-primary-500/20 transition-all disabled:opacity-70"
                            >
                                <Send className="w-4 h-4" /> {isResolving ? 'Đang cập nhật...' : 'Cập nhật & Phản hồi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
