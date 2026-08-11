'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import {
    Hexagon, Sun, Moon, User, Home, LogOut, ChevronDown,
    Menu, X, LayoutDashboard, FolderOpen, FileText, ClipboardCheck,
    Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/shared/NotificationBell';
import { UserRole } from '@/types';

const NAV_ITEMS = [
    { name: 'Tổng quan', href: '/overview', icon: LayoutDashboard },
    { name: 'Thư viện CV', href: '/cv-library', icon: FolderOpen },
    { name: 'Việc làm đã nộp', href: '/my-applications', icon: FileText },
    { name: 'Tự đánh giá AI', href: '/self-score', icon: ClipboardCheck },
];

export default function ApplicantHeader() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const role = user?.role || UserRole.APPLICANT;

    const getRoleDisplayName = () => {
        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) return 'Nhà tuyển dụng';
        if (role === UserRole.ADMIN) return 'Quản trị viên';
        return 'Ứng viên';
    };

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await logout();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between">

                {/* TRÁI: LOGO & DESKTOP NAV */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 group relative z-50">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">
                            ATS<span className="text-blue-600 dark:text-blue-400">SYSTEM</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isActive
                                        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                                    {item.name}
                                    {item.name === 'Tự đánh giá AI' && (
                                        <span className="ml-1 px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm">
                                            Pro
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* PHẢI: TOOLS & PROFILE */}
                <div className="flex items-center gap-3 md:gap-4 relative z-50">

                    {/* 1. Nút Đổi Theme */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors hidden sm:flex items-center justify-center"
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
                            className="flex items-center gap-2.5 p-1 pr-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full transition-colors"
                        >
                            <img
                                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random`}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
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

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.full_name || 'User'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'email@example.com'}</p>
                                </div>

                                <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <User className="w-4 h-4" /> Hồ sơ cá nhân
                                </Link>

                                <Link href="/" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <Home className="w-4 h-4" /> Về trang chủ
                                </Link>

                                <Link href="/careers" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <Briefcase className="w-4 h-4" /> Về trang tìm việc
                                </Link>

                                <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-2"></div>

                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                    <LogOut className="w-4 h-4" /> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="xl:hidden p-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* MOBILE NAV OVERLAY */}
            <div className={`absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 overflow-hidden xl:hidden flex flex-col ${isMobileMenuOpen ? 'max-h-[calc(100vh-80px)] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 flex flex-col gap-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                                {item.name}
                                {item.name === 'Tự đánh giá AI' && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm">
                                        Pro
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    {/* Bổ sung Theme Toggle cho Mobile */}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
                    </button>
                </div>
            </div>
        </header>
    );
}