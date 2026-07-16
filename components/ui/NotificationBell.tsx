'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle2, XCircle, Clock, Briefcase, Eye } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Notification, NotificationReadStatus, NotificationType, ApplicationStatus } from '@/types';

const NOTIFICATION_ICONS = {
    [NotificationType.SUCCESS]: CheckCircle2,
    [NotificationType.ERROR]: XCircle,
    [NotificationType.INFO]: Briefcase,
    [NotificationType.WARNING]: Clock
};

const NOTIFICATION_COLORS = {
    [NotificationType.SUCCESS]: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
    [NotificationType.ERROR]: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10',
    [NotificationType.INFO]: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    [NotificationType.WARNING]: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10'
};

export default function NotificationBell() {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => n.status === NotificationReadStatus.UNREAD).length;

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await api.get('/apply/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await api.patch(`/apply/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, status: NotificationReadStatus.READ } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/apply/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, status: NotificationReadStatus.READ })));
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            toast.error('Không thể đánh dấu thông báo');
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await api.delete(`/apply/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            toast.success('Đã xóa thông báo');
        } catch (error) {
            toast.error('Không thể xóa thông báo');
        }
    };

    const getNotificationIcon = (type: string) => {
        return NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] || Briefcase;
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            [ApplicationStatus.NEW]: 'Mới nộp',
            [ApplicationStatus.REVIEWING]: 'Đang đánh giá',
            [ApplicationStatus.INTERVIEW]: 'Mời phỏng vấn',
            [ApplicationStatus.OFFERED]: 'Đề nghị làm việc',
            [ApplicationStatus.HIRED]: 'Trúng tuyển',
            [ApplicationStatus.REJECTED]: 'Từ chối',
            [ApplicationStatus.WITHDRAWN]: 'Đã rút hồ sơ'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
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
                                    const IconComponent = getNotificationIcon(notification.type);
                                    const colorClass = NOTIFICATION_COLORS[notification.type as keyof typeof NOTIFICATION_COLORS] || NOTIFICATION_COLORS.info;

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
                                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md inline-block">
                                                                    📋 {notification.job_title_snapshot}
                                                                </p>
                                                            )}
                                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{notification.message}</p>

                                                            {notification.application_status_snapshot && (
                                                                <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${['hired', 'offered', 'interview'].includes(notification.application_status_snapshot)
                                                                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                                                    : notification.application_status_snapshot === 'rejected'
                                                                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                                    }`}>
                                                                    🔄 Trạng thái: {getStatusText(notification.application_status_snapshot)}
                                                                </span>
                                                            )}
                                                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                                                🕒 {new Date(notification.created_at).toLocaleString('vi-VN')}
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
                </div>
            )}
        </div>
    );
}