'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle2, XCircle, Clock, Briefcase, Eye } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    status: 'unread' | 'read';
    created_at: string;
    job_title?: string;
    application_id?: string;
    application_status?: string;
}

const NOTIFICATION_ICONS = {
    success: CheckCircle2,
    error: XCircle,
    info: Briefcase,
    warning: Clock
};

const NOTIFICATION_COLORS = {
    success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
    error: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10',
    info: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10'
};

export default function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    useEffect(() => {
        fetchNotifications();
        
        // Poll for new notifications every 30 seconds
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
        // Only fetch if user is authenticated
        if (!isAuthenticated) return;
        
        try {
            const response = await api.get('/apply/notifications');
            const newNotifications = response.data;
            
            // Check for new unread notifications
            const currentUnreadCount = notifications.filter((n: Notification) => n.status === 'unread').length;
            const newUnreadCount = newNotifications.filter((n: Notification) => n.status === 'unread').length;
            
            // If there are new unread notifications, show a subtle indication
            if (newUnreadCount > currentUnreadCount && notifications.length > 0) {
                // Optional: Play notification sound or show toast
                // You can uncomment the line below to show a toast for new notifications
                // toast.success('Bạn có thông báo mới!');
            }
            
            setNotifications(newNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await api.patch(`/apply/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/apply/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
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
        const IconComponent = NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] || Briefcase;
        return IconComponent;
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            'pending': 'Đang xem xét',
            'reviewing': 'Đang đánh giá',
            'interview': 'Mời phỏng vấn',
            'offer': 'Đề nghị làm việc',
            'accepted': 'Trúng tuyển',
            'rejected': 'Từ chối',
            'withdrawn': 'Đã rút hồ sơ'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ''}`}
                title={`Thông báo${unreadCount > 0 ? ` - ${unreadCount} thông báo chưa đọc` : ''}`}
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white">Thông báo</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Đánh dấu tất cả
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Chưa có thông báo nào</p>
                                <p className="text-slate-400 text-xs mt-1">Thông báo về trạng thái ứng tuyển sẽ hiển thị ở đây</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {notifications.map((notification) => {
                                    const IconComponent = getNotificationIcon(notification.type);
                                    const colorClass = NOTIFICATION_COLORS[notification.type];
                                    
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer border-l-4 ${
                                                notification.status === 'unread' 
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
                                                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                                                                {notification.title}
                                                            </h4>
                                                            {notification.job_title && (
                                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md inline-block">
                                                                    📋 {notification.job_title}
                                                                </p>
                                                            )}
                                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                                                {notification.message}
                                                            </p>
                                                            {notification.application_status && (
                                                                <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                                                                    notification.application_status === 'Trúng tuyển' || notification.application_status === 'Đề nghị (Offer)' || notification.application_status === 'Phỏng vấn'
                                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                                                        : notification.application_status === 'Từ chối'
                                                                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                                }`}>
                                                                    🔄 Trạng thái: {getStatusText(notification.application_status)}
                                                                </span>
                                                            )}
                                                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                                                🕒 {new Date(notification.created_at).toLocaleString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-1">
                                                            {notification.status === 'unread' && (
                                                                <button
                                                                    onClick={() => markAsRead(notification.id)}
                                                                    className="p-1 text-slate-400 hover:text-blue-600 rounded"
                                                                    title="Đánh dấu đã đọc"
                                                                >
                                                                    <Eye className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteNotification(notification.id)}
                                                                className="p-1 text-slate-400 hover:text-red-600 rounded"
                                                                title="Xóa thông báo"
                                                            >
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

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // Navigate to notifications page if exists
                                    window.location.href = '/my-applications';
                                }}
                                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Xem tất cả hồ sơ
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}