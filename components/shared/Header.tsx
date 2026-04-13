'use client';

import { Search, Bell, Sun, Moon, Menu, User, Home, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
    setIsMobileOpen: (val: boolean) => void;
}

export default function Header({ setIsMobileOpen }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

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

    return (
        <header className="h-20 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">

            <div className="flex items-center gap-4 flex-1">
                {/* Nút Hamburger (Chỉ hiện trên Mobile) */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Thanh tìm kiếm tổng (Ẩn trên màn hình quá nhỏ để nhường chỗ cho Logo nếu cần) */}
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm ứng viên, vị trí, kỹ năng..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:bg-white dark:focus:bg-[#1e293b] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium placeholder:font-normal placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Khối Hành động (Theme, Thông báo & User) */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                {/* Nút Toggle Theme */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-amber-400 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full"
                        title="Chuyển đổi giao diện"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                )}

                {/* Nút Thông báo */}
                <button className="relative p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full mr-1 md:mr-2">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#0f172a] rounded-full"></span>
                </button>

                {/* Đường phân cách */}
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2.5 p-1.5 pr-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'HR')}&background=random`}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div className="hidden md:flex flex-col items-start text-left">
                            <span className="text-sm font-bold text-slate-700 dark:text-white leading-tight line-clamp-1">{user?.full_name || 'HR Admin'}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">Tuyển dụng</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2">
                            {/* Thông tin user (Chỉ hiện trên Mobile trong dropdown vì trên header bị ẩn) */}
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 mb-2 md:hidden">
                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.full_name || 'HR Admin'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'hr@company.com'}</p>
                            </div>

                            <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <User className="w-4 h-4" /> Hồ sơ của bạn
                            </Link>
                            <Link href="/" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <Home className="w-4 h-4" /> Về trang chủ
                            </Link>

                            <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-2"></div>

                            <button onClick={() => { setIsDropdownOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                <LogOut className="w-4 h-4" /> Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}