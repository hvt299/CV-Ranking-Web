'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hexagon, Search, Building2, Briefcase, LayoutDashboard, CreditCard } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PublicHeaderProps {
    isAuthenticated?: boolean;
    user?: any;
    isScrolled?: boolean;
}

export default function PublicHeader({ isAuthenticated = false, user = null, isScrolled = false }: PublicHeaderProps) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Bổ sung "Bảng giá" để đồng bộ với Footer
    const navLinks = [
        { name: 'Trang chủ', href: '/', icon: Hexagon },
        { name: 'Việc làm', href: '/careers', icon: Search },
        { name: 'Công ty', href: '/companies', icon: Building2 },
        { name: 'Bảng giá', href: '/pricing', icon: CreditCard },
    ];

    // Xác định link dẫn vào hệ thống tùy theo Role
    const systemLink = user?.role === 'applicant' ? '/apply' : '/dashboard';

    return (
        <header
            // FIX: Thêm border-b cố định, chuyển đổi giữa transparent và slate-200 để tránh Glitch UI
            className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled
                ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-slate-200 dark:border-slate-800 py-3'
                : 'bg-transparent border-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                            ATS<span className="text-blue-600">SYSTEM</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Nút đổi Theme */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

                    {isAuthenticated ? (
                        <Link
                            href={systemLink}
                            className="px-6 py-2.5 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full shadow-lg transition-all flex items-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Vào hệ thống
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:flex px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Dùng thử ngay
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}