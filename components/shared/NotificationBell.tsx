'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Clock, Briefcase, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { Notification, NotificationReadStatus, ApplicationStatus, UserRole, NotificationType } from '@/types';
import { applicationService } from '@/features/application/application.service';
import { NOTIFICATION_CONFIG, APPLICATION_STATUS_CONFIG } from "@/constants/application.constants";

export default function NotificationBell() {
    const { user, isAuthenticated, loading } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isApplicant = user?.role === UserRole.APPLICANT;

    const fetchNotifications = async () => {
        if (!isAuthenticated || !isApplicant) return;
        try {
            const data = await applicationService.getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [isAuthenticated, isApplicant]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => n.status === NotificationReadStatus.UNREAD).length;

    if (loading || !isApplicant) return null;

    const markAsRead = async (notificationId: string) => {
        try {
            await applicationService.markNotificationAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, status: NotificationReadStatus.READ } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await applicationService.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, status: NotificationReadStatus.READ })));
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            toast.error('Không thể đánh dấu thông báo');
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await applicationService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
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
            <button
                onClick={async () => {
                    const next = !isOpen;
                    setIsOpen(next);

                    if (next) {
                        await fetchNotifications();
                    }
                }}
                className="relative p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white">Thông báo</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Đánh dấu tất cả</button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Chưa có thông báo nào</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {notifications.map((notification) => {
                                    const notifConfig = NOTIFICATION_CONFIG[notification.type as NotificationType] || NOTIFICATION_CONFIG[NotificationType.INFO];
                                    const IconComponent = notifConfig.icon;
                                    const colorClass = notifConfig.color;

                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer border-l-4 ${notification.status === NotificationReadStatus.UNREAD
                                                ? 'bg-blue-50/50 dark:bg-blue-500/5 border-l-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                                                : 'border-l-transparent hover:border-l-slate-200 dark:hover:border-l-slate-600'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${colorClass} shrink-0`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{notification.title}</h4>

                                                            {notification.job_title_snapshot && (
                                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md inline-flex items-center gap-1">
                                                                    <Briefcase className="w-3 h-3" />
                                                                    {notification.job_title_snapshot}
                                                                </p>
                                                            )}

                                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{notification.message}</p>

                                                            {notification.application_status_snapshot && (() => {
                                                                const statusKey = notification.application_status_snapshot as ApplicationStatus;
                                                                const statusInfo = APPLICATION_STATUS_CONFIG[statusKey];
                                                                const badgeColor = statusInfo?.color || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';

                                                                return (
                                                                    <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 text-xs font-medium rounded-full ${badgeColor}`}>
                                                                        <RefreshCw className="w-3 h-3 animate-spin-slow" />
                                                                        Trạng thái: {getStatusText(notification.application_status_snapshot)}
                                                                    </span>
                                                                );
                                                            })()}

                                                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(notification.created_at).toLocaleString('vi-VN')}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            {notification.status === NotificationReadStatus.UNREAD && (
                                                                <button onClick={() => markAsRead(notification.id)} className="p-1 text-slate-400 hover:text-blue-600 rounded">
                                                                    <Eye className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteNotification(notification.id)} className="p-1 text-slate-400 hover:text-red-600 rounded">
                                                                <X className="w-3 h-3" />
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
                    
                    {/* Nút Xem tất cả */}
                    <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl text-center">
                        <a href="/notifications" className="text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline">
                            Xem tất cả thông báo
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}