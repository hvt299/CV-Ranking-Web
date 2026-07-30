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
            className={`fixed top-0 z-50 w-full border-b transition-all duration-normal ${isScrolled
                    ? 'bg-background dark:bg-slate-900 border-border dark:border-slate-800 py-3'
                    : 'bg-transparent border-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-800 rounded-button flex items-center justify-center shadow-card-hover group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-text dark:text-white">
                            ATS<span className="text-primary-600 dark:text-primary-400">SYSTEM</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2.5 rounded-pill text-sm font-bold transition-all ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-primary-600 dark:text-blue-400'
                                        : 'text-text-muted dark:text-slate-400 hover:text-text dark:hover:text-white'
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
                            className="p-2.5 text-text-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-pill transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    <div className="hidden sm:block w-px h-6 bg-border dark:bg-slate-700"></div>

                    {isAuthenticated ? (
                        <Link
                            href={systemLink}
                            className="px-6 py-2.5 text-sm font-bold bg-text dark:bg-white hover:bg-slate-800 dark:hover:bg-surface-hover rounded-pill shadow-card-hover transition-all flex items-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Vào hệ thống
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:flex px-4 py-2 text-sm font-bold text-text dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors">
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="px-6 py-2.5 text-sm font-bold bg-button-primary-bg hover:bg-button-primary-hover text-white rounded-pill shadow-card-hover shadow-blue-500/25 transition-all flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Dùng thử ngay
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}