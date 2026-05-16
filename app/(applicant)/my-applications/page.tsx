'use client';

import { useState, useEffect } from 'react';
import { FileText, Briefcase, Bell, Eye, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/ui/StatusBadge';

const STATUS_COLORS: Record<string, string> = {
    'Mới': 'bg-blue-100 text-blue-700',
    'Đang xem xét': 'bg-amber-100 text-amber-700',
    'Phỏng vấn': 'bg-purple-100 text-purple-700',
    'Đề nghị (Offer)': 'bg-indigo-100 text-indigo-700',
    'Trúng tuyển': 'bg-emerald-100 text-emerald-700',
    'Từ chối': 'bg-rose-100 text-rose-700',
};

export default function MyApplicationsPage() {
    const [apps, setApps] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get('/apply/my-applications'),
            api.get('/apply/notifications')
        ])
        .then(([appsRes, notifRes]) => {
            setApps(appsRes.data);
            setNotifications(notifRes.data);
        })
        .catch(() => toast.error('Không thể tải dữ liệu'))
        .finally(() => setIsLoading(false));
    }, []);

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            await api.patch(`/apply/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
            );
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

    const unreadNotifications = notifications.filter(n => n.status === 'unread');

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 pb-20 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Hồ sơ đã nộp</h1>
                    <p className="text-slate-500 mt-1">Theo dõi trạng thái ứng tuyển của bạn</p>
                </div>
                
                {unreadNotifications.length > 0 && (
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        Thông báo mới ({unreadNotifications.length})
                    </button>
                )}
            </div>

            {/* Recent Notifications */}
            {showNotifications && unreadNotifications.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">Thông báo mới</h2>
                    <div className="space-y-3">
                        {unreadNotifications.slice(0, 3).map(notification => (
                            <div key={notification.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-blue-200 dark:border-slate-600">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-white">{notification.title}</h3>
                                        {notification.job_title && (
                                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                                                {notification.job_title}
                                            </p>
                                        )}
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2">
                                            {new Date(notification.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => markNotificationAsRead(notification.id)}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                            title="Đánh dấu đã đọc"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                                            title="Xóa thông báo"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {apps.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Bạn chưa nộp hồ sơ nào. <a href="/apply" className="text-blue-600 font-bold hover:underline">Tìm việc ngay</a></p>
                </div>
            ) : (
                <div className="space-y-4">
                    {apps.map(app => {
                        return (
                            <div key={app.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white">{app.job_title}</h3>
                                            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                                                <FileText className="w-3.5 h-3.5" /> {app.filename}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Nộp lúc: {new Date(app.submitted_at).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Status */}
                                        <StatusBadge status={app.status} showIcon={true} />
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
