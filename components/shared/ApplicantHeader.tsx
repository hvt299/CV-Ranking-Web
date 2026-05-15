'use client';

import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import NotificationBell from '@/components/shared/NotificationBell';

interface ApplicantHeaderProps {
    setIsMobileOpen: (val: boolean) => void;
}

export default function ApplicantHeader({ setIsMobileOpen }: ApplicantHeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const pathname = usePathname();

    useEffect(() => setMounted(true), []);

    const getPageTitle = () => {
        switch (pathname) {
            case '/apply':
                return 'Tìm việc làm';
            case '/my-applications':
                return 'Hồ sơ của tôi';
            case '/profile':
                return 'Thông tin cá nhân';
            default:
                return 'Ứng tuyển';
        }
    };

    return (
        <header className="h-20 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">
            
            <div className="flex items-center gap-4 flex-1">
                {/* Hamburger button (Mobile only) */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Page title */}
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                        {getPageTitle()}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                        Chào mừng trở lại, {user?.full_name || 'Ứng viên'}
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                {/* Theme toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-amber-400 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full"
                        title="Chuyển đổi giao diện"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                {/* Divider */}
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>

                {/* User avatar */}
                <div className="flex items-center gap-2">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="hidden md:flex flex-col items-start text-left">
                        <span className="text-sm font-bold text-slate-700 dark:text-white leading-tight line-clamp-1">
                            {user?.full_name || 'Ứng viên'}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                            Ứng tuyển viên
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}