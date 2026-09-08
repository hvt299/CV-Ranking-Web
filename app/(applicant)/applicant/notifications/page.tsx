'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Trash2, Clock, Briefcase, ChevronLeft, ChevronRight, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { Notification, NotificationReadStatus, ApplicationStatus, NotificationType, UserRole } from '@/types';
import { applicationService } from '@/features/application/application.service';
import { NOTIFICATION_CONFIG, APPLICATION_STATUS_CONFIG } from "@/constants/application.constants";

export default function NotificationsPage() {
    const { user, isAuthenticated, loading } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const isApplicant = user?.role === UserRole.APPLICANT;

    useEffect(() => {
        if (!isAuthenticated || !isApplicant) {
            setIsLoading(false);
            return;
        }
        applicationService.getMyNotifications()
            .then(data => setNotifications(data))
            .catch(() => toast.error('Không thể tải thông báo'))
            .finally(() => setIsLoading(false));
    }, [isAuthenticated, isApplicant]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const markAsRead = async (id: string) => {
        try {
            await applicationService.markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: NotificationReadStatus.READ } : n));
        } catch {
            toast.error('Lỗi cập nhật trạng thái');
        }
    };

    const markAllAsRead = async () => {
        try {
            await applicationService.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, status: NotificationReadStatus.READ })));
            toast.success('Đã đọc tất cả');
        } catch {
            toast.error('Lỗi cập nhật trạng thái');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await applicationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Đã xóa thông báo');
        } catch {
            toast.error('Lỗi khi xóa');
        }
    };

    if (loading || isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-primary-600 rounded-full"></div></div>;

    const filtered = notifications.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.job_title_snapshot?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedNotifs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const unreadCount = notifications.filter(n => n.status === NotificationReadStatus.UNREAD).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        Quản lý Thông báo
                        {unreadCount > 0 && (
                            <span className="bg-error-500 text-white text-xs px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                                {unreadCount} chưa đọc
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cập nhật nhanh nhất trạng thái hồ sơ và lời mời từ doanh nghiệp.</p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Đánh dấu đã đọc tất cả
                    </button>
                )}
            </div>

            {/* Search */}
            {notifications.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm thông báo theo tiêu đề hoặc tên công việc..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 transition-colors shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            )}

            {/* Danh sách */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {paginatedNotifs.map(notification => {
                        const notifConfig = NOTIFICATION_CONFIG[notification.type as NotificationType] || NOTIFICATION_CONFIG[NotificationType.INFO];
                        const IconComponent = notifConfig.icon;

                        return (
                            <div key={notification.id} className={`p-5 md:p-6 transition-all duration-200 border-l-4 ${notification.status === NotificationReadStatus.UNREAD ? 'bg-primary-50/30 dark:bg-primary-500/5 border-l-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10' : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${notifConfig.color} shrink-0`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white md:text-lg">{notification.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>

                                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                                {notification.job_title_snapshot && (
                                                    <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                                                        <Briefcase className="w-3.5 h-3.5" /> {notification.job_title_snapshot}
                                                    </span>
                                                )}
                                                {notification.application_status_snapshot && (
                                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${APPLICATION_STATUS_CONFIG[notification.application_status_snapshot as ApplicationStatus]?.color || 'bg-slate-100 text-slate-600'}`}>
                                                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> {APPLICATION_STATUS_CONFIG[notification.application_status_snapshot as ApplicationStatus]?.label}
                                                    </span>
                                                )}
                                                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" /> {new Date(notification.created_at).toLocaleString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pl-14 md:pl-0">
                                        {notification.status === NotificationReadStatus.UNREAD && (
                                            <button onClick={() => markAsRead(notification.id)} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:text-primary-600 rounded-lg text-xs font-bold transition-all shadow-sm">
                                                Đánh dấu đã đọc
                                            </button>
                                        )}
                                        <button onClick={() => deleteNotification(notification.id)} className="p-2 text-slate-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Không tìm thấy thông báo nào.</p>
                    </div>
                )}

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> kết quả
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors shadow-sm ${currentPage === page ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-white hover:border-slate-200'}`}>{page}</button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}