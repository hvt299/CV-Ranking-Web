'use client';

import { Search, Sun, Moon, Menu, Home, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';
import NotificationBell from '@/components/shared/NotificationBell';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';

interface HeaderProps {
    setIsMobileOpen: (val: boolean) => void;
}

export default function Header({ setIsMobileOpen }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const role = user?.role || UserRole.APPLICANT;

    const getRoleDisplayName = () => {
        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) return 'Nhà tuyển dụng';
        if (role === UserRole.ADMIN) return 'Quản trị viên';
        return 'Ứng viên';
    };

    return (
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">

            {/* ================= TRÁI: MOBILE MENU TONGGLE & TITLE/SEARCH ================= */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 focus-within:border-primary-500 dark:focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all w-80">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* ================= PHẢI: TOOLS & PROFILE ================= */}
            <div className="flex items-center gap-3 md:gap-4">

                {/* 1. Nút Đổi Theme */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2.5 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-colors"
                        title="Chuyển đổi giao diện"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                )}

                {/* 2. Chuông Thông Báo */}
                <NotificationBell />

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>

                {/* 3. User Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 md:gap-3 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <img
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random`}
                            alt="Avatar"
                            className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                            referrerPolicy="no-referrer"
                        />
                        <div className="hidden md:flex flex-col items-start text-left">
                            <span className="text-sm font-bold text-slate-700 dark:text-white leading-tight line-clamp-1 max-w-30">
                                {user?.full_name || 'User'}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                                {getRoleDisplayName()}
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.full_name || 'User'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'email@example.com'}</p>
                            </div>

                            <Link
                                href={role === UserRole.ADMIN ? ROUTES.ADMIN_SETTINGS : (role === UserRole.APPLICANT ? ROUTES.APPLICANT_PROFILE : ROUTES.HR_SETTINGS)}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <Settings className="w-4 h-4" /> Thiết lập thông tin
                            </Link>

                            <Link href={ROUTES.HOME} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <Home className="w-4 h-4" /> Về trang chủ
                            </Link>

                            <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-2"></div>

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    logout(router);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}