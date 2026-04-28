'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import NotificationBell from '@/components/shared/NotificationBell';
import NotificationToast from '@/components/shared/NotificationToast';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const navItems = [
        { href: '/apply', label: 'Tìm việc', icon: Briefcase },
        { href: '/my-applications', label: 'Hồ sơ của tôi', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a]">
            <aside className="w-60 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
                <div className="px-6 py-5 border-b border-slate-700">
                    <h1 className="text-lg font-bold">CV Ranking AI</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Cổng ứng tuyển</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith(href) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </Link>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-slate-700">
                    {user && (
                        <div className="px-3 py-2 mb-2">
                            <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                {/* Header with notifications */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                            {pathname === '/apply' ? 'Tìm việc làm' : 
                             pathname === '/my-applications' ? 'Hồ sơ của tôi' : 'Ứng tuyển'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
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
                        
                        {/* User Avatar */}
                        <div className="flex items-center gap-2">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random`}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </div>
                </header>
                
                {children}
            </main>
            
            {/* Toast Notifications */}
            <NotificationToast />
        </div>
    );
}
