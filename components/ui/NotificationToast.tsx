'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ToastNotification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    job_title?: string;
}

const TOAST_ICONS = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertCircle
};

const TOAST_COLORS = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
};

export default function NotificationToast() {
    const { isAuthenticated } = useAuth();
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    const [lastChecked, setLastChecked] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(checkForNewNotifications, 30000);
        return () => clearInterval(interval);
    }, [lastChecked]);

    const checkForNewNotifications = async () => {
        if (!isAuthenticated) return;
        
        try {
            const response = await api.get('/apply/notifications');
            const notifications = response.data;
            
            const newNotifications = notifications.filter((n: any) => 
                n.status === 'unread' && new Date(n.created_at) > lastChecked
            );

            if (newNotifications.length > 0) {
                newNotifications.forEach((notification: any) => {
                    showToast({
                        id: notification.id,
                        title: notification.title,
                        message: notification.message,
                        type: notification.type,
                        job_title: notification.job_title
                    });
                });
                
                setLastChecked(new Date());
            }
        } catch (error) {
            console.error('Failed to check for new notifications:', error);
        }
    };

    const showToast = (notification: ToastNotification) => {
        setToasts(prev => [...prev, notification]);
        
        setTimeout(() => {
            removeToast(notification.id);
        }, 8000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => {
                const IconComponent = TOAST_ICONS[toast.type];
                const colorClass = TOAST_COLORS[toast.type];
                
                return (
                    <div
                        key={toast.id}
                        className={`max-w-sm p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-full ${colorClass}`}
                    >
                        <div className="flex items-start gap-3">
                            <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm">{toast.title}</h4>
                                {toast.job_title && (
                                    <p className="text-xs font-medium opacity-80 mt-0.5">
                                        {toast.job_title}
                                    </p>
                                )}
                                <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}