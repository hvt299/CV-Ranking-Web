'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Clock, Briefcase, Eye, RefreshCw, ChevronDown, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { Notification, NotificationReadStatus, ApplicationStatus, UserRole, NotificationType } from '@/types';
import { applicationService } from '@/features/application/application.service';
import { NOTIFICATION_CONFIG, APPLICATION_STATUS_CONFIG } from '@/constants/application.constants';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/utils';

export default function NotificationBell() {
    const { user, isAuthenticated, loading } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const role = user?.role;

    const canViewNotifications =
        role === UserRole.APPLICANT ||
        role === UserRole.HR_OWNER ||
        role === UserRole.HR_MEMBER ||
        role === UserRole.ADMIN;

    const getRoleDisplayName = () => {
        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
            return 'Nhà tuyển dụng';
        }

        if (role === UserRole.ADMIN) {
            return 'Quản trị viên';
        }

        return 'Ứng viên';
    };

    const getNotificationRoute = () => {
        if (role === UserRole.ADMIN) {
            return ROUTES.ADMIN_NOTIFICATIONS;
        }

        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
            return ROUTES.HR_NOTIFICATIONS;
        }

        return ROUTES.APPLICANT_NOTIFICATIONS;
    };

    const fetchNotifications = async () => {
        if (!isAuthenticated || !canViewNotifications) return;

        try {
            const data = await applicationService.getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [isAuthenticated, canViewNotifications]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter((n) => n.status === NotificationReadStatus.UNREAD).length;

    if (loading || !canViewNotifications) return null;

    const markAsRead = async (notificationId: string) => {
        try {
            await applicationService.markNotificationAsRead(notificationId);

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId
                        ? { ...n, status: NotificationReadStatus.READ }
                        : n
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await applicationService.markAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    status: NotificationReadStatus.READ,
                }))
            );

            toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            toast.error('Không thể đánh dấu thông báo');
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await applicationService.deleteNotification(notificationId);

            setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId)
            );

            toast.success('Đã xóa thông báo');
        } catch (error) {
            toast.error('Không thể xóa thông báo');
        }
    };

    const getStatusText = (status: string) => {
        return APPLICATION_STATUS_CONFIG[status as ApplicationStatus]?.label || status;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={async () => { const next = !isOpen; setIsOpen(next); if (next) await fetchNotifications(); }} className={cn('relative flex h-10 w-10 items-center justify-center rounded-full transition-colors', isOpen ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400')} aria-expanded={isOpen} aria-haspopup="menu" aria-label="Thông báo">
                <Bell className={cn('h-4.5 w-4.5', unreadCount > 0 && 'animate-pulse')} />

                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                    <div className="border-b border-slate-100 px-4 pb-3 pt-2 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Thông báo</h3>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả thông báo đã đọc'}
                                </p>
                            </div>

                            <div className="flex items-center gap-1">
                                {unreadCount > 0 && (
                                    <button type="button" onClick={markAllAsRead} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10">
                                        <CheckCheck className="h-3.5 w-3.5" />
                                        Đánh dấu tất cả
                                    </button>
                                )}

                                <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Đóng thông báo">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                </div>

                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Chưa có thông báo nào
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Các thông báo mới sẽ xuất hiện tại đây
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {notifications.map((notification) => {
                                    const notifConfig = NOTIFICATION_CONFIG[notification.type as NotificationType] || NOTIFICATION_CONFIG[NotificationType.INFO];
                                    const IconComponent = notifConfig.icon;
                                    const colorClass = notifConfig.color;
                                    const isUnread = notification.status === NotificationReadStatus.UNREAD;

                                    return (
                                        <div key={notification.id} className={cn('cursor-pointer border-l-4 p-4 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50', isUnread ? 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-500/5' : 'border-l-transparent')}>
                                            <div className="flex items-start gap-3">
                                                <div className={cn('shrink-0 rounded-lg p-2', colorClass)}>
                                                    <IconComponent className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {notification.title}
                                                            </h4>

                                                            {notification.job_title_snapshot && (
                                                                <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                                    <Briefcase className="h-3 w-3" />
                                                                    {notification.job_title_snapshot}
                                                                </p>
                                                            )}

                                                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                                                {notification.message}
                                                            </p>

                                                            {notification.application_status_snapshot && (() => {
                                                                const statusKey = notification.application_status_snapshot as ApplicationStatus;
                                                                const statusInfo = APPLICATION_STATUS_CONFIG[statusKey];
                                                                const badgeColor = statusInfo?.color || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';

                                                                return (
                                                                    <span className={cn('mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium', badgeColor)}>
                                                                        <RefreshCw className="h-3 w-3 animate-spin-slow" />
                                                                        Trạng thái: {getStatusText(notification.application_status_snapshot)}
                                                                    </span>
                                                                );
                                                            })()}

                                                            <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(notification.created_at).toLocaleString('vi-VN')}
                                                            </p>
                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-1">
                                                            {isUnread && (
                                                                <button type="button" onClick={() => markAsRead(notification.id)} className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400" title="Đánh dấu đã đọc">
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}

                                                            <button type="button" onClick={() => deleteNotification(notification.id)} className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" title="Xóa thông báo">
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                        <a href={getNotificationRoute()} onClick={() => setIsOpen(false)} className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                            Xem tất cả thông báo
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}